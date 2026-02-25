import { usePermissions } from '@/features/auth/stores/useAuthStore';
import { Permission } from '@/shared/types';

export const usePermission = (permission: Permission) => {
  const permissions = usePermissions();

  return permissions?.includes(permission) || false;
};
