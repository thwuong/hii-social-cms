import { keepPreviousData, useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '@/lib';
import { reportService } from '../services/report-service';
import type {
  AcceptReportPayload,
  GetReportsPayload,
  GetReportsResponse,
  MarkReportsAsReviewedPayload,
  RejectReportPayload,
} from '../types';

export const reportKeys = {
  all: ['reports'] as const,
  lists: () => [...reportKeys.all, 'list'] as const,
  list: (filters: GetReportsPayload) => [...reportKeys.lists(), filters] as const,
  details: () => [...reportKeys.all, 'detail'] as const,
  detail: (id: string) => [...reportKeys.details(), id] as const,
  reasons: () => [...reportKeys.all, 'reasons'] as const,
};

export const useReportReasons = () => {
  return useQuery({
    queryKey: reportKeys.reasons(),
    queryFn: () => reportService.getReportReasons({}),
    placeholderData: keepPreviousData,
  });
};

// Get reports with infinite scroll
export const useReports = (filters: GetReportsPayload = {}) => {
  const reportQuery = useInfiniteQuery({
    queryKey: reportKeys.list(filters),
    queryFn: ({ pageParam = '' }) =>
      reportService.getReports({
        ...filters,
        cursor: pageParam,
        limit: filters.limit || 20,
      }),
    getNextPageParam: (lastPage: GetReportsResponse) => {
      return lastPage.has_next ? lastPage.next_cursor : undefined;
    },
    placeholderData: keepPreviousData,
    initialPageParam: '',
  });

  return {
    ...reportQuery,
    data: reportQuery.data?.pages.flatMap((page) => page.videos || []),
  };
};

// Get report detail
export const useReportDetail = (reportId: string) => {
  return useQuery({
    queryKey: reportKeys.detail(reportId),
    queryFn: () => reportService.getReportDetail(reportId),
    enabled: !!reportId,
    placeholderData: keepPreviousData,
  });
};

// Accept report mutation
export const useAcceptReport = () => {
  return useMutation({
    mutationFn: (payload: AcceptReportPayload) => reportService.acceptReport(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
      queryClient.invalidateQueries({ queryKey: reportKeys.details() });
    },
  });
};

// Reject report mutation
export const useRejectReport = () => {
  return useMutation({
    mutationFn: (payload: RejectReportPayload) => reportService.rejectReport(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
      queryClient.invalidateQueries({ queryKey: reportKeys.details() });
    },
  });
};

// Mark reports as reviewed mutation
export const useMarkReportsAsReviewed = () => {
  return useMutation({
    mutationFn: (payload: MarkReportsAsReviewedPayload) =>
      reportService.markReportsAsReviewed(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
      queryClient.invalidateQueries({ queryKey: reportKeys.details() });
    },
  });
};
