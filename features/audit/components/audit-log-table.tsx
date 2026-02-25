import { Badge, DataTable, type DataTableColumn, Typography } from '@/shared/ui';
import { format } from 'date-fns';
import { Activity } from 'lucide-react';
import { AUDIT_ACTION_COLORS, AUDIT_ACTION_LABELS, AUDIT_STATUS_LABELS } from '../constants';
import type { AuditLog } from '../types';

interface AuditLogTableProps {
  logs: AuditLog[];
  onRowClick: (log: AuditLog) => void;
  isLoading?: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  loadMoreRef?: React.Ref<HTMLDivElement>;
}
const columns: DataTableColumn<AuditLog>[] = [
  {
    id: 'action',
    header: 'Hành Động',
    enableSorting: true,
    accessorFn: (log) => AUDIT_ACTION_LABELS[log.action],
    cell: (log) => (
      <div className="flex items-center gap-2">
        <Activity size={14} className={AUDIT_ACTION_COLORS[log.action]} />
        <Typography variant="small" className="font-mono text-white">
          {AUDIT_ACTION_LABELS[log.action]}
        </Typography>
      </div>
    ),
  },
  {
    id: 'actor',
    header: 'Người Thực Hiện',
    enableSorting: true,
    accessorFn: (log) => log.actor_email,
    cell: (log) => (
      <Typography variant="small" className="text-white">
        {log.actor_email}
      </Typography>
    ),
  },
  {
    id: 'resource',
    header: 'Tài Nguyên',
    accessorFn: (log) => log.resources.map((resource) => resource.title).join(', '),
    cell: (log) => (
      <Typography
        variant="small"
        className="line-clamp-1 max-w-[300px] text-ellipsis text-zinc-600"
      >
        {log.resources.map((resource) => resource.title).join(', ')}
      </Typography>
    ),
  },
  {
    id: 'status',
    header: 'Trạng Thái',
    enableSorting: true,
    accessorFn: (log) => AUDIT_STATUS_LABELS[log.status],
    cell: (log) => (
      <Badge variant={log.status === 'success' ? 'success' : 'destructive'} className="font-mono">
        {AUDIT_STATUS_LABELS[log.status]}
      </Badge>
    ),
  },
  {
    id: 'created_at',
    header: 'Thời Gian',
    enableSorting: true,
    accessorFn: (log) => log.created_at,
    cell: (log) => (
      <Typography variant="small" className="text-zinc-400">
        {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm')}
      </Typography>
    ),
  },
];

export function AuditLogTable({
  logs,
  onRowClick,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  loadMoreRef,
}: AuditLogTableProps) {
  return (
    <DataTable
      data={logs}
      columns={columns}
      onRowClick={onRowClick}
      isLoading={isLoading}
      getRowId={(row) => row.id}
      stickyHeader
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      loadMoreRef={loadMoreRef}
    />
  );
}
