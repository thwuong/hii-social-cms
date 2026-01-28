import { api } from '@/services';
import { StatsContentResponse, TimeseriesResponse } from '../types';

export const dashboardService = {
  getDashboardStats: async () => {
    const response = await api.get<StatsContentResponse>('reels/dashboard/stats/content');
    return response;
  },
  getDashboardTimeseries: async () => {
    const response = await api.get<TimeseriesResponse>('reels/dashboard/stats/timeseries');
    return response;
  },
};
