import { queryClient } from '@/lib';
import { ContentStatus } from '@/shared';
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
  Reel,
  RejectContentBatchPayload,
  Video,
} from '../types';
import { transformCrawlContent, transformReelContent } from '../utils';

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

export const useContentInPlaylist = (filters: Partial<ContentSearchSchema>) => {
  const queryKey = queryKeys.content.inPlaylist(filters);
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
    initialPageParam: 1,
    enabled: !!filters.playlist?.length,
  });

  return {
    ...contentQuery,
    data:
      contentQuery.data?.pages.flatMap((page) =>
        page.reels ? page.reels.map(transformReelContent) : []
      ) || [],
    totalItems: contentQuery.data?.pages[contentQuery.data.pages.length - 1].total || 0,
  };
};

export const useCreateContent = () => {
  return useMutation({
    mutationFn: ({ data }: { data: ContentSchema }) => contentService.createContent(data),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.contentCrawl.detail(variables.data.crawler_id),
      });
      const previousData = queryClient.getQueryData(
        queryKeys.contentCrawl.detail(variables.data.crawler_id)
      );

      queryClient.setQueryData(
        queryKeys.contentCrawl.detail(variables.data.crawler_id),
        (old: Video | undefined) => {
          if (!old) return old;
          const updated = { ...old, is_pending: true };

          return transformCrawlContent(updated);
        }
      );

      return { previousData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.content.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.contentCrawl.all });
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(
          queryKeys.contentCrawl.detail(_variables.data.id || ''),
          context.previousData
        );
      }
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
    onMutate: async (payload) => {
      const queryKey = queryKeys.content.details(payload.reel_id, ContentStatus.PENDING_REVIEW);
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueriesData(
        {
          queryKey,
        },
        (old: Reel | undefined) => {
          if (!old) return old;
          const updated = { ...old, is_pending: true };
          return transformReelContent(updated);
        }
      );

      return { previousData, queryKey };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.content.all });
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(context.queryKey, context.previousData);
      }
    },
  });
};

export const useApproveContents = () => {
  return useMutation({
    mutationFn: (payload: ApproveContentBatchPayload) => contentService.approveContents(payload),
    onMutate: async (payload) => {
      const updates = payload.reel_ids.map(async (reel) => {
        const detailQueryKey = queryClient.getQueryCache().find({
          queryKey: queryKeys.content.details(reel.reel_id, ContentStatus.PENDING_REVIEW),
        })?.queryKey;

        if (!detailQueryKey) return null;

        await queryClient.cancelQueries({ queryKey: detailQueryKey });
        const previousData = queryClient.getQueryData(detailQueryKey);

        queryClient.setQueriesData({ queryKey: detailQueryKey }, (old: Reel | undefined) => {
          if (!old) return old;
          const updated = { ...old, is_pending: true };
          return transformReelContent(updated);
        });

        return { queryKey: detailQueryKey, previousData };
      });

      const previousDataArray = await Promise.all(updates);

      return { previousDataArray: previousDataArray.filter(Boolean) };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.content.all });
    },
    onError: (_err, _variables, context) => {
      if (context?.previousDataArray) {
        context.previousDataArray.forEach((item: any) => {
          if (item?.queryKey && item?.previousData) {
            queryClient.setQueryData(item.queryKey, item.previousData);
          }
        });
      }
    },
  });
};

export const useRejectContents = () => {
  return useMutation({
    mutationFn: (payload: RejectContentBatchPayload) => contentService.rejectContents(payload),
    onMutate: async (payload) => {
      const updates = payload.reel_ids.map(async (reelId) => {
        const detailQueryKey = queryClient.getQueryCache().find({
          queryKey: queryKeys.content.details(reelId, ContentStatus.PENDING_REVIEW),
        })?.queryKey;

        if (!detailQueryKey) return null;

        await queryClient.cancelQueries({ queryKey: detailQueryKey });
        const previousData = queryClient.getQueryData(detailQueryKey);

        queryClient.setQueryData(detailQueryKey, (old: Reel | undefined) => {
          if (!old) return old;
          const updated = { ...old, is_pending: true };
          return transformReelContent(updated);
        });

        return { queryKey: detailQueryKey, previousData };
      });

      const previousDataArray = await Promise.all(updates);

      return { previousDataArray: previousDataArray.filter(Boolean) };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.content.all });
    },
    onError: (_err, _variables, context) => {
      if (context?.previousDataArray) {
        context.previousDataArray.forEach((item: any) => {
          if (item?.queryKey && item?.previousData) {
            queryClient.setQueryData(item.queryKey, item.previousData);
          }
        });
      }
    },
  });
};

export const usePublishContent = () => {
  return useMutation({
    mutationFn: (payload: PublishContentPayload) => contentService.publishContent(payload),
    onMutate: async (payload) => {
      const updates = payload.reel_ids.map(async (reelId) => {
        const detailQueryKey = queryClient
          .getQueryCache()
          .findAll({ queryKey: queryKeys.content.details(reelId, ContentStatus.APPROVED) })
          .map((query) => query.queryKey)[0];

        if (!detailQueryKey) return null;

        await queryClient.cancelQueries({ queryKey: detailQueryKey });

        const previousData = queryClient.getQueryData(detailQueryKey);

        queryClient.setQueryData(detailQueryKey, (old: Reel | undefined) => {
          if (!old) return old;
          const updated = { ...old, is_pending: true };
          return transformReelContent(updated);
        });

        return { previousData, queryKey: detailQueryKey };
      });

      const previousDataArray = await Promise.all(updates);

      return { previousDataArray: previousDataArray.filter(Boolean) };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.content.all });
    },
    onError: (_err, _variables, context) => {
      if (context?.previousDataArray) {
        context.previousDataArray.forEach((item: any) => {
          if (item?.queryKey && item?.previousData) {
            queryClient.setQueryData(item.queryKey, item.previousData);
          }
        });
      }
    },
  });
};
