import { queryClient } from '@/lib';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { permissionKeys } from '../query-keys';
import { permissionService } from '../services';
import { CreatePermissionParams } from '../types';

export const usePermissions = () => {
  const permissionsQuery = useInfiniteQuery({
    queryKey: permissionKeys.all,
    queryFn: ({ pageParam }) => permissionService.getPermissions({ cursor: pageParam, limit: 20 }),
    getNextPageParam: (lastPage) => (lastPage.has_next ? lastPage.next_cursor : undefined),
    initialPageParam: '',
  });

  return {
    ...permissionsQuery,
    permissions: permissionsQuery.data?.pages.flatMap((page) => page.permissions) || [],
  };
};

export const useCreatePermission = () => {
  const createPermissionMutation = useMutation({
    mutationFn: (data: CreatePermissionParams) => permissionService.createPermission(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: permissionKeys.all });
    },
  });

  return createPermissionMutation;
};
