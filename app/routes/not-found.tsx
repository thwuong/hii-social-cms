import { createRoute } from '@tanstack/react-router';
import { NotFoundPage } from '@/features/error';
import { rootRoute } from './_root';

/**
 * 404 Not Found Route
 */
export const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/404',
  component: NotFoundPage,
});
