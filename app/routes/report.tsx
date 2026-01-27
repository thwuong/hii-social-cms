import { ReportListPage } from '@/features/report/pages';
import { createRoute } from '@tanstack/react-router';
import { mainLayoutRoute } from './_main';

export const reportRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/report',
  component: () => <ReportListPage />,
});
