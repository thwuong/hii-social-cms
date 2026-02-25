import { usePermission } from '@/shared/hooks/use-permission';
import { Permission } from '@/shared/types';
import React from 'react';

export default function PermissionGate({
  permission,
  children,
}: {
  permission: Permission;
  children: React.ReactNode;
}) {
  const hasPermission = usePermission(permission);

  if (!hasPermission) {
    return null;
  }

  return children;
}
