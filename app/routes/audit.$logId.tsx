import { AuditLogDetailPageComponent } from '@/features/audit';
import { createRoute } from '@tanstack/react-router';
import { mainLayoutRoute } from './_main';

export const auditDetailRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/audit/$logId',
  component: AuditLogDetailPageComponent,
});
