import React, { createContext, useContext, useMemo, useState } from 'react';
import { RouteKey, TimeKey } from '@/data/mockData';
import { SOCIAL_CHALLENGES, SOCIAL_POSTS } from '@/data/socialMockData';
import type { DemoChallenge, SocialConditions, SocialPost } from '@/data/socialMockData';
import { addRunToJoinedChallenges, appendPostComment, createSharedRunPost, prependPost, toggleChallengeMembership, togglePostKudos } from '@/data/socialState';

export type FeedFilter = 'following' | 'all';
type SharedRun = { caption: string; location: string; distance: string; duration: string; pace: string; conditions: SocialConditions };

type DemoState = {
  time: TimeKey; setTime: (time: TimeKey) => void;
  route: RouteKey; setRoute: (route: RouteKey) => void;
  posts: SocialPost[];
  feedFilter: FeedFilter; setFeedFilter: (filter: FeedFilter) => void;
  toggleKudos: (postId: string) => void;
  addComment: (postId: string, author: string, initials: string, text: string) => void;
  publishRun: (run: SharedRun) => void;
  challenges: DemoChallenge[];
  toggleChallenge: (challengeId: string) => void;
};
const Context = createContext<DemoState | null>(null);
export function DemoStateProvider({ children }: React.PropsWithChildren) {
  const [time, setTime] = useState<TimeKey>('8 AM');
  const [route, setRoute] = useState<RouteKey>('baywalk');
  const [posts, setPosts] = useState(SOCIAL_POSTS);
  const [feedFilter, setFeedFilter] = useState<FeedFilter>('following');
  const [challenges, setChallenges] = useState(SOCIAL_CHALLENGES);
  const toggleKudos = (postId: string) => setPosts(current => togglePostKudos(current, postId));
  const addComment = (postId: string, author: string, initials: string, text: string) => setPosts(current => appendPostComment(current, postId, { id: `comment-${Date.now()}`, author, initials, text }));
  const publishRun = (run: SharedRun) => {
    const newPost = createSharedRunPost(run, `run-${Date.now()}`);
    setPosts(current => prependPost(current, newPost));
    setChallenges(current => addRunToJoinedChallenges(current, run.distance));
  };
  const toggleChallenge = (challengeId: string) => setChallenges(current => toggleChallengeMembership(current, challengeId));
  const value = useMemo(() => ({ time, setTime, route, setRoute, posts, feedFilter, setFeedFilter, toggleKudos, addComment, publishRun, challenges, toggleChallenge }), [time, route, posts, feedFilter, challenges]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useDemoState() {
  const value = useContext(Context);
  if (!value) throw new Error('useDemoState must be used inside DemoStateProvider');
  return value;
}
