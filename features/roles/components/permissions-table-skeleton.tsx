import React from 'react';

import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui';

export const PermissionsTableSkeleton = () => {
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
          {Array.from({ length: 3 }).map((__, groupIndex) => (
            <React.Fragment key={`skeleton-group-fragment-${groupIndex + 1}`}>
              {/* Group Header Row Skeleton */}
              <TableRow
                className={`bg-muted/30 border-b border-white/10 ${groupIndex > 0 ? 'border-t-2 border-t-white/10' : ''}`}
              >
                <TableCell className="p-4" colSpan={2}>
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                </TableCell>
                <TableCell className="p-4 text-center">
                  <Skeleton className="mx-auto h-4 w-8" />
                </TableCell>
              </TableRow>

              {/* Permission Rows Skeleton */}
              {Array.from({ length: 4 }).map((___, permIndex) => (
                <TableRow
                  key={`skeleton-perm-${groupIndex + 1}-${permIndex + 1}`}
                  className={`hover:bg-muted/50 border-b border-white/5 transition-colors ${
                    permIndex === 3 ? 'border-b-0' : ''
                  }`}
                >
                  <TableCell className="text-muted-foreground p-4 pl-12 text-sm">
                    <Skeleton className="h-6 w-40 rounded" />
                  </TableCell>
                  <TableCell className="p-4 text-sm">
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell className="p-4 text-center">
                    <Skeleton className="mx-auto h-4 w-4 rounded" />
                  </TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
