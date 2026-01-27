import { Media, Thumbnail } from '@/features/content';
import { Report } from './report-detail';

export interface GetReportsResponse {
  has_next: boolean;
  next_cursor: string;
  number_of_items: number;
  total: number;
  videos: Video[];
}

export interface Video {
  latest_report: string;
  report_count: number;
  reports: Report[];
  video_id: string;
  video_info: VideoInfo;
}

export interface Metadata {
  channelId: number;
  name: string;
  nsfw: boolean;
  privacy: number;
  tags: string[];
  targetUrl: string;
}

export interface VideoInfo {
  approving_status: string;
  content: string;
  created_at: string;
  description: string;
  id: string;
  is_allow_comment: boolean;
  is_hidden: boolean;
  is_internal_owner: boolean;
  media: Media[];
  metadata: Metadata;
  notification_status: string;
  owner_id: string;
  participants: string[];
  peer_tube_video_uuid: string;
  scheduled_at: string;
  sound: string;
  status: string;
  tags: string[];
  thumbnail: Thumbnail;
  title: string;
  type: string;
  updated_at: string;
  updated_by: string;
}

export enum ReportStatus {
  PENDING = 'pending',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
  REVIEWED = 'reviewed',
}

export interface GetReportsPayload {
  limit?: number;
  cursor?: string;
  status?: ReportStatus;
}

export interface ReportPayload {
  is_hidden: boolean;
  video_ids: string[];
}

export interface RejectReportPayload extends ReportPayload {}
export interface AcceptReportPayload extends ReportPayload {}
