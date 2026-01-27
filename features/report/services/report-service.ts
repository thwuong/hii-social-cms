import { api } from '@/services';
import queryString from 'query-string';
import type {
  AcceptReportPayload,
  GetReportsPayload,
  GetReportsResponse,
  RejectReportPayload,
  ReportDetailResponse,
  ReportReasonsPayload,
  ReportReasonsResponse,
} from '../types';

export const reportService = {
  // Get all reports with filters
  getReportReasons: async (payload: ReportReasonsPayload): Promise<ReportReasonsResponse> => {
    const searchParams = queryString.stringify(payload);

    const response = await api.get<ReportReasonsResponse>(
      `reels/dashboard/report-reasons?${searchParams}`
    );
    return response;
  },

  // Get all reports with filters
  getReports: async (payload: GetReportsPayload): Promise<GetReportsResponse> => {
    const searchParams = queryString.stringify(payload);

    const response = await api.get<GetReportsResponse>(
      `reels/dashboard/reported-videos?${searchParams}`
    );
    return response;
  },

  // Get report detail
  getReportDetail: async (reportId: string): Promise<ReportDetailResponse> => {
    const response = await api.get<ReportDetailResponse>(
      `reels/dashboard/reported-videos/${reportId}/reports`
    );
    return response;
  },

  // Accept reports - hide videos
  acceptReport: async (payload: AcceptReportPayload): Promise<void> => {
    await api.put<void>('reels/dashboard/videos/hidden-batch', {
      is_hidden: true,
      video_ids: payload.video_ids,
    });
  },

  // Reject reports - keep videos visible
  rejectReport: async (payload: RejectReportPayload): Promise<void> => {
    await api.put<void>('reels/dashboard/videos/hidden-batch', {
      is_hidden: false,
      video_ids: payload.video_ids,
    });
  },
};
