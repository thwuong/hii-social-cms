import { queryClient } from '@/lib';
import { keepPreviousData, useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import { ReportSearchSchema } from '../schema';
import { reportService } from '../services/report-service';
import type {
  AcceptReportPayload,
  GetReportsResponse,
  MarkReportsAsReviewedPayload,
  RejectReportPayload,
} from '../types';
import { reportKeys } from '../query-keys';

export const useReportReasons = () => {
  return useQuery({
    queryKey: reportKeys.reasons(),
    queryFn: () => reportService.getReportReasons({}),
    placeholderData: keepPreviousData,
  });
};

// Get reports with infinite scroll
export const useReports = () => {
  const filters: ReportSearchSchema = useSearch({ strict: false });
  const reportQuery = useInfiniteQuery({
    queryKey: reportKeys.list(filters),
    queryFn: ({ pageParam = '' }) =>
      reportService.getReports({
        ...filters,
        cursor: pageParam,
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
      queryClient.invalidateQueries({ queryKey: reportKeys.all });
    },
  });
};

// Reject report mutation
export const useRejectReport = () => {
  return useMutation({
    mutationFn: (payload: RejectReportPayload) => reportService.rejectReport(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.all });
    },
  });
};

// Mark reports as reviewed mutation
export const useMarkReportsAsReviewed = () => {
  return useMutation({
    mutationFn: (payload: MarkReportsAsReviewedPayload) =>
      reportService.markReportsAsReviewed(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.all });
    },
  });
};
