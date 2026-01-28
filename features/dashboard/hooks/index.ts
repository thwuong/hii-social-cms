import { queryKeys } from '@/features/dashboard/query-keys';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services';

export const useDashboardStats = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: dashboardService.getDashboardStats,
  });
  return { data, isLoading, error };
};

export const useDashboardTimeseries = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.dashboard.timeseries(),
    queryFn: dashboardService.getDashboardTimeseries,
  });
  return { data, isLoading, error };
};
