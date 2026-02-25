import { ReportStatus, Video } from './report-detail';

export interface GetReportsResponse {
  has_next: boolean;
  next_cursor: string;
  number_of_items: number;
  total: number;
  videos: Video[];
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
