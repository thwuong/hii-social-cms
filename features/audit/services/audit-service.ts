/**
 * Audit Service
 *
 * API service for audit logs
 */

import { api } from '@/services';
import queryString from 'query-string';
import type { LogResponseDataDto } from '../dto';
import type { AuditLogDetail, GetAuditLogsPayload, GetAuditLogsResponse } from '../types';
import { mapLogResponseToAuditLogsResponse } from '../utils/dto-mappers';

export const auditService = {
  // Get audit logs with filters
  getAuditLogs: async (payload: GetAuditLogsPayload): Promise<GetAuditLogsResponse> => {
    // Map payload to API params
    const apiParams = {
      page: payload.page || 1,
      per_page: payload.limit || 20,
      action: payload.action,
      from_date: payload.from_date,
      to_date: payload.to_date,
      search: payload.search,
    };

    const searchParams = queryString.stringify(apiParams);
    const response = await api.get<LogResponseDataDto>(`logs?${searchParams}`);

    // Map DTO to domain type
    return mapLogResponseToAuditLogsResponse(response);
  },

  // Get audit log detail
  getAuditLogDetail: async (logId: string): Promise<AuditLogDetail> => {
    const response = await api.get<AuditLogDetail>(`logs/${logId}`);
    return response;
  },

  // Export audit logs
  exportAuditLogs: async (
    payload: GetAuditLogsPayload,
    format: 'csv' | 'json' = 'csv'
  ): Promise<Blob> => {
    const searchParams = queryString.stringify({ ...payload, format });
    const response = await api.get(`logs/export?${searchParams}`, {
      // @ts-expect-error - ky supports blob response
      responseType: 'blob',
    });
    return response as unknown as Blob;
  },
};
