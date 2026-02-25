import { RolesPage } from '@/features/roles';
import { createRoute } from '@tanstack/react-router';
import { mainLayoutRoute } from './_main';

export const rolesRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/roles',
  component: RolesPage,
});
