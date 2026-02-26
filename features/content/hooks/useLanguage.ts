import { useInfiniteQuery } from '@tanstack/react-query';
import { queryKeys } from '../query-keys';
import { languageService } from '../services/language-service';

const useLanguages = ({ q, limit = 10 }: { q?: string; limit?: number }) => {
  const params = {
    q,
    limit,
  };
  const languagesQuery = useInfiniteQuery({
    queryKey: queryKeys.languages.lists(params),
    queryFn: ({ pageParam = 1 }) => languageService.getLanguages({ page: pageParam, q, limit }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const next = lastPage.pagination.has_next ? lastPage.pagination.page + 1 : undefined;
      return next;
    },
  });
  return {
    ...languagesQuery,
    data: languagesQuery.data?.pages.flatMap((page) => page.languages) || [],
  };
};

export { useLanguages };
