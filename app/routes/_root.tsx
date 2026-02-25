import { User } from '@/features/auth';
import { NotFoundPage } from '@/features/error';
import { Toaster } from '@/shared/ui';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

// Define the router context type
export interface RouterContext {
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  isAuthenticated: boolean;
}

// Create the root route with context
export const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Outlet />
      <Toaster />
      <TanStackRouterDevtools />
    </>
  ),
  notFoundComponent: NotFoundPage,
});
