import { createAppRouter, RouterContext } from '@/app/layouts/root-layout';
import { RouterProvider } from '@tanstack/react-router';
import React from 'react';
import { useAuthStore, useIsAuthenticated, useUser } from './features/auth/stores/useAuthStore';
import { Providers } from './shared/providers';

const App: React.FC = () => {
  // Create router context
  const routerContext: RouterContext = {
    currentUser: useUser(),
    setCurrentUser: useAuthStore((state) => state.updateUser),
    isAuthenticated: useIsAuthenticated(),
  };

  // Create router instance with context
  const router = createAppRouter(routerContext);

  return (
    <Providers>
      <RouterProvider router={router} context={routerContext} />
    </Providers>
  );
};

export default App;
