'use client';

import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { ConfirmationModal } from '@/shared/components';
import { Badge, Button, Card, CardContent, CardHeader, Typography } from '@/shared/ui';
import { useGetUserRoles, useRevokeRoleFromUser } from '../hooks';
import { AssignRolesModal } from './assign-roles-modal';

interface UserRolesCardProps {
  userId: string;
}

export const UserRolesCard = ({ userId }: UserRolesCardProps) => {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [roleToRevoke, setRoleToRevoke] = useState<{ id: string; name: string } | null>(null);
  const { data: userRoles, isLoading } = useGetUserRoles(userId);
  const revokeRoleMutation = useRevokeRoleFromUser();

  const handleRevokeRole = (role: { id: string; name: string }) => {
    setRoleToRevoke(role);
  };

  const confirmRevoke = () => {
    if (roleToRevoke) {
      revokeRoleMutation.mutate(
        { userId, roleId: roleToRevoke.id },
        {
          onSuccess: () => {
            setRoleToRevoke(null);
          },
        }
      );
    }
  };

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
          {isLoading && (
            <div className="flex justify-center py-4">
              <div className="border-primary h-6 w-6 animate-spin rounded-full border-4 border-t-transparent" />
            </div>
          )}

          {userRoles && userRoles.length > 0 && (
            <div className="space-y-3">
              {userRoles.map((role) => (
                <div
                  key={role.id}
                  className="flex items-center justify-between rounded-md border border-black/10 bg-white/10 p-3 dark:border-white/10 dark:bg-black/10"
                >
                  <div className="flex-1">
                    <Typography variant="small" className="font-medium">
                      {role.name}
                    </Typography>
                    <Typography variant="small" className="text-zinc-500">
                      {role.description}
                    </Typography>
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
                    onClick={() => handleRevokeRole(role)}
                    disabled={revokeRoleMutation.isPending}
                    aria-label="Thu hồi vai trò"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          {userRoles && userRoles.length === 0 && (
            <Typography variant="small" className="text-center text-zinc-500">
              Người dùng chưa được gán vai trò nào
            </Typography>
          )}
        </CardContent>
      </Card>

      <AssignRolesModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        userId={userId}
        currentRoleIds={userRoles?.map((r) => r.id) || []}
      />

      <ConfirmationModal
        isOpen={!!roleToRevoke}
        onClose={() => setRoleToRevoke(null)}
        onConfirm={confirmRevoke}
        title="Thu hồi vai trò"
        message={`Bạn có chắc chắn muốn thu hồi vai trò "${roleToRevoke?.name}" từ người dùng này không?`}
        confirmText="Thu hồi"
        isLoading={revokeRoleMutation.isPending}
        variant="destructive"
      />
    </>
  );
};
