import { createAppRouter, RouterContext } from '@/app/layouts/root-layout';
import { useGetCurrentUser } from '@/features/auth';
import { useAuthStore, useIsAuthenticated, useUser } from '@/features/auth/stores/useAuthStore';
import { RouterProvider } from '@tanstack/react-router';

function AppRouterProvider() {
  useGetCurrentUser();

  // Create router context
  const routerContext: RouterContext = {
    currentUser: useUser(),
    setCurrentUser: useAuthStore((state) => state.updateUser),
    isAuthenticated: useIsAuthenticated(),
  };

  // Create router instance with context
  const router = createAppRouter(routerContext);

  return <RouterProvider router={router} context={routerContext} />;
}

export default AppRouterProvider;
