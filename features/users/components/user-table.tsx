import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useMemo } from 'react';

import { Avatar, AvatarFallback, AvatarImage, Badge, Button, Typography } from '@/shared/ui';
import { DataTable, DataTableColumn } from '@/shared/ui/data-table';

import { User } from '../types';

const getInitials = (username: string) => {
  return username?.slice(0, 2).toUpperCase();
};

function UserIdCell({ id }: { id: string }) {
  return <Typography variant="tiny">{id}</Typography>;
}

function UserCell({ user }: { user: User }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-8 w-8 rounded-none border border-white/10">
        <AvatarImage src={user.avatar} />
        <AvatarFallback className="rounded-none bg-zinc-900 font-mono text-xs">
          {getInitials(user.firstName + user.lastName)}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <Typography variant="small" className="font-bold">
          {user.firstName} {user.lastName}
        </Typography>
        <Typography variant="small" className="text-zinc-500">
          {user.email}
        </Typography>
      </div>
    </div>
  );
}

function RoleCell({ user }: { user: User }) {
  return (
    <Badge
      variant={user.role?.name === 'admin' ? 'default' : 'secondary'}
      className={user.role?.name === 'admin' ? 'bg-green-500/10 text-green-500' : ''}
    >
      {user.role?.name || 'Chưa có vai trò'}
    </Badge>
  );
}

function CreatedAtCell({ user }: { user: User }) {
  return (
    <span className="font-mono text-xs text-zinc-400">
      {format(new Date(user.createdAt), 'dd/MM/yyyy', { locale: vi })}
    </span>
  );
}

function ActionsCell({ user, onManageRoles }: { user: User; onManageRoles: (user: User) => void }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={(e) => {
        e.stopPropagation();
        onManageRoles(user);
      }}
      className="font-mono text-xs tracking-wider text-zinc-400 uppercase hover:bg-white/10 hover:text-white"
    >
      Cập nhật
    </Button>
  );
}

const getColumns = (onManageRoles: (user: User) => void): DataTableColumn<User>[] => [
  {
    id: 'userId',
    header: 'ID Người dùng',
    className: 'w-[260px]',
    enableSorting: true,
    accessorFn: (user) => user.id,
    cell: (user) => <UserIdCell id={user.id} />,
  },
  {
    id: 'user',
    header: 'Người dùng',
    className: 'w-[300px]',
    enableSorting: true,
    sortFn: (a, b) => {
      const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
      const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
      return nameA.localeCompare(nameB);
    },
    cell: (user) => <UserCell user={user} />,
  },
  {
    id: 'role',
    header: 'Vai trò',
    enableSorting: true,
    accessorFn: (user) => user.role?.name || '',
    cell: (user) => <RoleCell user={user} />,
  },
  {
    id: 'createdAt',
    header: 'Ngày tạo',
    enableSorting: true,
    accessorFn: (user) => user.createdAt,
    cell: (user) => <CreatedAtCell user={user} />,
  },
  {
    id: 'actions',
    header: 'Thao tác',
    headerAlign: 'right',
    cellAlign: 'right',
    cell: (user) => <ActionsCell user={user} onManageRoles={onManageRoles} />,
  },
];

interface UserTableProps {
  users: User[];
  onManageRoles: (user: User) => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  loadMoreRef?: React.Ref<HTMLDivElement>;
}

export const UserTable = ({
  users,
  onManageRoles,
  hasNextPage,
  isFetchingNextPage,
  loadMoreRef,
}: UserTableProps) => {
  const columns = useMemo(() => getColumns(onManageRoles), [onManageRoles]);

  return (
    <DataTable
      data={users}
      columns={columns}
      getRowId={(row) => row.id}
      stickyHeader
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      loadMoreRef={loadMoreRef}
    />
  );
};
