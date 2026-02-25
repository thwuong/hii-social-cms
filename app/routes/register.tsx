import { createRoute } from '@tanstack/react-router';
import RegisterPageComponent from '@/features/auth/pages/register-page';
import { authLayoutRoute } from './_auth';

export const registerRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/register',
  component: RegisterPageComponent,
  beforeLoad: () => {
    // Nếu đã đăng nhập, redirect về dashboard
    // TODO: Check authentication từ context hoặc store
    // const { isAuthenticated } = context;
    // if (isAuthenticated) {
    //   throw redirect({ to: '/dashboard' });
    // }
  },
});
