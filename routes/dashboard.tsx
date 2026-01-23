import { createRoute } from '@tanstack/react-router';
import Dashboard from '../components/Dashboard';
import { rootRoute } from './root-layout';

export const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = dashboardRoute.useNavigate();
  const { items } = dashboardRoute.useRouteContext();

  const handleNavigate = (filter: { status?: string; source?: string }) => {
    navigate({
      to: '/content',
      search: filter,
    });
  };

  return <Dashboard items={items} onNavigate={handleNavigate} />;
}
