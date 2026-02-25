import { createRoute } from '@tanstack/react-router';
import { DashboardPageComponent } from '@/features/dashboard';
import { mainLayoutRoute } from './_main';

export const dashboardRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/dashboard',
  component: DashboardPageComponent,
});
