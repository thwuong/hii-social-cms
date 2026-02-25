import { createRoute } from '@tanstack/react-router';
import CreatePageComponent from '@/features/content/pages/create-page';
import { mainLayoutRoute } from './_main';

export const createContentRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/create',
  component: CreatePageComponent,
});
