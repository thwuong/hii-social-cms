import { VideoInfo } from './reports';

export interface Report {
  created_at: string;
  description: string;
  id: string;
  reason_id: string;
  status: string;
  updated_at: string;
  user_reporter: string;
  video_id: string;
}

export interface ReportDetailResponse {
  reports: Report[];
  video_info: VideoInfo;
}
