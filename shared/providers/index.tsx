/**
 * App Providers
 *
 * Centralized provider setup for the application
 */

import { queryClient } from '@/lib/query-client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import AppRouterProvider from './app-router-provider';
import { ThemeProvider } from './theme-provider';

export function Providers() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppRouterProvider />
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
