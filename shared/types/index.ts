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
  EDITOR = 'Biên Tập Viên',
  REVIEWER = 'Kiểm Duyệt Viên',
  ADMIN = 'Quản Trị Viên',
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
  target_platforms: SourcePlatform[];
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
