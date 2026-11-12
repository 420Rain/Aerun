import React, { createContext, useContext, useMemo, useState } from 'react';
import { CONDITIONS, ROUTES, RouteKey, TimeKey, randomRecordedHour } from '@/data/mockData';
import { SOCIAL_CHALLENGES, SOCIAL_POSTS } from '@/data/socialMockData';
import type { DemoChallenge, SocialConditions, SocialPost } from '@/data/socialMockData';
import { addRunToJoinedChallenges, appendPostComment, createSharedRunPost, prependPost, toggleChallengeMembership, togglePostKudos } from '@/data/socialState';

export type FeedFilter = 'following' | 'all';
export type RunSnapshot = { pm: string; weather: string; temperature: number; time: TimeKey };
export type RunRecord = {
  id: string;
  routeKey: RouteKey;
  routeName: string;
  location: string;
  distanceKm: number;
  durationSeconds: number;
  paceSeconds: number;
  recordedAt: TimeKey;
  recordedDate: string;
  splits: string[];
  environment: RunSnapshot;
  shared: boolean;
};
export type ActiveRun = RunRecord & { paused: boolean; stopped: boolean };

type DemoState = {
  time: TimeKey; setTime: (time: TimeKey) => void;
  route: RouteKey; setRoute: (route: RouteKey) => void;
  posts: SocialPost[];
  feedFilter: FeedFilter; setFeedFilter: (filter: FeedFilter) => void;
  toggleKudos: (postId: string) => void;
  addComment: (postId: string, author: string, initials: string, text: string) => void;
  publishRun: (run: Pick<RunRecord, 'routeName' | 'location' | 'distanceKm' | 'durationSeconds' | 'paceSeconds' | 'environment' | 'recordedAt'>, caption?: string) => void;
  followRunner: (runnerId: string) => void;
  challenges: DemoChallenge[];
  toggleChallenge: (challengeId: string) => void;
  records: RunRecord[];
  startRun: () => void;
  activeRun: ActiveRun | null;
  tickRun: () => void;
  toggleRunPause: () => void;
  stopRun: () => void;
  finishRun: () => void;
  shareRecord: (recordId: string) => void;
};
const Context = createContext<DemoState | null>(null);

function formatPace(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.round(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainder}`;
}
function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const remainder = Math.floor(seconds % 60).toString().padStart(2, '0');
  return hours ? `${hours}:${minutes}:${remainder}` : `${minutes}:${remainder}`;
}
function randomSplits(distanceKm: number, paceSeconds: number) {
  const count = Math.max(1, Math.ceil(distanceKm));
  return Array.from({ length: count }, (_, index) => formatPace(paceSeconds + Math.floor(Math.random() * 35) - 16));
}
function toSocialRun(run: Pick<RunRecord, 'routeName' | 'location' | 'distanceKm' | 'durationSeconds' | 'paceSeconds' | 'environment' | 'recordedAt'>, caption: string): {
  caption: string; location: string; distance: string; duration: string; pace: string; conditions: SocialConditions;
} {
  const duration = formatDuration(run.durationSeconds);
  return {
    caption,
    location: run.location,
    distance: `${run.distanceKm.toFixed(1)} km`,
    duration,
    pace: `${formatPace(run.paceSeconds)} /km`,
    conditions: {
      pm: `${run.environment.pm} µg/m³`,
      weather: `${run.environment.weather} · ${run.environment.temperature}°`,
      time: run.recordedAt,
    },
  };
}

export function DemoStateProvider({ children }: React.PropsWithChildren) {
  const [time, setTime] = useState<TimeKey>('8 AM');
  const [route, setRoute] = useState<RouteKey>('baywalk');
  const [posts, setPosts] = useState(SOCIAL_POSTS);
  const [feedFilter, setFeedFilter] = useState<FeedFilter>('following');
  const [challenges, setChallenges] = useState(SOCIAL_CHALLENGES);
  const [records, setRecords] = useState<RunRecord[]>([]);
  const [activeRun, setActiveRun] = useState<ActiveRun | null>(null);

  const toggleKudos = (postId: string) => setPosts(current => togglePostKudos(current, postId));
  const addComment = (postId: string, author: string, initials: string, text: string) => setPosts(current => appendPostComment(current, postId, { id: `comment-${Date.now()}`, author, initials, text }));
  const publishRun = (run: Pick<RunRecord, 'routeName' | 'location' | 'distanceKm' | 'durationSeconds' | 'paceSeconds' | 'environment' | 'recordedAt'>, caption = 'A run shared with a little context.') => {
    const newPost = createSharedRunPost(toSocialRun(run, caption), `run-${Date.now()}`);
    setPosts(current => prependPost(current, newPost));
  };
  const followRunner = (runnerId: string) => setPosts(current => current.map(post => post.runnerId === runnerId ? { ...post, following: true } : post));
  const toggleChallenge = (challengeId: string) => setChallenges(current => toggleChallengeMembership(current, challengeId));

  const startRun = () => {
    const selectedRoute = ROUTES[route];
    const hour = randomRecordedHour();
    const condition = CONDITIONS[hour];
    const pmMid = Math.max(8, condition.pmMid + Math.floor(Math.random() * 5) - 2);
    const durationSeconds = 7 * 60 + Math.floor(Math.random() * 23 * 60);
    const paceSeconds = 365 + Math.floor(Math.random() * 105);
    const distanceKm = Number((durationSeconds / paceSeconds + Math.random() * 0.025).toFixed(2));
    const environment: RunSnapshot = {
      pm: `${Math.max(7, pmMid - 4)}–${pmMid + 4}`,
      weather: condition.weather,
      temperature: condition.temperature + Math.floor(Math.random() * 3) - 1,
      time: hour,
    };
    const created: ActiveRun = {
      id: `run-record-${Date.now()}`,
      routeKey: route,
      routeName: selectedRoute.name,
      location: selectedRoute.area,
      distanceKm,
      durationSeconds,
      paceSeconds,
      recordedAt: hour,
      recordedDate: new Date().toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }),
      splits: [],
      environment,
      shared: false,
      paused: false,
      stopped: false,
    };
    setActiveRun(created);
  };
  const tickRun = () => setActiveRun(current => current && !current.paused && !current.stopped ? {
    ...current,
    durationSeconds: current.durationSeconds + 1,
    distanceKm: Number((current.distanceKm + (1 / current.paceSeconds)).toFixed(3)),
  } : current);
  const toggleRunPause = () => setActiveRun(current => current && !current.stopped ? { ...current, paused: !current.paused } : current);
  const stopRun = () => setActiveRun(current => current ? { ...current, paused: false, stopped: true } : current);
  const finishRun = () => {
    if (!activeRun) return;
    const distanceKm = Math.max(0.5, activeRun.distanceKm);
    const finished: RunRecord = {
      id: activeRun.id,
      routeKey: activeRun.routeKey,
      routeName: activeRun.routeName,
      location: activeRun.location,
      distanceKm,
      durationSeconds: activeRun.durationSeconds,
      paceSeconds: activeRun.paceSeconds,
      recordedAt: activeRun.recordedAt,
      recordedDate: activeRun.recordedDate,
      splits: randomSplits(distanceKm, activeRun.paceSeconds),
      environment: activeRun.environment,
      shared: false,
    };
    setRecords(previous => [finished, ...previous]);
    setChallenges(current => addRunToJoinedChallenges(current, `${finished.distanceKm.toFixed(1)} km`));
    setActiveRun(null);
  };
  const shareRecord = (recordId: string) => {
    const record = records.find(item => item.id === recordId);
    if (!record || record.shared) return;
    publishRun(record, 'Another run logged, with the local conditions along for the miles.');
    setRecords(current => current.map(item => item.id === recordId ? { ...item, shared: true } : item));
  };

  const value = useMemo(() => ({ time, setTime, route, setRoute, posts, feedFilter, setFeedFilter, toggleKudos, addComment, publishRun, followRunner, challenges, toggleChallenge, records, startRun, activeRun, tickRun, toggleRunPause, stopRun, finishRun, shareRecord }), [time, route, posts, feedFilter, challenges, records, activeRun]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useDemoState() {
  const value = useContext(Context);
  if (!value) throw new Error('useDemoState must be used inside DemoStateProvider');
  return value;
}
