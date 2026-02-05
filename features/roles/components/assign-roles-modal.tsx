'use client';

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
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const { data: rolesData, isLoading } = useGetRoles();
  const assignRolesMutation = useAssignRolesToUser();

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedRoleIds([]);
    }
  }, [isOpen]);

  const handleToggleRole = (roleId: string) => {
    setSelectedRoleIds((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );
  };

  const handleAssign = () => {
    if (selectedRoleIds.length === 0) return;

    assignRolesMutation.mutate(
      {
        userId,
        payload: { role_ids: selectedRoleIds },
      },
      {
        onSuccess: () => {
          setSelectedRoleIds([]);
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Gán vai trò cho người dùng</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="border-primary h-6 w-6 animate-spin rounded-full border-4 border-t-transparent" />
            </div>
          ) : availableRoles.length > 0 ? (
            <div className="max-h-96 space-y-3 overflow-y-auto">
              {availableRoles.map((role) => (
                <div
                  key={role.id}
                  className={`cursor-pointer rounded-md border p-3 transition-colors ${
                    selectedRoleIds.includes(role.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleToggleRole(role.id)}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id={role.id}
                      checked={selectedRoleIds.includes(role.id)}
                      onCheckedChange={() => handleToggleRole(role.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <Label htmlFor={role.id} className="cursor-pointer font-medium">
                          {role.name}
                        </Label>
                        <Badge variant="outline">{role.slug}</Badge>
                      </div>
                      <p className="mb-2 text-sm text-gray-600">{role.description}</p>
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
                </div>
              ))}
            </div>
          ) : (
            <p className="py-4 text-center text-gray-500">Không có vai trò nào để gán</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={assignRolesMutation.isPending}>
            Hủy
          </Button>
          <Button
            onClick={handleAssign}
            disabled={assignRolesMutation.isPending || selectedRoleIds.length === 0}
          >
            {assignRolesMutation.isPending && (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            Gán {selectedRoleIds.length > 0 && `(${selectedRoleIds.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
