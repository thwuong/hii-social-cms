/**
 * React Query Hook Example - Content Management
 *
 * Custom hooks sử dụng React Query để fetch và manage data
 */

import { queryClient } from '@/lib/query-client';
import { SortOrder } from '@/shared';
import { keepPreviousData, useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { queryKeys } from '../query-keys';
import { DraftContentSearchSchema } from '../schemas';
import { draftContentService } from '../services/draft-content-service';
import { MakeDraftContentPreviewPayload, PaginatedResponse } from '../types';
import { transformCrawlContent } from '../utils';

const useDraftContent = (filters: Partial<DraftContentSearchSchema>) => {
  const queryKey = queryKeys.contentCrawl.list(filters);
  const crawlContentQuery = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 1 }) =>
      draftContentService.getDraftContent({
        ...filters,
        page: pageParam,
      }) as Promise<PaginatedResponse>,
    getNextPageParam: (lastPage: PaginatedResponse) => {
      const totalPages = lastPage.pagination.total_page;
      const currentPage = lastPage.pagination.page;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    initialPageParam: 1,
  });

  return {
    ...crawlContentQuery,
    data:
      crawlContentQuery.data?.pages.flatMap((page) =>
        page.videos.filter((video) => !video.is_created).map(transformCrawlContent)
      ) || [],
    totalItems:
      crawlContentQuery.data?.pages[crawlContentQuery.data.pages.length - 1].pagination.total || 0,
  };
};

const useMakeDraftContentPreview = () => {
  return useMutation({
    mutationFn: ({
      video_id,
      payload,
    }: {
      video_id: number;
      payload: MakeDraftContentPreviewPayload;
    }) => draftContentService.makeDraftContentPreview(video_id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contentCrawl.all });
    },
  });
};

const useGetDraftContentDetails = (video_id: number) => {
  const contentDetailsQuery = useQuery({
    queryKey: queryKeys.contentCrawl.detail(video_id.toString()),
    queryFn: () => draftContentService.getDraftContentDetails(video_id),
    placeholderData: keepPreviousData,
    enabled: !!video_id,
  });

  return {
    ...contentDetailsQuery,
    data: contentDetailsQuery.data ? transformCrawlContent(contentDetailsQuery.data) : null,
  };
};

const useGetDraftContentPlaylist = (filters: Partial<DraftContentSearchSchema>) => {
  const crawlContentQuery = useInfiniteQuery({
    queryKey: queryKeys.contentCrawl.playlistList(filters),
    queryFn: ({ pageParam = 1 }) =>
      draftContentService.getDraftContent({
        ...filters,
        page: pageParam,
        is_previewed: filters.is_previewed,
        sort_order: filters.sort_order as SortOrder,
      }) as Promise<PaginatedResponse>,
    getNextPageParam: (lastPage: PaginatedResponse) => {
      const totalPages = lastPage.pagination.total_page;
      const currentPage = lastPage.pagination.page;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!filters.playlist?.length,
  });

  return {
    ...crawlContentQuery,
    data:
      crawlContentQuery.data?.pages.flatMap((page) =>
        page.videos.filter((video) => !video.is_created).map(transformCrawlContent)
      ) || [],
    totalItems:
      crawlContentQuery.data?.pages[crawlContentQuery.data.pages.length - 1].pagination.total || 0,
  };
};

export {
  useDraftContent,
  useGetDraftContentDetails,
  useGetDraftContentPlaylist,
  useMakeDraftContentPreview,
};
