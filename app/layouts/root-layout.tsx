import { NotFoundPage } from '@/features/error';
import { createRoute, createRouter, redirect } from '@tanstack/react-router';
import {
  auditRoute,
  authLayoutRoute,
  contentDetailRoute,
  contentRoute,
  createContentRoute,
  dashboardRoute,
  loginRoute,
  registerRoute,
  reportDetailRoute,
  reportRoute,
  draftContentDetailRoute,
  draftContentRoute,
  playlistsRoute,
  playlistDetailRoute,
} from '../routes';
import { mainLayoutRoute } from '../routes/_main';
import { rootRoute, type RouterContext } from '../routes/_root';

// Create index route - redirect to dashboard
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw redirect({ to: '/dashboard' });
  },
});

// Build the route tree with all routes
const routeTree = rootRoute.addChildren([
  indexRoute,
  // Auth routes với layout riêng (không có sidebar)
  authLayoutRoute.addChildren([loginRoute, registerRoute]),
  // Main app routes với MainLayout (có sidebar)
  mainLayoutRoute.addChildren([
    dashboardRoute,
    contentRoute,
    contentDetailRoute,
    auditRoute,
    createContentRoute,
    draftContentRoute,
    draftContentDetailRoute,
    reportRoute,
    reportDetailRoute,
    playlistsRoute,
    playlistDetailRoute,
  ]),
]);

// Create and export the router instance
export function createAppRouter(context: RouterContext) {
  return createRouter({
    routeTree,
    context,
    defaultNotFoundComponent: NotFoundPage,
  });
}

// Type for the router
export type AppRouter = ReturnType<typeof createAppRouter>;

// Export root route and types for route registration
export { rootRoute, type RouterContext };
