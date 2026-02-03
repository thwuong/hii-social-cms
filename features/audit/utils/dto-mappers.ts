/**
 * Audit DTO Mappers
 *
 * Map API DTOs to domain types
 */

import type { LogEntryDto, LogResponseDataDto } from '../dto';
import type { AuditLog, GetAuditLogsResponse } from '../types';
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
function determineResourceType(log: LogEntryDto): ResourceType {
  // Check if it's a reel/content based on the after state
  if (log.after?.reelbaseinfo) {
    return ResourceType.CONTENT;
  }
  // Default to CONTENT for now
  return ResourceType.CONTENT;
}

/**
 * Map LogEntryDto to AuditLog
 */
export function mapLogEntryToAuditLog(dto: LogEntryDto): AuditLog {
  return {
    id: dto.id,
    action: mapAction(dto.action),
    resource_type: determineResourceType(dto),
    // eslint-disable-next-line no-underscore-dangle
    resource_id: dto.after?.reelbaseinfo?._id || dto.id,
    actor_id: dto.id, // Use log id as actor id for now
    actor_name: dto.who,
    actor_email: dto.email,
    status: AuditStatus.SUCCESS, // Default to success
    ip_address: 'N/A', // Not provided in DTO
    user_agent: 'N/A', // Not provided in DTO
    metadata: {
      before: dto.before,
      after: dto.after,
    },
    changes: dto.before
      ? {
          before: dto.before,
          after: dto.after,
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

  return {
    logs,
    has_next: dto.meta.current_page < dto.meta.total_pages,
    next_cursor:
      dto.meta.current_page < dto.meta.total_pages ? String(dto.meta.current_page + 1) : '',
    number_of_items: dto.logs.length,
    total: dto.meta.total_items,
  };
}
