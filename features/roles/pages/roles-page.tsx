'use client';

import { Button, Card, CardContent, CardHeader } from '@/shared/ui';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { DeleteRoleModal, PermissionFormModal, RoleFormModal, RolesTable } from '../components';
import { useDeleteRole, useGetRoles } from '../hooks';
import { Role } from '../types';

export const RolesPage = () => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreatePermissionModalOpen, setIsCreatePermissionModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch roles
  const { data, isLoading } = useGetRoles();
  const deleteRoleMutation = useDeleteRole();

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setIsEditModalOpen(true);
  };

  const handleDelete = (role: Role) => {
    setSelectedRole(role);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedRole) {
      deleteRoleMutation.mutate(selectedRole.id, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setSelectedRole(null);
        },
      });
    }
  };

  return (
    <div className="animate-in fade-in space-y-8 p-4 duration-700 sm:p-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-mono text-3xl font-bold tracking-tight uppercase">Quản lý vai trò</h1>
          <p className="text-muted-foreground mt-2 font-mono text-sm">
            Tạo và quản lý vai trò cùng quyền hạn của hệ thống
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsCreatePermissionModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Tạo quyền mới
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Tạo vai trò mới
          </Button>
        </div>
      </div>

      {/* Roles Table */}
      <Card>
        <CardHeader>
          <h2 className="font-mono text-xl font-semibold uppercase">Danh sách vai trò</h2>
        </CardHeader>
        <CardContent>
          {!isLoading && (!data?.roles || data.roles.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-muted-foreground mb-4 font-mono">Chưa có vai trò nào</p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Tạo vai trò đầu tiên
              </Button>
            </div>
          ) : (
            <RolesTable
              roles={data?.roles || []}
              isLoading={isLoading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>

      {/* Create Role Modal */}
      <RoleFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        mode="create"
      />

      {/* Edit Role Modal */}
      <RoleFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedRole(null);
        }}
        mode="edit"
        role={selectedRole}
      />

      {/* Delete Confirmation Modal */}
      <DeleteRoleModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedRole(null);
        }}
        onConfirm={handleConfirmDelete}
        roleName={selectedRole?.name || ''}
        isLoading={deleteRoleMutation.isPending}
      />

      {/* Create Permission Modal */}
      <PermissionFormModal
        isOpen={isCreatePermissionModalOpen}
        onClose={() => setIsCreatePermissionModalOpen(false)}
      />
    </div>
  );
};
