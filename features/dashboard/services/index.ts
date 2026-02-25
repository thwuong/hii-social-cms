import { api } from '@/services';
import { StatsContentResponse, TimeseriesResponse } from '../types';

class DashboardService {
  private baseUrl = 'reels/dashboard/stats';

  async getDashboardStats() {
    const data = await api.get<StatsContentResponse>(`${this.baseUrl}/content`);
    return data;
  }

  async getDashboardTimeseries() {
    const data = await api.get<TimeseriesResponse>(`${this.baseUrl}/timeseries`);
    return data;
  }
}

export const dashboardService = new DashboardService();
