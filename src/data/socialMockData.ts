export type SocialComment = { id: string; author: string; initials: string; text: string };
export type SocialConditions = { pm: string; weather: string; time: string };
export type SocialPost = {
  id: string;
  runnerId: string;
  displayName: string;
  initials: string;
  postedAt: string;
  location: string;
  distance: string;
  duration: string;
  pace: string;
  caption: string;
  conditions: SocialConditions;
  likes: number;
  liked: boolean;
  comments: SocialComment[];
  following: boolean;
  isMine?: boolean;
};

export type DemoChallenge = {
  id: string;
  title: string;
  detail: string;
  goal: number;
  unit: 'km' | 'runs';
  progress: number;
  joined: boolean;
  accent: string;
};

export const SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'post-roe', runnerId: 'roe', displayName: 'Roe Dizon', initials: 'RD', postedAt: '18 min ago', location: 'Rizal Park · Luneta loop', distance: '5.2 km', duration: '36:18', pace: '6:59 /km', caption: 'A slow lap before the city got busy. The bay breeze was a nice bonus.',
    conditions: { pm: '10–16 µg/m³', weather: 'Partly cloudy · 29°', time: '8 AM' }, likes: 18, liked: false, following: true,
    comments: [{ id: 'm1', author: 'Yosh Chua', initials: 'YC', text: 'Lovely morning for a loop!' }, { id: 'm2', author: 'Rain Dulatre', initials: 'RD', text: 'Adding this to my weekend list.' }],
  },
  {
    id: 'post-yosh', runnerId: 'yosh', displayName: 'Yosh Chua', initials: 'YC', postedAt: '1 hr ago', location: 'Taft Avenue · City loop', distance: '4.6 km', duration: '31:42', pace: '6:53 /km', caption: 'Easy miles, no rush. Found a new quiet side street near campus.',
    conditions: { pm: '14–21 µg/m³', weather: 'Partly cloudy · 29°', time: '8 AM' }, likes: 12, liked: false, following: true,
    comments: [{ id: 'e1', author: 'Roe Dizon', initials: 'RD', text: 'That sounds like a good find.' }],
  },
  {
    id: 'post-rain', runnerId: 'rain', displayName: 'Rain Dulatre', initials: 'RD', postedAt: '3 hrs ago', location: 'Manila Baywalk', distance: '6.1 km', duration: '43:26', pace: '7:07 /km', caption: 'Took the long way home along the water. Kept it comfortable.',
    conditions: { pm: '18–27 µg/m³', weather: 'Sunny intervals · 33°', time: '12 PM' }, likes: 9, liked: true, following: false,
    comments: [{ id: 'n1', author: 'Tala Flores', initials: 'TF', text: 'Baywalk sunsets are the best.' }, { id: 'n2', author: 'Roe Dizon', initials: 'RD', text: 'Great distance, Rain!' }, { id: 'n3', author: 'Yosh Chua', initials: 'YC', text: 'Nice steady pace.' }],
  },
  {
    id: 'post-tala', runnerId: 'tala', displayName: 'Tala Flores', initials: 'TF', postedAt: 'Yesterday', location: 'Intramuros · Demo loop', distance: '3.8 km', duration: '27:55', pace: '7:21 /km', caption: 'Short route, full reset. Sometimes that is exactly enough.',
    conditions: { pm: '16–24 µg/m³', weather: 'Cloudy · 30°', time: '5 PM' }, likes: 15, liked: false, following: false,
    comments: [],
  },
  {
    id: 'post-you', runnerId: 'you', displayName: 'Demo Runner', initials: 'R', postedAt: 'Yesterday', location: 'Baywalk Loop · Demo area', distance: '5.0 km', duration: '34:12', pace: '6:50 /km', caption: 'A sample run, shared with a little context.',
    conditions: { pm: '10–16 µg/m³', weather: 'Mostly clear · 28°', time: '9 PM' }, likes: 4, liked: false, following: false, isMine: true,
    comments: [],
  },
];

export const SOCIAL_CHALLENGES: DemoChallenge[] = [
  { id: 'easy-miles', title: 'Easy miles, together', detail: 'Weekly distance · Demo challenge', goal: 20, unit: 'km', progress: 12.4, joined: true, accent: '#8AFFFF' },
  { id: 'three-runs', title: 'Three-run week', detail: 'Number of runs · Demo challenge', goal: 3, unit: 'runs', progress: 1, joined: false, accent: '#E6EEE7' },
  { id: 'luneta-laps', title: 'Luneta laps', detail: 'Get out for four runs · Demo challenge', goal: 4, unit: 'runs', progress: 2, joined: false, accent: '#F1B65C' },
];
