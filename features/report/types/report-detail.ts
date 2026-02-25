import { Media, Thumbnail } from '@/features/content';
import { ReportReason } from './reason';

export interface Report {
  created_at: string;
  description: string;
  id: string;
  reason_id: string;
  status: string;
  updated_at: string;
  user_reporter: string;
  video_id: string;
  reason: ReportReason;
  reporter_info: ReporterInfo;
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

export interface Owner {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
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
  owner: Owner;
}

export enum ReportStatus {
  PENDING = 'pending',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
  REVIEWED = 'reviewed',
}
export interface ReporterInfo {
  user_id: string;
  username: string;
  email: string;
  name: string;
}

export interface ReportDetailResponse {
  reports: Report[];
  video_info: VideoInfo;
}

export interface MarkReportsAsReviewedPayload {
  report_ids: string[];
}
