'use client';

import {
  Button,
  Label,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Textarea,
} from '@/shared/ui';
import FormField from '@/shared/ui/form-field';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateRole, useUpdateRole } from '../hooks';
import { createRoleSchema, CreateRoleSchema } from '../schemas';
import { Role } from '../types';
import { PermissionsTable } from './permissions-table';

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
    control,
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
    <Sheet open={isOpen} onOpenChange={(open) => !isLoading && !open && onClose()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col border-white/10 duration-700 sm:max-w-4xl!"
      >
        <SheetHeader>
          <SheetTitle>{mode === 'create' ? 'Tạo vai trò mới' : 'Chỉnh sửa vai trò'}</SheetTitle>
          <SheetDescription>
            {mode === 'create'
              ? 'Điền thông tin để tạo vai trò mới cho hệ thống'
              : 'Cập nhật thông tin vai trò'}
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col gap-4 overflow-y-auto p-4"
          id="role-form"
        >
          {/* Name */}
          <FormField
            {...register('name')}
            control={control}
            label="Tên vai trò"
            placeholder="Nhập tên vai trò"
            type="text"
          />

          {/* Slug */}
          <FormField
            {...register('slug')}
            control={control}
            label="Slug"
            placeholder="Nhập slug"
            type="text"
            description="Slug chỉ được chứa chữ thường, số và dấu gạch ngang"
          />

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              {...register('description')}
              onChange={(e) => setValue('description', e.target.value)}
              placeholder="Nhập mô tả vai trò"
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-400">{errors.description.message}</p>
            )}
          </div>

          {/* Permissions */}
          <div className="flex flex-1 flex-col gap-2">
            <Label>Quyền hạn</Label>
            <PermissionsTable
              selectedPermissions={selectedPermissions || []}
              onPermissionToggle={handlePermissionToggle}
              onGroupToggle={handleGroupToggle}
            />
            {errors.permissions && (
              <p className="text-sm text-red-400">{errors.permissions.message}</p>
            )}
          </div>
        </form>
        <SheetFooter className="mt-6 shrink-0 flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            Hủy
          </Button>
          <Button type="submit" disabled={isLoading} form="role-form" className="flex-1">
            {isLoading && (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            {mode === 'create' ? 'Tạo vai trò' : 'Cập nhật'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
