import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { userKeys } from '../query-keys';
import { userService } from '../services/user.service';
import { GetUsersParams } from '../types';

/**
 * Hook to fetch users with infinite scroll
 */
export function useUsers(params: GetUsersParams = {}) {
  const usersQuery = useInfiniteQuery({
    queryKey: userKeys.list(params),
    queryFn: ({ pageParam }) => userService.getUsers({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = allPages[allPages.length - 1].pagination.page;
      if (lastPage.pagination.totalPages > currentPage) {
        return currentPage + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    ...usersQuery,
    data: usersQuery.data?.pages.flatMap((page) => page.users) || [],
  };
}

/**
 * Hook to fetch a single user by ID
 */
export function useUserById(userId: string) {
  const userQuery = useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => userService.getUserById(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    ...userQuery,
    data: userQuery.data || null,
  };
}
