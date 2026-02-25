import { ContentSearchSchema } from '../schemas';

export const queryKeys = {
  categories: {
    all: ['categories'] as const,
    lists: () => [...queryKeys.categories.all, 'list'] as const,
  },

  platforms: {
    all: ['platforms'] as const,
    lists: () => [...queryKeys.platforms.all, 'list'] as const,
  },

  // Content queries
  content: {
    all: ['content'] as const,
    lists: (filters: Partial<ContentSearchSchema>) =>
      [...queryKeys.content.all, 'list', filters] as const,
    details: (id: string, approving_status: string) =>
      [...queryKeys.content.all, 'detail', id, approving_status] as const,
    inPlaylist: (filters: Partial<ContentSearchSchema>) =>
      [...queryKeys.content.all, 'in-playlist', filters] as const,
  },

  // Approving Status queries
  approvingStatus: {
    all: ['approving-status'] as const,
  },

  contentCrawl: {
    all: ['content-crawl'] as const,
    lists: () => [...queryKeys.contentCrawl.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.contentCrawl.lists(), filters] as const,
    details: () => [...queryKeys.contentCrawl.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.contentCrawl.details(), id] as const,
    playlist: () => [...queryKeys.contentCrawl.all, 'playlist'] as const,
    playlistList: (filters: Record<string, unknown>) =>
      [...queryKeys.contentCrawl.playlist(), filters] as const,
  },

  // User queries
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
    current: () => [...queryKeys.users.all, 'current'] as const,
  },

  // Dashboard queries
  dashboard: {
    all: ['dashboard'] as const,
    stats: () => [...queryKeys.dashboard.all, 'stats'] as const,
    analytics: (range: string) => [...queryKeys.dashboard.all, 'analytics', range] as const,
  },
};
