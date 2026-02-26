import { useInfiniteQuery } from '@tanstack/react-query';
import { queryKeys } from '../query-keys';
import { countryService } from '../services/country-service';

const useCountries = ({ q, limit = 10 }: { q?: string; limit?: number }) => {
  const params = {
    q,
    limit,
  };
  const countriesQuery = useInfiniteQuery({
    queryKey: queryKeys.countries.lists(params),
    queryFn: ({ pageParam = 1 }) => countryService.getCountries({ page: pageParam, q, limit }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const next = lastPage.pagination.has_next ? lastPage.pagination.page + 1 : undefined;
      return next;
    },
  });
  return {
    ...countriesQuery,
    data: countriesQuery.data?.pages.flatMap((page) => page.countries) || [],
  };
};

export { useCountries };
