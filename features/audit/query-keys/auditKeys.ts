/**
 * Audit Query Keys
 *
 * React Query key factory for audit logs
 */

import type { GetAuditLogsPayload } from '../types';

export const auditKeys = {
  all: ['audit'] as const,
  lists: () => [...auditKeys.all, 'list'] as const,
  list: (filters: GetAuditLogsPayload) => [...auditKeys.lists(), filters] as const,
  details: () => [...auditKeys.all, 'detail'] as const,
  detail: (id: string) => [...auditKeys.details(), id] as const,
};
