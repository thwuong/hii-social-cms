import {
  createRootRouteWithContext,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import MainLayout from '../components/layouts/main-layout';
import { auditRoute } from './audit';
import { contentRoute } from './content';
import { createContentRoute } from './create';
import { dashboardRoute } from './dashboard';
import { detailRoute } from './detail.$contentId';
import { CMSService } from '../services/cmsService';
import { ContentItem, UserRole } from '../types';

// Define the router context type
export interface RouterContext {
  items: ContentItem[];
  categories: string[];
  tags: string[];
  service: CMSService;
  currentUser: { name: string; role: UserRole };
  setCurrentUser: (user: { name: string; role: UserRole }) => void;
  refreshData: () => void;
}

// Create the root route with context
const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <MainLayout>
      <Outlet />
      <TanStackRouterDevtools />
    </MainLayout>
  ),
});

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
  dashboardRoute,
  contentRoute,
  detailRoute,
  auditRoute,
  createContentRoute,
]);

// Create and export the router instance
export function createAppRouter(context: RouterContext) {
  return createRouter({
    routeTree,
    context,
  });
}

// Type for the router
export type AppRouter = ReturnType<typeof createAppRouter>;

// Export root route for route registration
export { rootRoute };
