'use client';

import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Textarea,
} from '@/shared/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { PERMISSION_GROUPS } from '../constants';
import { useCreateRole, useUpdateRole } from '../hooks';
import { createRoleSchema, CreateRoleSchema } from '../schemas';
import { Role } from '../types';

interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  role?: Role | null;
}

export const RoleFormModal = ({ isOpen, onClose, mode, role }: RoleFormModalProps) => {
  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CreateRoleSchema>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      permissions: [],
    },
  });

  const selectedPermissions = watch('permissions');

  // Load role data when editing
  useEffect(() => {
    if (mode === 'edit' && role) {
      reset({
        name: role.name,
        slug: role.slug,
        description: role.description,
        permissions: role.permissions,
      });
    } else {
      reset({
        name: '',
        slug: '',
        description: '',
        permissions: [],
      });
    }
  }, [mode, role, reset]);

  const onSubmit = (data: CreateRoleSchema) => {
    if (mode === 'create') {
      createRoleMutation.mutate(data, {
        onSuccess: () => {
          reset();
          onClose();
        },
      });
    } else if (mode === 'edit' && role) {
      updateRoleMutation.mutate(
        { id: role.id, payload: data },
        {
          onSuccess: () => {
            reset();
            onClose();
          },
        }
      );
    }
  };

  const handlePermissionToggle = (permission: string) => {
    const current = selectedPermissions || [];
    const updated = current.includes(permission)
      ? current.filter((p) => p !== permission)
      : [...current, permission];
    setValue('permissions', updated);
  };

  const handleGroupToggle = (groupPermissions: string[]) => {
    const current = selectedPermissions || [];
    const allSelected = groupPermissions.every((p) => current.includes(p));

    if (allSelected) {
      // Deselect all in group
      setValue(
        'permissions',
        current.filter((p) => !groupPermissions.includes(p))
      );
    } else {
      // Select all in group
      const newPermissions = [...new Set([...current, ...groupPermissions])];
      setValue('permissions', newPermissions);
    }
  };

  const isLoading = createRoleMutation.isPending || updateRoleMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isLoading && !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Tạo vai trò mới' : 'Chỉnh sửa vai trò'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Tên vai trò</Label>
              <Input id="name" {...register('name')} placeholder="Nhập tên vai trò" />
              {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" {...register('slug')} placeholder="vi-du: admin, editor" />
              {errors.slug && <p className="text-sm text-red-600">{errors.slug.message}</p>}
              <p className="text-sm text-gray-500">
                Slug chỉ được chứa chữ thường, số và dấu gạch ngang
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Nhập mô tả vai trò"
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Permissions */}
            <div className="space-y-2">
              <Label>Quyền hạn</Label>
              <div className="max-h-96 space-y-4 overflow-y-auto rounded-md border p-4">
                {PERMISSION_GROUPS.map((group) => {
                  const groupPermissionValues = group.permissions.map((p) => p.value);
                  const allSelected = groupPermissionValues.every((p) =>
                    selectedPermissions?.includes(p)
                  );

                  return (
                    <div key={group.label} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`group-${group.label}`}
                          checked={allSelected}
                          onCheckedChange={() => handleGroupToggle(groupPermissionValues)}
                        />
                        <Label
                          htmlFor={`group-${group.label}`}
                          className="cursor-pointer font-semibold"
                        >
                          {group.label}
                        </Label>
                      </div>
                      <div className="ml-6 space-y-2">
                        {group.permissions.map((permission) => (
                          <div key={permission.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={permission.value}
                              checked={selectedPermissions?.includes(permission.value)}
                              onCheckedChange={() => handlePermissionToggle(permission.value)}
                            />
                            <Label htmlFor={permission.value} className="cursor-pointer">
                              {permission.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              {errors.permissions && (
                <p className="text-sm text-red-600">{errors.permissions.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && (
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
              {mode === 'create' ? 'Tạo vai trò' : 'Cập nhật'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
