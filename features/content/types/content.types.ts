import { UpdateReelSchema } from '../schemas';

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
  platforms: string[];
  categories: string[];
  reason: string;
  is_pending: boolean;
  playlist?: string;
}

export interface PublishContentPayload {
  reel_ids: string[];
}

export interface ScheduleContentPayload {
  reel_id: string;
  scheduled_at: string;
}

export interface GetContentPayload {
  approving_status: string;
  categories: string[];
  platform: string;
  search: string;
  page: number;
  page_size: number;
  sort: string;
  sort_order: string;
}

export interface ApproveContentPayload {
  reason: string;
  reel_id: string;
  update_reels?: UpdateReelSchema;
}

export interface ApproveContentBatchPayload {
  reason: string;
  reel_ids: [
    {
      reel_id: string;
    },
  ];
}

export interface RejectContentBatchPayload {
  reason: string;
  reel_ids: string[];
}

export interface ScheduleContentBatchPayload {
  schedules: {
    reel_id: string;
    scheduled_at: string;
  }[];
}
