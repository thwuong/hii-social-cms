/**
 * React Query Hook Example - Content Management
 *
 * Custom hooks sử dụng React Query để fetch và manage data
 */

import { queryClient } from '@/lib/query-client';
import { keepPreviousData, useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { queryKeys } from '../query-keys';
import { crawlService } from '../services/crawl-service';
import { useCrawlContentDetails, useCrawlFilters } from '../stores/useCrawlStore';
import { MakeVideoCrawlerPayload, PaginatedResponse } from '../types';
import { transformCrawlContent } from '../utils';

const useCrawlContent = () => {
  const filters = useCrawlFilters();
  const crawlContentQuery = useInfiniteQuery({
    queryKey: [queryKeys.contentCrawl.all, filters],
    queryFn: ({ pageParam = 1 }) =>
      crawlService.getContentCrawler({ ...filters, page: pageParam }) as Promise<PaginatedResponse>,
    getNextPageParam: (lastPage: PaginatedResponse) => {
      const totalPages = lastPage.pagination.total_page;
      const currentPage = lastPage.pagination.page;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });

  return {
    ...crawlContentQuery,
    data:
      crawlContentQuery.data?.pages.flatMap((page) => page.videos.map(transformCrawlContent)) || [],
  };
};

const useMakeVideoCrawler = () => {
  return useMutation({
    mutationFn: ({ video_id, payload }: { video_id: number; payload: MakeVideoCrawlerPayload }) =>
      crawlService.makeVideoCrawler(video_id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contentCrawl.all });
    },
    onError: (error) => {},
  });
};

const useGetContentCrawlerDetails = (video_id: number) => {
  const initialData = useCrawlContentDetails();

  const contentDetailsQuery = useQuery({
    queryKey: [queryKeys.contentCrawl.details, video_id],
    queryFn: () => crawlService.getContentCrawlerDetails(video_id),
    placeholderData: keepPreviousData,
  });

  return {
    ...contentDetailsQuery,
    data: contentDetailsQuery.data ? transformCrawlContent(contentDetailsQuery.data) : initialData,
  };
};

export { useCrawlContent, useGetContentCrawlerDetails, useMakeVideoCrawler };
