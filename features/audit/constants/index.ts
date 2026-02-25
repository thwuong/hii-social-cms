/**
 * Audit Constants
 *
 * Labels, colors, and mappings for audit logs
 */

import { AuditAction, AuditStatus, ResourceType } from '../types';

export const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  // Reel Actions
  [AuditAction.CREATE_REEL]: 'Tạo Reel',
  [AuditAction.APPROVE_REEL]: 'Duyệt Reel',
  [AuditAction.REJECT_REEL]: 'Từ Chối Reel',
  [AuditAction.APPROVE_REELS_BATCH]: 'Duyệt Nhiều Reel',
  [AuditAction.REJECT_REELS_BATCH]: 'Từ Chối Nhiều Reel',
  [AuditAction.LIKE_REEL]: 'Thích Reel',
  [AuditAction.UNLIKE_REEL]: 'Bỏ Thích Reel',
  [AuditAction.PUBLISHED_REEL]: 'Công khai Reel',

  // Schedule Actions
  [AuditAction.CREATE_REEL_SCHEDULE]: 'Tạo Lịch Reel',
  [AuditAction.CREATE_REEL_SCHEDULES_BATCH]: 'Tạo Nhiều Lịch Reel',
  [AuditAction.UPDATE_REEL_SCHEDULE]: 'Cập Nhật Lịch Reel',
  [AuditAction.DELETE_REEL_SCHEDULE]: 'Xóa Lịch Reel',

  // Video Report Actions
  [AuditAction.CREATE_VIDEO_REPORT]: 'Tạo Báo Cáo Video',
  [AuditAction.UPDATE_VIDEO_REPORT_STATUS]: 'Cập Nhật Trạng Thái Báo Cáo',
  [AuditAction.UPDATE_VIDEO_HIDDEN_STATUS]: 'Cập Nhật Trạng Thái Ẩn Video',
  [AuditAction.UPDATE_MULTIPLE_VIDEOS_HIDDEN_STATUS]: 'Cập Nhật Ẩn Nhiều Video',

  // Comment Actions
  [AuditAction.CREATE_COMMENT]: 'Tạo Bình Luận',
  [AuditAction.DELETE_COMMENT]: 'Xóa Bình Luận',
};

export const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  [ResourceType.CONTENT]: 'Nội Dung',
  [ResourceType.REPORT]: 'Báo Cáo',
  [ResourceType.USER]: 'Người Dùng',
  [ResourceType.PLAYLIST]: 'Playlist',
  [ResourceType.SYSTEM]: 'Hệ Thống',
};

export const AUDIT_STATUS_LABELS: Record<AuditStatus, string> = {
  [AuditStatus.SUCCESS]: 'Thành Công',
  [AuditStatus.FAILED]: 'Thất Bại',
  [AuditStatus.PENDING]: 'Đang Xử Lý',
};

export const AUDIT_ACTION_COLORS: Record<AuditAction, string> = {
  // Reel Actions
  [AuditAction.CREATE_REEL]: 'text-green-500',
  [AuditAction.APPROVE_REEL]: 'text-green-500',
  [AuditAction.REJECT_REEL]: 'text-red-500',
  [AuditAction.APPROVE_REELS_BATCH]: 'text-green-400',
  [AuditAction.REJECT_REELS_BATCH]: 'text-red-400',
  [AuditAction.LIKE_REEL]: 'text-pink-500',
  [AuditAction.UNLIKE_REEL]: 'text-gray-500',
  [AuditAction.PUBLISHED_REEL]: 'text-green-500',

  // Schedule Actions
  [AuditAction.CREATE_REEL_SCHEDULE]: 'text-blue-500',
  [AuditAction.CREATE_REEL_SCHEDULES_BATCH]: 'text-blue-400',
  [AuditAction.UPDATE_REEL_SCHEDULE]: 'text-yellow-500',
  [AuditAction.DELETE_REEL_SCHEDULE]: 'text-red-500',

  // Video Report Actions
  [AuditAction.CREATE_VIDEO_REPORT]: 'text-orange-500',
  [AuditAction.UPDATE_VIDEO_REPORT_STATUS]: 'text-yellow-500',
  [AuditAction.UPDATE_VIDEO_HIDDEN_STATUS]: 'text-purple-500',
  [AuditAction.UPDATE_MULTIPLE_VIDEOS_HIDDEN_STATUS]: 'text-purple-400',

  // Comment Actions
  [AuditAction.CREATE_COMMENT]: 'text-cyan-500',
  [AuditAction.DELETE_COMMENT]: 'text-red-500',
};
