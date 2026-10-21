export type TimeKey = '8 AM' | '12 PM' | '5 PM' | '9 PM';
export type RouteKey = 'baywalk' | 'taft';

export const TIMES: TimeKey[] = ['8 AM', '12 PM', '5 PM', '9 PM'];

export const CONDITIONS: Record<TimeKey, {
  pm: string; uncertainty: string; weather: string; temperature: number; rain: number; wind: number; note: string;
}> = {
  '8 AM': { pm: '12–18', uncertainty: '±6 µg/m³', weather: 'Partly cloudy', temperature: 29, rain: 10, wind: 8, note: 'A calmer-feeling start in this demo forecast.' },
  '12 PM': { pm: '22–31', uncertainty: '±9 µg/m³', weather: 'Sunny intervals', temperature: 33, rain: 5, wind: 11, note: 'The warmest window in this illustrative day.' },
  '5 PM': { pm: '16–24', uncertainty: '±7 µg/m³', weather: 'Cloudy', temperature: 30, rain: 25, wind: 13, note: 'A breezier option, with a chance of showers.' },
  '9 PM': { pm: '10–16', uncertainty: '±5 µg/m³', weather: 'Mostly clear', temperature: 28, rain: 10, wind: 9, note: 'Cooler evening conditions in the demo model.' },
};

export const ROUTES: Record<RouteKey, {
  name: string; distance: string; duration: string; pm: Record<TimeKey, string>; tradeoff: string; color: string;
}> = {
  baywalk: { name: 'Baywalk Loop', distance: '5.2 km', duration: '36 min', pm: { '8 AM': '10–16', '12 PM': '18–27', '5 PM': '14–21', '9 PM': '9–14' }, tradeoff: 'Open waterfront stretches · longer loop', color: '#527F69' },
  taft: { name: 'Taft City Loop', distance: '4.6 km', duration: '31 min', pm: { '8 AM': '14–21', '12 PM': '25–35', '5 PM': '18–27', '9 PM': '11–18' }, tradeoff: 'More shaded blocks · busier streets', color: '#D18A43' },
};
