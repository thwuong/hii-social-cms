import { ReportDetailPage } from '@/features/report/pages';
import { createRoute } from '@tanstack/react-router';
import { mainLayoutRoute } from './_main';

export const reportDetailRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/report/$reportId',
  component: () => <ReportDetailPage />,
});
