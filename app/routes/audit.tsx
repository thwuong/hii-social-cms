import { auditSearchSchema } from '@/features/audit';
import AuditPageComponent from '@/features/audit/pages/audit-page';
import { createRoute } from '@tanstack/react-router';
import { mainLayoutRoute } from './_main';

export const auditRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/audit',
  component: AuditPageComponent,
  validateSearch: auditSearchSchema,
});
