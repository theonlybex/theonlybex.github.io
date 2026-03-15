import type { GitHubStats, RecentRepo } from './types.js';

const USERNAME = 'theonlybex';

export async function initGitHub(): Promise<void> {
  const statsEl = document.getElementById('gh-stats');
  const reposEl = document.getElementById('gh-repos');
  if (!statsEl && !reposEl) return;

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${USERNAME}`),
      fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=50`),
    ]);

    if (!userRes.ok || !reposRes.ok) return;

    const user  = await userRes.json() as { public_repos: number; followers: number };
    const repos = await reposRes.json() as Array<{
      name: string;
      description: string | null;
      stargazers_count: number;
      html_url: string;
      language: string | null;
      fork: boolean;
    }>;

    const ownRepos   = repos.filter(r => !r.fork);
    const totalStars = ownRepos.reduce((s, r) => s + r.stargazers_count, 0);
    const recentRepos: RecentRepo[] = ownRepos.slice(0, 3).map(r => ({
      name: r.name,
      description: r.description,
      stars: r.stargazers_count,
      url: r.html_url,
      language: r.language,
    }));

    const stats: GitHubStats = { repos: user.public_repos, followers: user.followers, totalStars, recentRepos };

    renderStats(statsEl, stats);
    renderRecentRepos(reposEl, recentRepos);
  } catch {
    // silently fail — GitHub stats are a nice-to-have
  }
}

function renderStats(el: HTMLElement | null, stats: GitHubStats): void {
  if (!el) return;
  el.innerHTML = `
    <div class="gh-stat"><span class="gh-stat-value">${stats.repos}</span><span class="gh-stat-label">Repos</span></div>
    <div class="gh-stat"><span class="gh-stat-value">${stats.followers}</span><span class="gh-stat-label">Followers</span></div>
    <div class="gh-stat"><span class="gh-stat-value">${stats.totalStars}</span><span class="gh-stat-label">Stars</span></div>
  `;
  el.removeAttribute('hidden');
}

function renderRecentRepos(el: HTMLElement | null, repos: RecentRepo[]): void {
  if (!el || repos.length === 0) return;
  el.innerHTML = repos.map(repo => `
    <a class="gh-repo" href="${repo.url}" target="_blank" rel="noopener">
      <span class="gh-repo-name">${repo.name}</span>
      ${repo.language ? `<span class="tag tag-tool">${repo.language}</span>` : ''}
      ${repo.stars > 0 ? `<span class="gh-stars">&#9733; ${repo.stars}</span>` : ''}
    </a>
  `).join('');
  el.removeAttribute('hidden');
}
