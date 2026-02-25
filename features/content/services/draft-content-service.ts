import { PaginationRequest } from '@/lib/types/api';
import { api } from '@/services';
import queryString from 'query-string';
import { MakeDraftContentPreviewPayload, PaginatedResponse, Video } from '../types';

class DraftContentService {
  private baseUrl = 'crawler/videos';

  async getDraftContent(payload: PaginationRequest) {
    const searchParams = queryString.stringify(payload);
    const response = await api.get<PaginatedResponse>(this.baseUrl, { searchParams });
    return response;
  }

  async getDraftContentDetails(video_id: number) {
    const response = await api.get<Video>(`${this.baseUrl}/${video_id}`);
    return response;
  }

  async makeDraftContentPreview(video_id: number, payload: MakeDraftContentPreviewPayload) {
    const response = await api.patch(`${this.baseUrl}/${video_id}/preview`, payload);
    return response;
  }
}

export const draftContentService = new DraftContentService();
