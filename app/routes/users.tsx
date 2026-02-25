import { UsersPage } from '@/features/users';
import { createRoute } from '@tanstack/react-router';
import { mainLayoutRoute } from './_main';

export const usersRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/users',
  component: UsersPage,
});
