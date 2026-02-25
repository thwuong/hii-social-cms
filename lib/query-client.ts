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
