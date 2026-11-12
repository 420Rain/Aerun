export type TimeKey = `${number} ${'AM' | 'PM'}`;
export const TIME_OPTIONS: TimeKey[] = Array.from({ length: 24 }, (_, hour) => {
  const suffix = hour < 12 ? 'AM' : 'PM';
  const displayHour = hour % 12 || 12;
  return `${displayHour} ${suffix}` as TimeKey;
});

export type RouteKey = 'baywalk' | 'taft' | 'roxas' | 'parqal' | 'intramuros';
export const TIMES: TimeKey[] = TIME_OPTIONS;

export type Condition = {
  pm: string;
  pmMid: number;
  uncertainty: string;
  weather: string;
  temperature: number;
  rain: number;
  wind: number;
  note: string;
  recommendation: string;
};

function hourFromKey(time: TimeKey) {
  const [rawHour, period] = time.split(' ');
  const hour = Number(rawHour) % 12;
  return period === 'PM' ? hour + 12 : hour;
}

export function getCondition(time: TimeKey): Condition {
  const hour = hourFromKey(time);
  let pmMid = 13;
  let temperature = 27;
  let rain = 12;
  let wind = 7;
  let weather = 'Mostly clear';

  if (hour >= 5 && hour <= 9) {
    pmMid = 17 + (hour >= 7 ? 3 : 0);
    temperature = 27 + (hour - 5);
    rain = 10 + ((hour * 3) % 12);
    wind = 7 + (hour % 4);
    weather = hour < 7 ? 'Clear morning' : 'Partly cloudy';
  } else if (hour >= 10 && hour <= 15) {
    pmMid = 24 + (hour === 12 || hour === 13 ? 2 : 0);
    temperature = hour < 12 ? 31 : 33;
    rain = 8 + ((hour * 2) % 15);
    wind = 9 + (hour % 4);
    weather = hour > 13 ? 'Clouds building' : 'Sunny intervals';
  } else if (hour >= 16 && hour <= 19) {
    pmMid = 22 + (hour === 18 ? 3 : 0);
    temperature = 31 - Math.floor((hour - 16) / 2);
    rain = 18 + ((hour * 5) % 17);
    wind = 10 + (hour % 5);
    weather = 'Cloudy';
  } else if (hour >= 20 || hour <= 4) {
    pmMid = hour <= 4 ? 12 : 15;
    temperature = hour <= 4 ? 26 : 28 - Math.floor((hour - 20) / 3);
    rain = 8 + ((hour * 4) % 16);
    wind = 6 + (hour % 5);
    weather = hour <= 4 ? 'Mostly clear' : 'Partly cloudy';
  }

  const lower = Math.max(7, Math.round(pmMid - 4));
  const upper = Math.round(pmMid + 4);
  const uncertainty = pmMid >= 22 ? '±8 µg/m³' : '±6 µg/m³';
  let recommendation = 'A reasonable-looking window in this illustrative forecast. Check current conditions before heading out.';
  let note = 'Conditions are simulated for this hour and are not a live forecast.';

  if (temperature >= 32) {
    recommendation = 'Consider a cooler hour';
    note = 'The mock forecast is warm around this time. An early morning or later evening slot may feel more comfortable.';
  } else if (pmMid >= 22) {
    recommendation = 'Consider a quieter hour';
    note = 'The illustrative PM2.5 range is higher around this period, which may coincide with busier roads and daytime activity.';
  } else if (hour >= 5 && hour <= 9) {
    recommendation = 'A morning run window';
    note = 'Temperatures are still moderate in this sample scenario. Expect activity to build as the morning progresses.';
  } else if (hour >= 20 || hour <= 4) {
    recommendation = 'A calmer late-hour window';
    note = 'The simulated conditions are cooler and less busy, but choose a well-lit route and stay aware of your surroundings.';
  } else if (hour >= 16 && hour <= 19) {
    recommendation = 'Check the evening conditions';
    note = 'Temperatures ease later in the day, although traffic and passing showers may affect the experience.';
  }

  return {
    pm: `${lower}–${upper}`,
    pmMid,
    uncertainty,
    weather,
    temperature,
    rain: Math.min(45, rain),
    wind,
    note,
    recommendation,
  };
}

export const CONDITIONS: Record<TimeKey, Condition> = Object.fromEntries(
  TIME_OPTIONS.map(time => [time, getCondition(time)]),
) as Record<TimeKey, Condition>;

export const ROUTES: Record<RouteKey, {
  name: string;
  area: string;
  distance: string;
  duration: string;
  pmOffset: number;
  tradeoff: string;
  color: string;
  path: [number, number][];
}> = {
  baywalk: {
    name: 'Baywalk Promenade Loop', area: 'Roxas Boulevard · Manila Bay', distance: '5.2 km', duration: '36–42 min', pmOffset: -2,
    tradeoff: 'Open waterfront stretches with wide views; fewer shaded sections at midday.', color: '#168B83',
    path: [[70, 86], [73, 77], [75, 67], [76, 57], [78, 47], [80, 37], [82, 28], [84, 19]],
  },
  taft: {
    name: 'Taft–Luneta City Loop', area: 'Taft Avenue · Ermita · Luneta', distance: '4.6 km', duration: '31–38 min', pmOffset: 4,
    tradeoff: 'A more urban route with shaded blocks, crossings, and busier roadside sections.', color: '#D18A43',
    path: [[22, 84], [30, 76], [35, 65], [40, 55], [43, 45], [46, 35], [51, 26], [59, 20]],
  },
  roxas: {
    name: 'Roxas Boulevard Out-and-Back', area: 'Cultural Center · Baywalk · Luneta', distance: '6.4 km', duration: '44–52 min', pmOffset: 1,
    tradeoff: 'Longer bayfront stretches; stay alert around driveways and major crossings.', color: '#6C79B8',
    path: [[57, 89], [60, 78], [63, 66], [65, 55], [67, 44], [70, 34], [73, 25], [75, 17]],
  },
  parqal: {
    name: 'Parqal–Aseana Loop', area: 'Aseana City · Parqal · Macapagal Blvd', distance: '4.8 km', duration: '33–40 min', pmOffset: 2,
    tradeoff: 'Modern, broad streets around Aseana; some sections have wide intersections.', color: '#9A70A8',
    path: [[48, 91], [57, 84], [64, 77], [70, 69], [77, 62], [84, 54], [88, 45]],
  },
  intramuros: {
    name: 'Intramuros Heritage Loop', area: 'Intramuros · Fort Santiago · Luneta', distance: '3.6 km', duration: '25–31 min', pmOffset: 3,
    tradeoff: 'Shorter loop with historic landmarks and narrower streets inside the walled city.', color: '#527F69',
    path: [[25, 40], [31, 32], [40, 29], [50, 31], [56, 39], [53, 49], [43, 53], [33, 49], [25, 40]],
  },
};

export function getRoutePm(routeKey: RouteKey, time: TimeKey) {
  const base = getCondition(time).pmMid + ROUTES[routeKey].pmOffset;
  const lower = Math.max(7, Math.round(base - 4));
  const upper = Math.round(base + 4);
  return `${lower}–${upper}`;
}

export function randomRecordedHour(): TimeKey {
  return TIME_OPTIONS[Math.floor(Math.random() * TIME_OPTIONS.length)];
}
