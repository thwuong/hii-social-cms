import { api } from '@/services';
import queryString from 'query-string';
import type {
  AcceptReportPayload,
  GetReportsPayload,
  GetReportsResponse,
  MarkReportsAsReviewedPayload,
  RejectReportPayload,
  ReportDetailResponse,
  ReportReasonsPayload,
  ReportReasonsResponse,
} from '../types';

class ReportService {
  private baseUrl = 'reels/dashboard';

  // Get all reports with filters
  async getReportReasons(payload: ReportReasonsPayload): Promise<ReportReasonsResponse> {
    const searchParams = queryString.stringify(payload);

    const data = await api.get<ReportReasonsResponse>(
      `${this.baseUrl}/report-reasons?${searchParams}`
    );

    return data;
  }

  // Get all reports with filters
  async getReports(payload: GetReportsPayload): Promise<GetReportsResponse> {
    const searchParams = queryString.stringify(payload);

    const data = await api.get<GetReportsResponse>(
      `${this.baseUrl}/reported-videos?${searchParams}`
    );

    return data;
  }

  // Get report detail
  async getReportDetail(reportId: string): Promise<ReportDetailResponse> {
    const data = await api.get<ReportDetailResponse>(
      `${this.baseUrl}/reported-videos/${reportId}/reports`
    );
    return data;
  }

  // Accept reports - hide videos
  async acceptReport(payload: AcceptReportPayload): Promise<void> {
    const data = await api.put<void>(`${this.baseUrl}/videos/hidden-batch`, {
      is_hidden: true,
      video_ids: payload.video_ids,
    });

    return data;
  }

  // Reject reports - keep videos visible
  async rejectReport(payload: RejectReportPayload): Promise<void> {
    const data = await api.put<void>(`${this.baseUrl}/videos/hidden-batch`, {
      is_hidden: false,
      video_ids: payload.video_ids,
    });

    return data;
  }

  // Mark reports as reviewed
  async markReportsAsReviewed(payload: MarkReportsAsReviewedPayload): Promise<void> {
    const data = await api.put<void>(`${this.baseUrl}/reports/reviewed`, {
      report_ids: payload.report_ids,
    });

    return data;
  }
}

export const reportService = new ReportService();
