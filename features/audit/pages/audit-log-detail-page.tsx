/**
 * Audit Log Detail Page
 *
 * Detail view for a single audit log entry
 */

import { Badge, Button, Card, CardContent, Typography } from '@/shared/ui';
import { useNavigate, useParams } from '@tanstack/react-router';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Activity, AlertCircle, ArrowLeft, CheckCircle, Clock, User } from 'lucide-react';
import { AUDIT_ACTION_COLORS, AUDIT_ACTION_LABELS, RESOURCE_TYPE_LABELS } from '../constants';
import { useAuditLogDetail } from '../hooks';
import { AuditStatus } from '../types';

function AuditLogDetailPage() {
  const navigate = useNavigate();
  const { logId } = useParams({ strict: false });
  const { data: log, isLoading } = useAuditLogDetail(logId as string);

  const statusIcon = {
    [AuditStatus.SUCCESS]: <CheckCircle size={20} className="text-green-500" />,
    [AuditStatus.FAILED]: <AlertCircle size={20} className="text-red-500" />,
    [AuditStatus.PENDING]: <Clock size={20} className="text-yellow-500" />,
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Typography variant="p" className="font-mono text-zinc-500">
          ĐANG TẢI...
        </Typography>
      </div>
    );
  }

  if (!log) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <AlertCircle size={48} className="text-zinc-600" />
        <Typography variant="h3" className="text-zinc-500">
          KHÔNG TÌM THẤY LOG
        </Typography>
        <Button
          variant="outline"
          onClick={() => navigate({ to: '/audit' })}
          className="border-white/20 font-mono"
        >
          <ArrowLeft size={14} className="mr-2" />
          QUAY LẠI
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col space-y-6 p-4 sm:p-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate({ to: '/audit' })}
            className="text-zinc-400 hover:text-white"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <Typography variant="h2" className="text-white">
              CHI TIẾT LOG
            </Typography>
            <Typography variant="small" className="font-mono text-zinc-600">
              ID: {log.id}
            </Typography>
          </div>
        </div>
        {statusIcon[log.status]}
      </div>

      {/* Main Info */}
      <Card className="border-white/10 bg-zinc-900">
        <CardContent className="space-y-6 p-6">
          {/* Action */}
          <div className="flex items-center gap-3">
            <Activity size={20} className={AUDIT_ACTION_COLORS[log.action]} />
            <div>
              <Typography variant="tiny" className="text-zinc-600">
                HÀNH ĐỘNG
              </Typography>
              <Typography variant="p" className="font-mono text-white uppercase">
                {AUDIT_ACTION_LABELS[log.action]}
              </Typography>
            </div>
          </div>

          {/* Resource */}
          <div className="border-t border-white/10 pt-6">
            <Typography variant="tiny" className="mb-2 text-zinc-600">
              TÀI NGUYÊN
            </Typography>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-white/20 text-zinc-400">
                {RESOURCE_TYPE_LABELS[log.resource_type]}
              </Badge>
              <Typography variant="small" className="font-mono text-zinc-500">
                {log.resource_id}
              </Typography>
            </div>
          </div>

          {/* Actor */}
          <div className="border-t border-white/10 pt-6">
            <Typography variant="tiny" className="mb-3 text-zinc-600">
              NGƯỜI THỰC HIỆN
            </Typography>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-zinc-800">
                <User size={16} className="text-zinc-400" />
              </div>
              <div>
                <Typography variant="p" className="text-white">
                  {log.actor_name}
                </Typography>
                <Typography variant="small" className="text-zinc-600">
                  {log.actor_email}
                </Typography>
              </div>
            </div>
          </div>

          {/* Timestamp */}
          <div className="border-t border-white/10 pt-6">
            <Typography variant="tiny" className="mb-2 text-zinc-600">
              THỜI GIAN
            </Typography>
            <Typography variant="p" className="text-white">
              {format(new Date(log.created_at), 'dd MMMM yyyy, HH:mm:ss', { locale: vi })}
            </Typography>
          </div>

          {/* IP & User Agent */}
          <div className="grid gap-6 border-t border-white/10 pt-6 md:grid-cols-2">
            <div>
              <Typography variant="tiny" className="mb-2 text-zinc-600">
                ĐỊA CHỈ IP
              </Typography>
              <Typography variant="small" className="font-mono text-zinc-400">
                {log.ip_address}
              </Typography>
            </div>
            <div>
              <Typography variant="tiny" className="mb-2 text-zinc-600">
                USER AGENT
              </Typography>
              <Typography variant="small" className="font-mono text-zinc-400">
                {log.user_agent}
              </Typography>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Changes */}
      {log.changes && (
        <Card className="border-white/10 bg-zinc-900">
          <CardContent className="space-y-4 p-6">
            <Typography variant="h4" className="text-white">
              THAY ĐỔI
            </Typography>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Before */}
              <div>
                <Typography variant="small" className="mb-3 font-mono text-zinc-600">
                  TRƯỚC
                </Typography>
                <pre className="overflow-auto rounded border border-white/10 bg-black p-4 text-xs text-zinc-400">
                  {JSON.stringify(log.changes.before, null, 2)}
                </pre>
              </div>

              {/* After */}
              <div>
                <Typography variant="small" className="mb-3 font-mono text-zinc-600">
                  SAU
                </Typography>
                <pre className="overflow-auto rounded border border-white/10 bg-black p-4 text-xs text-zinc-400">
                  {JSON.stringify(log.changes.after, null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      {log.metadata && Object.keys(log.metadata).length > 0 && (
        <Card className="border-white/10 bg-zinc-900">
          <CardContent className="p-6">
            <Typography variant="h4" className="mb-4 text-white">
              METADATA
            </Typography>
            <pre className="overflow-auto rounded border border-white/10 bg-black p-4 text-xs text-zinc-400">
              {JSON.stringify(log.metadata, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {log.error_message && (
        <Card className="border-red-500/20 bg-red-950/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="mt-1 text-red-500" />
              <div>
                <Typography variant="small" className="mb-2 font-mono text-red-400">
                  LỖI
                </Typography>
                <Typography variant="p" className="text-red-300">
                  {log.error_message}
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default AuditLogDetailPage;
