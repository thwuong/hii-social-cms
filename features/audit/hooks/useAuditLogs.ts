/**
 * Audit Hooks
 *
 * Custom React hooks for audit logs
 */

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import { auditKeys } from '../query-keys/auditKeys';
import type { AuditSearchSchema } from '../schemas';
import { auditService } from '../services';

/**
 * Hook to fetch audit logs with infinite scroll
 */
export const useAuditLogs = () => {
  const filters: AuditSearchSchema = useSearch({ strict: false });

  return useInfiniteQuery({
    queryKey: auditKeys.list(filters),
    queryFn: ({ pageParam }) =>
      auditService.getAuditLogs({
        ...filters,
        page: pageParam,
        limit: filters.limit || 20,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.has_next ? Number(lastPage.next_cursor) : undefined),
    select: (data) => data.pages.flatMap((page) => page.logs),
  });
};

/**
 * Hook to fetch audit log detail
 */
export const useAuditLogDetail = (logId: string) => {
  return useQuery({
    queryKey: auditKeys.detail(logId),
    queryFn: () => auditService.getAuditLogDetail(logId),
    enabled: !!logId,
  });
};
