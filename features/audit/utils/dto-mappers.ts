/**
 * Audit DTO Mappers
 *
 * Map API DTOs to domain types
 */

import type { LogEntryDto, LogResponseDataDto, ReelStateDto } from '../dto';
import type { AuditLog, AuditLogDetail, GetAuditLogsResponse, Resource } from '../types';
import { AuditAction, AuditStatus, ResourceType } from '../types';

/**
 * Map action string to AuditAction enum
 */
function mapAction(action: string): AuditAction {
  // API returns lowercase snake_case, which matches our enum values
  return action as AuditAction;
}

/**
 * Determine resource type from log entry
 */
function determineResourceType(type: string): ResourceType {
  // Check if it's a reel/content based on the after state
  if (type === 'reel') {
    return ResourceType.CONTENT;
  }
  // Default to CONTENT for now
  return ResourceType.CONTENT;
}

function mapResource(item: ReelStateDto): Resource {
  return {
    title: item.title,
    type: determineResourceType(item.type),
    id: item.id,
  };
}

/**
 * Map LogEntryDto to AuditLog
 */
export function mapLogEntryToAuditLog(dto: LogEntryDto): AuditLog {
  return {
    id: dto.id,
    action: mapAction(dto.action),
    resources: dto.after?.items.map(mapResource),
    actor_id: dto.id,
    actor_name: dto.who,
    actor_email: dto.email,
    status: dto.status as AuditStatus,
    user_agent: 'N/A', // Not provided in DTO
    ip_address: dto.ip_address,
    metadata: {
      before: dto.before,
      after: dto.after,
    },
    changes: dto.before
      ? {
          before: dto.before?.items,
          after: dto.after?.items,
        }
      : undefined,
    created_at: dto.created_at,
  };
}

/**
 * Map LogResponseDataDto to GetAuditLogsResponse
 */
export function mapLogResponseToAuditLogsResponse(dto: LogResponseDataDto): GetAuditLogsResponse {
  const logs = dto.logs.map(mapLogEntryToAuditLog);
  console.log(dto.meta.current_page, 'current_page');
  console.log(dto.meta.total_pages, 'total_pages');

  return {
    logs,
    has_next: dto.meta.current_page < dto.meta.total_pages,
    next_cursor:
      dto.meta.current_page < dto.meta.total_pages ? String(dto.meta.current_page + 1) : '',
    number_of_items: dto.logs.length,
    total: dto.meta.total_items,
  };
}

/**
 * Map LogEntryDto to AuditLogDetail
 */
export function mapLogEntryToAuditLogDetail(dto: LogEntryDto): AuditLogDetail {
  return {
    id: dto.id,
    action: mapAction(dto.action),
    resources: dto.after?.items.map(mapResource),
    actor_id: dto.id,
    actor_name: dto.who,
    actor_email: dto.email,
    status: dto.status as AuditStatus,
    user_agent: 'N/A', // Not provided in DTO
    ip_address: dto.ip_address,
    metadata: {
      before: dto.before,
      after: dto.after,
    },
    changes: dto.before
      ? {
          before: dto.before?.items,
          after: dto.after?.items,
        }
      : undefined,
    created_at: dto.created_at,
    error_message: dto.reason,
  };
}
