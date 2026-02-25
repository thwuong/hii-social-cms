'use client';

import { Badge, Button, DataTable, DataTableColumn } from '@/shared/ui';
import { Edit2, Trash2 } from 'lucide-react';
import { Role } from '../types';

interface RolesTableProps {
  roles: Role[];
  isLoading?: boolean;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
}
const columns: (
  onEdit: (role: Role) => void,
  onDelete: (role: Role) => void
) => DataTableColumn<Role>[] = (onEdit, onDelete) => {
  return [
    {
      id: 'name',
      header: 'Tên vai trò',
      accessorFn: (role) => role.name,
      cell: (role) => <span className="font-medium">{role.name}</span>,
      enableSorting: true,
      sortFn: (a, b) => a.name.localeCompare(b.name),
    },
    {
      id: 'slug',
      header: 'Slug',
      accessorFn: (role) => role.slug,
      cell: (role) => (
        <Badge variant="outline" className="font-mono">
          {role.slug}
        </Badge>
      ),
      enableSorting: true,
      sortFn: (a, b) => a.slug.localeCompare(b.slug),
    },
    {
      id: 'description',
      header: 'Mô tả',
      accessorFn: (role) => role.description,
      cell: (role) => <p className="text-muted-foreground max-w-md truncate">{role.description}</p>,
      className: 'max-w-md',
    },
    {
      id: 'permissions',
      header: 'Quyền hạn',
      accessorFn: (role) => role.permissions.length,
      cell: (role) => (
        <Badge variant="secondary" className="font-mono">
          {role.permissions.length} quyền
        </Badge>
      ),
      enableSorting: true,
      sortFn: (a, b) => a.permissions.length - b.permissions.length,
    },
    {
      id: 'created_at',
      header: 'Ngày tạo',
      accessorFn: (role) => new Date(role.created_at).getTime(),
      cell: (role) => (
        <span className="text-muted-foreground font-mono text-sm">
          {new Date(role.created_at).toLocaleDateString('vi-VN')}
        </span>
      ),
      enableSorting: true,
      sortFn: (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    },
    {
      id: 'actions',
      header: 'Hành động',
      headerAlign: 'right',
      cellAlign: 'right',
      cell: (role) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(role);
            }}
            aria-label="Chỉnh sửa"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(role);
            }}
            aria-label="Xóa"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];
};
export const RolesTable = ({ roles, isLoading, onEdit, onDelete }: RolesTableProps) => {
  return (
    <DataTable
      data={roles}
      columns={columns(onEdit, onDelete)}
      getRowId={(role) => role.id}
      isLoading={isLoading}
      emptyMessage="Chưa có vai trò nào"
      stickyHeader={false}
    />
  );
};
