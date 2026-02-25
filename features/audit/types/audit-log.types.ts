/**
 * Audit Log Types
 *
 * Type definitions for audit logging system
 */

export enum AuditAction {
  // Reel Actions
  CREATE_REEL = 'create_reel',
  APPROVE_REEL = 'approve_reel',
  REJECT_REEL = 'reject_reel',
  APPROVE_REELS_BATCH = 'approve_reels_batch',
  REJECT_REELS_BATCH = 'reject_reels_batch',
  LIKE_REEL = 'like_reel',
  UNLIKE_REEL = 'unlike_reel',
  PUBLISHED_REEL = 'published_reels',

  // Schedule Actions
  CREATE_REEL_SCHEDULE = 'create_reel_schedule',
  CREATE_REEL_SCHEDULES_BATCH = 'create_reel_schedules_batch',
  UPDATE_REEL_SCHEDULE = 'update_reel_schedule',
  DELETE_REEL_SCHEDULE = 'delete_reel_schedule',

  // Video Report Actions
  CREATE_VIDEO_REPORT = 'create_video_report',
  UPDATE_VIDEO_REPORT_STATUS = 'update_video_report_status',
  UPDATE_VIDEO_HIDDEN_STATUS = 'update_video_hidden_status',
  UPDATE_MULTIPLE_VIDEOS_HIDDEN_STATUS = 'update_multiple_videos_hidden_status',

  // Comment Actions
  CREATE_COMMENT = 'create_comment',
  DELETE_COMMENT = 'delete_comment',
}

export enum ResourceType {
  CONTENT = 'CONTENT',
  REPORT = 'REPORT',
  USER = 'USER',
  PLAYLIST = 'PLAYLIST',
  SYSTEM = 'SYSTEM',
}

export enum AuditStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  PENDING = 'pending',
}

export interface AuditLog {
  id: string;
  action: AuditAction;
  resources: Resource[];
  actor_id: string;
  actor_name: string;
  actor_email: string;
  status: AuditStatus;
  ip_address: string;
  user_agent: string;
  metadata: Record<string, any>;
  changes?: {
    before: Record<string, any>[];
    after: Record<string, any>[];
  };
  created_at: string;
  error_message?: string;
}

export interface Resource {
  title: string;
  type: string;
  id: string;
}

export interface GetAuditLogsPayload {
  limit?: number;
  page?: number;
  actions?: string[];
  from_date?: string;
  to_date?: string;
  search?: string;
  platforms?: string[];
}

export interface GetAuditLogsResponse {
  has_next: boolean;
  next_cursor: string;
  number_of_items: number;
  total: number;
  logs: AuditLog[];
}

export interface AuditLogDetail extends AuditLog {
  resource_details?: Record<string, any>;
  actor_details?: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
}
