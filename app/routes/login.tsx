import { createRoute } from '@tanstack/react-router';
import LoginPageComponent from '@/features/auth/pages/login-page';
import { authLayoutRoute } from './_auth';

export const loginRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/login',
  component: LoginPageComponent,
  beforeLoad: () => {
    // Nếu đã đăng nhập, redirect về dashboard
    // TODO: Check authentication từ context hoặc store
    // const { isAuthenticated } = context;
    // if (isAuthenticated) {
    //   throw redirect({ to: '/dashboard' });
    // }
  },
});
