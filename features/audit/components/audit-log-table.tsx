/**
 * AuditLogTable Component
 *
 * Table view for audit logs
 */

import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Typography,
} from '@/shared/ui';
import { format } from 'date-fns';
import { Activity } from 'lucide-react';
import { AUDIT_ACTION_COLORS, AUDIT_ACTION_LABELS, AUDIT_STATUS_LABELS } from '../constants';
import type { AuditLog } from '../types';

interface AuditLogTableProps {
  logs: AuditLog[];
  onRowClick: (log: AuditLog) => void;
}

export function AuditLogTable({ logs, onRowClick }: AuditLogTableProps) {
  return (
    <div className="border border-white/10">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 bg-zinc-900">
            <TableHead className="font-mono text-xs text-zinc-400 uppercase">Hành Động</TableHead>
            <TableHead className="font-mono text-xs text-zinc-400 uppercase">
              Người Thực Hiện
            </TableHead>
            <TableHead className="font-mono text-xs text-zinc-400 uppercase">Tài Nguyên</TableHead>
            <TableHead className="font-mono text-xs text-zinc-400 uppercase">Trạng Thái</TableHead>
            <TableHead className="font-mono text-xs text-zinc-400 uppercase">Thời Gian</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow
              key={log.id}
              className="cursor-pointer border-white/10 transition-colors hover:bg-zinc-900"
              onClick={() => onRowClick(log)}
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  <Activity size={14} className={AUDIT_ACTION_COLORS[log.action]} />
                  <Typography variant="small" className="font-mono text-white">
                    {AUDIT_ACTION_LABELS[log.action]}
                  </Typography>
                </div>
              </TableCell>
              <TableCell>
                <Typography variant="small" className="text-white">
                  {log.actor_email}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="tiny" className="text-zinc-600">
                  {log.resource_id.slice(0, 8)}...
                </Typography>
              </TableCell>
              <TableCell>
                <Badge
                  variant={log.status === 'success' ? 'default' : 'destructive'}
                  className="font-mono"
                >
                  {AUDIT_STATUS_LABELS[log.status]}
                </Badge>
              </TableCell>
              <TableCell>
                <Typography variant="small" className="text-zinc-400">
                  {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm')}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
