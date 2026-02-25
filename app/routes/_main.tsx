import { queryClient } from '@/lib';
import { createRoute, Outlet, redirect } from '@tanstack/react-router';
import { MainLayout } from '../layouts';
import { rootRoute } from './_root';

/**
 * Main Layout Route - Layout riêng cho main pages
 *
 */
export const mainLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'main-layout',
  component: MainLayoutComponent,
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      queryClient.clear();
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw redirect({ to: '/login' });
    }
  },
});

function MainLayoutComponent() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}
