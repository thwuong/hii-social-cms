import { createRoute, Outlet, redirect } from '@tanstack/react-router';
import { rootRoute } from './_root';

/**
 * Auth Layout Route - Layout riêng cho authentication pages
 * Không có MainLayout (sidebar, header)
 */
export const authLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'auth-layout',
  component: AuthLayoutComponent,
  beforeLoad: ({ context }) => {
    if (context.isAuthenticated) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw redirect({ to: '/dashboard' });
    }
  },
});

function AuthLayoutComponent() {
  return (
    <div className="bg-background h-dvh">
      <Outlet />
    </div>
  );
}
