import { queryClient } from '@/lib';
import { keepPreviousData, useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { queryKeys } from '../query-keys';
import { ContentSearchSchema } from '../schemas/content-search.schema';
import { ContentSchema } from '../schemas/content.schema';
import { contentService } from '../services/content-service';
import {
  ApproveContentBatchPayload,
  ApproveContentPayload,
  GetContentResponse,
  PublishContentPayload,
  RejectContentBatchPayload,
} from '../types';
import { transformReelContent } from '../utils';

export const useContent = (filters: Partial<ContentSearchSchema>) => {
  const queryKey = queryKeys.content.lists(filters);
  const contentQuery = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 1 }) =>
      contentService.getContent({
        ...filters,
        page: pageParam,
      }),
    getNextPageParam: (lastPage: GetContentResponse, allPages: GetContentResponse[]) => {
      const totalPages = allPages[allPages.length - 1].total_page;
      const currentPage = lastPage.page;
      return totalPages > currentPage ? currentPage + 1 : undefined;
    },
    placeholderData: keepPreviousData,
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    ...contentQuery,
    data: contentQuery.data?.pages.flatMap((page) =>
      page.reels ? page.reels.map(transformReelContent) : []
    ),
    totalItems: contentQuery.data?.pages[contentQuery.data.pages.length - 1].total || 0,
  };
};

export const useCreateContent = () => {
  return useMutation({
    mutationFn: ({ data }: { data: ContentSchema }) => contentService.createContent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contentCrawl.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.content.all });
    },
  });
};

export const useContentDetails = ({
  id,
  approving_status,
}: {
  id: string;
  approving_status: string;
}) => {
  const queryKey = queryKeys.content.details(id, approving_status);
  const contentDetailsQuery = useQuery({
    queryKey,
    queryFn: () => contentService.getContentDetails(id, approving_status),
    placeholderData: keepPreviousData,
    enabled: !!id && !!approving_status,
  });

  return {
    ...contentDetailsQuery,
    data: contentDetailsQuery.data ? transformReelContent(contentDetailsQuery.data) : null,
  };
};

export const useApprovingStatus = () => {
  return useQuery({
    queryKey: queryKeys.approvingStatus.all,
    queryFn: () => contentService.getApprovingStatus(),
  });
};

export const useApproveContent = () => {
  return useMutation({
    mutationFn: (payload: ApproveContentPayload) => contentService.approveContent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.content.all });
    },
  });
};

export const useApproveContents = () => {
  return useMutation({
    mutationFn: (payload: ApproveContentBatchPayload) => contentService.approveContents(payload),
    onSuccess: (_) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.content.all });
    },
  });
};

export const useRejectContent = () => {
  return useMutation({
    mutationFn: (payload: ApproveContentPayload) => contentService.rejectContent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.content.all });
    },
  });
};

export const useRejectContents = () => {
  return useMutation({
    mutationFn: (payload: RejectContentBatchPayload) => contentService.rejectContents(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.content.all });
    },
  });
};

export const usePublishContent = () => {
  return useMutation({
    mutationFn: (payload: PublishContentPayload) => contentService.publishContent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.content.all });
    },
  });
};
