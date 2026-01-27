import { keepPreviousData, useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '@/lib';
import { ContentSchema } from '../schemas/content.schema';
import { contentService } from '../services/content-service';
import {
  ApproveContentBatchPayload,
  ApproveContentPayload,
  ContentStatus,
  GetContentResponse,
  PublishContentPayload,
} from '../types';
import { transformReelContent } from '../utils';
import { useContentStore } from '../stores/useContentStore';
import { queryKeys } from '../query-keys';

export const useContent = (status?: ContentStatus) => {
  const { filters } = useContentStore();
  const approvingStatus = status || filters.approving_status;
  const contentQuery = useInfiniteQuery({
    queryKey: [
      queryKeys.content.lists,
      {
        ...filters,
        approving_status: approvingStatus,
      },
    ],
    queryFn: ({ pageParam = 1 }) =>
      contentService.getContent({
        ...filters,
        approving_status: approvingStatus,
        page: pageParam,
      }),
    getNextPageParam: (lastPage: GetContentResponse, allPages: GetContentResponse[]) => {
      const totalPages = allPages[allPages.length - 1].total_page;
      const currentPage = lastPage.page;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    placeholderData: keepPreviousData,
    initialPageParam: 1,
  });

  return {
    ...contentQuery,
    data: contentQuery.data?.pages.flatMap((page) =>
      page.reels ? page.reels.map(transformReelContent) : []
    ),
  };
};

export const useCreateContent = () => {
  return useMutation({
    mutationFn: ({ data }: { data: ContentSchema }) => contentService.createContent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.contentCrawl.lists] });
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
  const contentDetailsQuery = useQuery({
    queryKey: [queryKeys.content.details, id, approving_status],
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
    queryKey: [queryKeys.content.approvingStatus],
    queryFn: () => contentService.getApprovingStatus(),
  });
};

export const useApproveContent = () => {
  const { filters } = useContentStore();
  return useMutation({
    mutationFn: (payload: ApproveContentPayload) => contentService.approveContent(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.content.lists, filters] });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.content.details, variables.reel_id],
      });
    },
  });
};

export const useApproveContents = () => {
  const { filters } = useContentStore();
  return useMutation({
    mutationFn: (payload: ApproveContentBatchPayload) => contentService.approveContents(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.content.lists, filters] });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.content.details, variables.reel_ids],
      });
    },
  });
};

export const useRejectContent = () => {
  const { filters } = useContentStore();
  return useMutation({
    mutationFn: (payload: ApproveContentPayload) => contentService.rejectContent(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.content.lists, filters] });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.content.details, variables.reel_id],
      });
    },
  });
};

export const useRejectContents = () => {
  const { filters } = useContentStore();
  return useMutation({
    mutationFn: (payload: ApproveContentBatchPayload) => contentService.rejectContents(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.content.lists, filters] });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.content.details, variables.reel_ids],
      });
    },
  });
};

export const usePublishContent = () => {
  const { filters } = useContentStore();
  return useMutation({
    mutationFn: (payload: PublishContentPayload) => contentService.publishContent(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.content.lists, filters] });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.content.details, variables.reel_ids],
      });
    },
  });
};
