/**
 * React Query (TanStack Query) Configuration
 *
 * Docs: https://tanstack.com/query/latest/docs/framework/react/overview
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * Global QueryClient instance
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time - data được coi là fresh trong 5 phút
      staleTime: 5 * 60 * 1000,

      // Cache time - data được cache trong 10 phút
      gcTime: 10 * 60 * 1000,

      // Retry on error
      retry: 1,

      // Retry delay
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Refetch on window focus
      refetchOnWindowFocus: false,

      // Refetch on mount
      refetchOnMount: true,

      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry mutations on error
      retry: false,

      // Error callback
      onError: (error) => {
        console.error('Mutation error:', error);
        // Có thể thêm toast notification ở đây
      },
    },
  },
});

/**
 * Query Keys Factory
 * Giúp organize và type-safe query keys
 */
export const queryKeys = {
  // Content queries
  content: {
    all: ['content'] as const,
    lists: () => [...queryKeys.content.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.content.lists(), filters] as const,
    details: () => [...queryKeys.content.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.content.details(), id] as const,
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

/**
 * Example usage:
 *
 * // In a component
 * const { data, isLoading } = useQuery({
 *   queryKey: queryKeys.content.list({ status: 'published' }),
 *   queryFn: () => api.get('/content')
 * });
 *
 * // Invalidate queries
 * queryClient.invalidateQueries({ queryKey: queryKeys.content.all });
 *
 * // Prefetch
 * queryClient.prefetchQuery({
 *   queryKey: queryKeys.content.detail('123'),
 *   queryFn: () => api.get(`/content/123`)
 * });
 */
