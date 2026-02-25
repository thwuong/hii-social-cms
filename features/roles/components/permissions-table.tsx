'use client';

import { useMemo } from 'react';
import useInfiniteScroll from 'react-infinite-scroll-hook';

import {
  Checkbox,
  Label,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui';

import { usePermissions } from '../hooks/use-permissions';
import { PermissionGroup } from '../types';
import { PermissionsTableSkeleton } from './permissions-table-skeleton';

interface PermissionsTableProps {
  selectedPermissions: string[];
  onPermissionToggle: (permission: string) => void;
  onGroupToggle: (groupPermissions: string[]) => void;
}

export const PermissionsTable = ({
  selectedPermissions,
  onPermissionToggle,
  onGroupToggle,
}: PermissionsTableProps) => {
  const { permissions, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    usePermissions();

  const [sentryRef] = useInfiniteScroll({
    hasNextPage,
    loading: isFetchingNextPage,
    onLoadMore: fetchNextPage,
    rootMargin: '0px 0px 400px 0px',
  });

  const permissionsGroup = useMemo(() => {
    const group: PermissionGroup = {};
    permissions.forEach((permission) => {
      const key = permission.slug.split('.')[0];
      if (!group[key]) {
        group[key] = [];
      }
      group[key].push(permission);
    });
    return group;
  }, [permissions]);

  if (isLoading) {
    return <PermissionsTableSkeleton />;
  }

  return (
    <div className="border border-white/10">
      <Table>
        <TableHeader className="bg-muted/50 sticky! top-0 z-10 backdrop-blur">
          <TableRow className="border-b border-white/10">
            <TableHead className="p-4 text-left text-sm font-medium">Nhóm quyền</TableHead>
            <TableHead className="p-4 text-left text-sm font-medium">Quyền hạn</TableHead>
            <TableHead className="w-20 p-4 text-center text-sm font-medium">Chọn</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(permissionsGroup).map(([groupName, groupPermissions], groupIndex) => {
            const groupPermissionValues = groupPermissions.map((p) => p.slug);
            const allSelected = groupPermissionValues.every((p) =>
              selectedPermissions?.includes(p)
            );
            const someSelected = groupPermissionValues.some((p) =>
              selectedPermissions?.includes(p)
            );

            return (
              <>
                {/* Group Header Row */}
                <TableRow
                  key={`group-${groupName}`}
                  className={`bg-muted/30 border-b border-white/10 ${groupIndex > 0 ? 'border-t-2 border-t-white/10' : ''}`}
                >
                  <TableCell className="p-4" colSpan={2}>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`group-${groupName}`}
                        checked={allSelected}
                        onCheckedChange={() => onGroupToggle(groupPermissionValues)}
                        className={someSelected && !allSelected ? 'opacity-50' : ''}
                      />
                      <Label
                        htmlFor={`group-${groupName}`}
                        className="cursor-pointer font-semibold"
                      >
                        {groupName}
                      </Label>
                    </div>
                  </TableCell>
                  <TableCell className="p-4 text-center">
                    <span className="text-muted-foreground text-xs">
                      {
                        selectedPermissions.filter((p) => groupPermissionValues.includes(p as any))
                          .length
                      }
                      /{groupPermissions.length}
                    </span>
                  </TableCell>
                </TableRow>

                {/* Permission Rows */}
                {groupPermissions.map((permission, permIndex) => (
                  <TableRow
                    key={permission.slug}
                    className={`hover:bg-muted/50 border-b border-white/5 transition-colors ${
                      permIndex === groupPermissions.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <TableCell className="text-muted-foreground p-4 pl-12 text-sm">
                      <code className="bg-muted rounded px-2 py-1 text-xs">{permission.slug}</code>
                    </TableCell>
                    <TableCell className="p-4 text-sm">{permission.name}</TableCell>
                    <TableCell className="p-4 text-center">
                      <Checkbox
                        id={permission.slug}
                        checked={selectedPermissions?.includes(permission.slug)}
                        onCheckedChange={() => onPermissionToggle(permission.slug)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </>
            );
          })}

          {/* Infinite Scroll Sentry */}
          {(hasNextPage || isFetchingNextPage) && (
            <TableRow ref={sentryRef}>
              <TableCell colSpan={3} className="p-4 text-center">
                {isFetchingNextPage && (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                    <span className="text-muted-foreground text-sm">Đang tải thêm...</span>
                  </div>
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
