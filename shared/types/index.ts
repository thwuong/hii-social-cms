import type { Media } from '@/features/content';

export enum ContentStatus {
  ALL = '',
  PENDING_REVIEW = 'pending',
  APPROVED = 'approved',
  SCHEDULED = 'scheduled',
  REJECTED = 'rejected',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  DRAFT = 'draft',
  PRIVATE = 'private',
}

// Fix: Added IMAGE and LINK members to resolve missing property errors in ContentTable and ContentGrid
export enum MediaType {
  VIDEO = 'video',
  TEXT = 'article',
  IMAGE = 'image',
  LINK = 'link',
  REEL = 'reel',
}

export enum SourceType {
  MANUAL = 'manual',
  CRAWL = 'crawl',
}

export enum SourcePlatform {
  BOOKING = 'booking',
  LALALA = 'lalala',
  VOTEME = 'voteme',
  OTHER = 'other',
}

export enum UserRole {
  REVIEWER = 'Kiểm Duyệt Viên',
  ADMIN = 'Quản Trị Viên',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export interface ContentItem {
  id: string;
  content_id: string;
  title: string;
  short_description: string;
  media_type: MediaType;
  media_url: string;
  source_type: SourceType;
  source_platform: SourcePlatform;
  target_platforms: string[];
  original_source_url: string;
  created_at: string;
  created_by: string;
  status: ContentStatus;
  approving_status?: ContentStatus;
  category: string;
  tags: string[];
  visibility: 'public' | 'hidden';
  moderation_notes: string;
  published_at?: string;
  thumbnail_url?: string;
  details_link?: string;
  scheduled_at?: string;
  categories?: string[];
  media?: Media[];
  is_allow_comment?: boolean;
  is_pending?: boolean;
  playlist_id?: string;
}

export enum Permission {
  SUPER_ADMIN = 'super_admin',
  REELS_REJECT = 'reels.reject',
  REELS_DELETE = 'reels.delete',
  USERS_MANAGE = 'users.manage',
  SYSTEM_MANAGE = 'system.manage',
  REELS_APPROVE = 'reels.approve',
  REELS_PUBLISH = 'reels.publish',
  REELS_ADD_TO_PLAYLIST = 'reels.add_to_playlist',
  REELS_SCHEDULE = 'reels.schedule',
  NONE = 'none',
}

export interface User {
  id: string;
  username: string;
  email: string;
  isDeleted: boolean;
  firstName: string;
  lastName: string;
  gender: string;
  createdAt: string;
  updatedAt: string;
  role?: UserRole;
  permissions?: Permission[];
  avatarUrl?: string;
}
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
  email: string;
  givenName: string;
  familyName: string;
}

export interface AuditLogEntry {
  id: string;
  content_id: string;
  action: string;
  previous_status?: ContentStatus;
  new_status: ContentStatus;
  user: string;
  timestamp: string;
  notes?: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Tag {
  id: string;
  name: string;
}
