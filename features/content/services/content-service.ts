import { api } from '@/services';
import queryString from 'query-string';
import { ContentSchema } from '../schemas/content.schema';
import {
  ApproveContentBatchPayload,
  ApproveContentPayload,
  ApprovingStatus,
  GetContentPayload,
  GetContentResponse,
  PublishContentPayload,
  Reel,
  RejectContentBatchPayload,
  ScheduleContentBatchPayload,
} from '../types';

class ContentService {
  private baseUrl = 'reels/dashboard';

  async createContent(dataForm: ContentSchema) {
    const { platforms, ...payload } = dataForm;
    const searchParams = queryString.stringify({ api_key: platforms });
    const data = await api.post(`${this.baseUrl}/?${searchParams}`, payload);
    return data;
  }

  async getContent(queryParams: Partial<GetContentPayload>) {
    const formattedQueryParams = {
      ...queryParams,
      platforms: queryParams.platforms?.includes('all') ? [] : queryParams.platforms,
    };
    const searchParams = queryString.stringify(formattedQueryParams);
    const data = await api.get<GetContentResponse>(`${this.baseUrl}?${searchParams}`);
    return data;
  }

  async getContentDetails(id: string, approving_status: string) {
    const data = await api.get<Reel>(`${this.baseUrl}/${id}?approving_status=${approving_status}`);
    return data;
  }

  async getApprovingStatus() {
    const data = await api.get<ApprovingStatus[]>(`${this.baseUrl}/approving-status`);
    return data;
  }

  async scheduleContent(payload: ScheduleContentBatchPayload) {
    const data = await api.post(`${this.baseUrl}/schedules/batch`, payload);
    return data;
  }

  async approveContent(payload: ApproveContentPayload) {
    const data = await api.post(`${this.baseUrl}/approve`, payload);
    return data;
  }

  async approveContents(payload: ApproveContentBatchPayload) {
    const data = await api.post(`reels/dashboard/approve-batch`, payload);
    return data;
  }

  async publishContent(payload: PublishContentPayload) {
    const data = await api.post(`${this.baseUrl}/publish-batch`, payload);
    return data;
  }

  async rejectContent(payload: ApproveContentPayload) {
    const data = await api.post(`${this.baseUrl}/reject`, payload);
    return data;
  }

  async rejectContents(payload: RejectContentBatchPayload) {
    const data = await api.post(`reels/dashboard/reject-batch`, payload);
    return data;
  }
}

export const contentService = new ContentService();
