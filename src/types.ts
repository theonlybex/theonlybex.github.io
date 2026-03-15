export interface Orb {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface GitHubStats {
  repos: number;
  followers: number;
  totalStars: number;
  recentRepos: RecentRepo[];
}

export interface RecentRepo {
  name: string;
  description: string | null;
  stars: number;
  url: string;
  language: string | null;
}
