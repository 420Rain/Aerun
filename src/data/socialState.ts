import type { DemoChallenge, SocialComment, SocialPost } from './socialMockData';

export type SharedRunInput = Pick<SocialPost, 'caption' | 'location' | 'distance' | 'duration' | 'pace' | 'conditions'>;

export function togglePostKudos(posts: SocialPost[], postId: string): SocialPost[] {
  return posts.map(post => post.id === postId
    ? { ...post, liked: !post.liked, likes: post.likes + (post.liked ? -1 : 1) }
    : post);
}

export function appendPostComment(posts: SocialPost[], postId: string, comment: SocialComment): SocialPost[] {
  return posts.map(post => post.id === postId ? { ...post, comments: [...post.comments, comment] } : post);
}

export function createSharedRunPost(run: SharedRunInput, id: string): SocialPost {
  return { id, runnerId: 'you', displayName: 'Demo Runner', initials: 'R', postedAt: 'Just now', ...run, likes: 0, liked: false, comments: [], following: false, isMine: true };
}

export function prependPost(posts: SocialPost[], post: SocialPost): SocialPost[] {
  return [post, ...posts];
}

export function filterFeed(posts: SocialPost[], filter: 'following' | 'all'): SocialPost[] {
  return filter === 'following' ? posts.filter(post => post.following || post.isMine) : posts;
}

export function toggleChallengeMembership(challenges: DemoChallenge[], challengeId: string): DemoChallenge[] {
  return challenges.map(challenge => challenge.id === challengeId ? { ...challenge, joined: !challenge.joined } : challenge);
}

export function addRunToJoinedChallenges(challenges: DemoChallenge[], distance: string): DemoChallenge[] {
  const kilometers = Number.parseFloat(distance);
  return challenges.map(challenge => challenge.joined
    ? { ...challenge, progress: Math.min(challenge.goal, challenge.progress + (challenge.unit === 'km' ? kilometers : 1)) }
    : challenge);
}
