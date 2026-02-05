'use client';

import { Badge, Button, Card, CardContent, CardHeader } from '@/shared/ui';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useGetUserRoles, useRevokeRoleFromUser } from '../hooks';
import { AssignRolesModal } from './assign-roles-modal';

interface UserRolesCardProps {
  userId: string;
}

export const UserRolesCard = ({ userId }: UserRolesCardProps) => {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const { data, isLoading } = useGetUserRoles(userId);
  const revokeRoleMutation = useRevokeRoleFromUser();

  // const handleRevokeRole = (roleId: string) => {
  //   if (confirm('Bạn có chắc chắn muốn thu hồi vai trò này?')) {
  //     revokeRoleMutation.mutate({ userId, roleId });
  //   }
  // };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Vai trò của người dùng</h3>
            <Button size="sm" onClick={() => setIsAssignModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Gán vai trò
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="border-primary h-6 w-6 animate-spin rounded-full border-4 border-t-transparent" />
            </div>
          ) : data?.roles && data.roles.length > 0 ? (
            <div className="space-y-3">
              {data.roles.map((role) => (
                <div
                  key={role.id}
                  className="flex items-center justify-between rounded-md border bg-gray-50 p-3"
                >
                  <div className="flex-1">
                    <p className="font-medium">{role.name}</p>
                    <p className="text-sm text-gray-600">{role.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {role.permissions.slice(0, 3).map((permission) => (
                        <Badge key={permission} variant="secondary">
                          {permission}
                        </Badge>
                      ))}
                      {role.permissions.length > 3 && (
                        <Badge variant="outline">+{role.permissions.length - 3} quyền</Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    // onClick={() => handleRevokeRole(role.id)}
                    disabled={revokeRoleMutation.isPending}
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    aria-label="Thu hồi vai trò"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-4 text-center text-gray-500">Người dùng chưa được gán vai trò nào</p>
          )}
        </CardContent>
      </Card>

      <AssignRolesModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        userId={userId}
        currentRoleIds={data?.roles?.map((r) => r.id) || []}
      />
    </>
  );
};
