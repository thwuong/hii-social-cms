'use client';

import { cn } from '@/lib';
import {
  Badge,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
  Typography,
} from '@/shared/ui';
import { useEffect, useState } from 'react';
import { useAssignRolesToUser, useGetRoles } from '../hooks';

interface AssignRolesModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  currentRoleIds: string[];
}

export const AssignRolesModal = ({
  isOpen,
  onClose,
  userId,
  currentRoleIds,
}: AssignRolesModalProps) => {
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const { data: rolesData, isLoading } = useGetRoles();
  const assignRolesMutation = useAssignRolesToUser();

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedRoleId('');
    }
  }, [isOpen]);

  const handleToggleRole = (roleId: string) => {
    setSelectedRoleId(roleId);
  };

  const handleAssign = () => {
    if (!selectedRoleId) return;

    assignRolesMutation.mutate(
      {
        userId,
        payload: { role_id: selectedRoleId },
      },
      {
        onSuccess: () => {
          setSelectedRoleId('');
          onClose();
        },
      }
    );
  };

  // Filter out roles that user already has
  const availableRoles =
    rolesData?.roles?.filter((role) => !currentRoleIds.includes(role.id)) || [];

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !assignRolesMutation.isPending && !open && onClose()}
    >
      <DialogContent className="max-w-2xl!">
        <DialogHeader>
          <DialogTitle>Gán vai trò cho người dùng</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {isLoading && (
            <div className="flex justify-center py-4">
              <div className="border-primary h-6 w-6 animate-spin rounded-full border-4 border-t-transparent" />
            </div>
          )}

          {!isLoading && availableRoles.length > 0 && (
            <div className="max-h-96 space-y-3 overflow-y-auto">
              {availableRoles.map((role) => (
                <button
                  key={role.id}
                  className={cn(
                    `flex w-full cursor-pointer items-center gap-3 rounded-md border p-3 transition-colors`,
                    selectedRoleId === role.id
                      ? 'border-white/10 bg-white/5'
                      : 'hover:bg-gray border-white/10 bg-black/10'
                  )}
                  onClick={() => handleToggleRole(role.id)}
                  type="button"
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id={role.id}
                      checked={selectedRoleId === role.id}
                      onCheckedChange={() => handleToggleRole(role.id)}
                      className="mt-1"
                    />
                    <div className="flex flex-1 flex-col items-start gap-1.5">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={role.id} className="cursor-pointer font-medium">
                          {role.name}
                        </Label>
                        <Badge variant="outline">{role.slug}</Badge>
                      </div>
                      <Typography variant="small" className="text-zinc-500">
                        {role.description}
                      </Typography>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.slice(0, 5).map((permission) => (
                          <Badge key={permission} variant="secondary">
                            {permission}
                          </Badge>
                        ))}
                        {role.permissions.length > 5 && (
                          <Badge variant="outline">+{role.permissions.length - 5}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!isLoading && availableRoles.length === 0 && (
            <p className="py-4 text-center text-gray-500">Không có vai trò nào để gán</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={assignRolesMutation.isPending}>
            Hủy
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedRoleId}
            isLoading={assignRolesMutation.isPending}
          >
            Gán {availableRoles.find((r) => r.id === selectedRoleId)?.name || ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
