import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { roleKeys } from '../query-keys';
import { roleService } from '../services';
import {
  AssignRolesToUserPayload,
  CreateRolePayload,
  GetRolesParams,
  UpdateRolePayload,
} from '../types';

/**
 * Hook to fetch roles with cursor-based pagination
 */
export const useGetRoles = (params?: GetRolesParams) => {
  return useQuery({
    queryKey: roleKeys.list(params),
    queryFn: () => roleService.getRoles(params),
  });
};

/**
 * Hook to fetch user roles
 */
export const useGetUserRoles = (userId: string) => {
  return useQuery({
    queryKey: roleKeys.userRoles(userId),
    queryFn: () => roleService.getUserRoles(userId),
    enabled: !!userId,
  });
};

/**
 * Hook to create a new role
 */
export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRolePayload) => roleService.createRole(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
      toast.success('Tạo vai trò thành công');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Tạo vai trò thất bại');
    },
  });
};

/**
 * Hook to update a role
 */
export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateRolePayload }) =>
      roleService.updateRole(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: roleKeys.detail(variables.id) });
      toast.success('Cập nhật vai trò thành công');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Cập nhật vai trò thất bại');
    },
  });
};

/**
 * Hook to delete a role
 */
export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => roleService.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
      toast.success('Xóa vai trò thành công');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Xóa vai trò thất bại');
    },
  });
};

/**
 * Hook to assign roles to a user
 */
export const useAssignRolesToUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: AssignRolesToUserPayload }) =>
      roleService.assignRolesToUser(userId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.userRoles(variables.userId) });
      toast.success('Gán vai trò thành công');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Gán vai trò thất bại');
    },
  });
};

/**
 * Hook to revoke a role from a user
 */
export const useRevokeRoleFromUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) =>
      roleService.revokeRoleFromUser(userId, roleId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.userRoles(variables.userId) });
      toast.success('Thu hồi vai trò thành công');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Thu hồi vai trò thất bại');
    },
  });
};
