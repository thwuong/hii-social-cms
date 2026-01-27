/**
 * Content Types
 *
 * Re-export shared types for review feature
 */

import { Pagination } from '@/lib/types/api';

export * from '@/shared/types';
export interface PublishContentPayload {
  reel_ids: string[];
}

export interface ScheduleContentPayload {
  reel_id: string;
  scheduled_at: string;
}

export interface GetContentPayload {
  approving_status: string;
  cursor: string;
  tags: string[];
  status: string;
  search: string;
  sorted: string;
  sort: string;
  page: number;
  limit: number;
}

export interface Video {
  created_at: string;
  download_attempts: number;
  download_error: string;
  download_status: string;
  id: number;
  is_previewed: boolean;
  is_published: boolean;
  original_url: string;
  platform: string;
  publish_attempts: number;
  publish_error: string;
  publish_metadata: PublishMetadata;
  published_at: string;
  storage_url: string;
  thumbnail_url: string;
  video_id: string;
  video_metadata: VideoMetadata;
}

export interface PublishMetadata {
  code: number;
  data: Data;
  message: string;
  success: boolean;
  timestamp: number;
}

export interface Data {
  approving_status: string;
  content: string;
  created_at: string;
  description: string;
  dislikes: number;
  id: string;
  is_allow_comment: boolean;
  liked: boolean;
  likes: number;
  media: Media[];
  notification_status: string;
  oldest_unread_comment: number;
  owner: string;
  owner_id: string;
  participants: string;
  scheduled_at: string;
  status: string;
  tags: string[];
  thumbnail: Thumbnail;
  title: string;
  total_comments: number;
  total_unread_comments: number;
  type: string;
  updated_at: string;
  updated_by: string;
  views: number;
}

export interface Media {
  download_url: string;
  duration: number;
  poster: string;
  type: string;
  url: string;
}

export interface Thumbnail {
  download_url: string;
  duration: number;
  poster: string;
  type: string;
  url: string;
}

export interface VideoMetadata {
  artists: string[];
  channel_url: string;
  description: string;
  duration: number;
  title: string;
  uploader: string;
}

export interface PaginatedResponse {
  videos: Video[];
  pagination: Pagination;
}
export interface MakeVideoCrawlerPayload {
  is_previewed: boolean;
  message: string;
  video_id: number;
}

export interface GetContentResponse {
  page: number;
  page_size: number;
  total: number;
  total_page: number;
  reels: Reel[];
}

export interface Reel {
  id: string;
  title: string;
  type: string;
  description: string;
  owner_id: string;
  content: string;
  media: Media[];
  thumbnail: Thumbnail;
  tags: string[];
  status: string;
  approving_status: string;
  participants: any;
  is_allow_comment: boolean;
  created_at: string;
  updated_at: string;
  updated_by: any;
  scheduled_at: any;
  notification_status: string;
  owner: any;
  likes: number;
  dislikes: number;
  views: number;
  total_unread_comments: number;
  total_comments: number;
  oldest_unread_comment: number;
  liked: boolean;
}

// Platform Types

export interface GetPlatformsResponse {
  applications: Application[];
  pagination: Pagination;
}

export interface Application {
  id: number;
  name: string;
  slug: string;
  url: string;
  api_key: string;
  is_get_all_reels: boolean;
  sort_reels: string;
  basic_auth: string;
  date_created: string;
  date_updated: string;
  max_file_size: number;
}

// Approving Status Types
export interface ApprovingStatus {
  name: string;
  slug: string;
}

// Categories Types
export interface GetCategoriesResponse {
  categories: Category[];
  pagination: Pagination;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface ApproveContentPayload {
  reason: string;
  reel_id: string;
}

export interface ApproveContentBatchPayload {
  reason: string;
  reel_ids: string[];
}
