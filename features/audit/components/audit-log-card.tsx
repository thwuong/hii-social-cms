/**
 * AuditLogCard Component
 *
 * Card view for individual audit log
 */

import { Badge, Card, CardContent, Typography } from '@/shared/ui';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Activity, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { AUDIT_ACTION_COLORS, AUDIT_ACTION_LABELS, RESOURCE_TYPE_LABELS } from '../constants';
import { AuditLog, AuditStatus } from '../types';

interface AuditLogCardProps {
  log: AuditLog;
  onView: () => void;
}

export function AuditLogCard({ log, onView }: AuditLogCardProps) {
  const statusIcon = {
    [AuditStatus.SUCCESS]: <CheckCircle size={16} className="text-green-500" />,
    [AuditStatus.FAILED]: <AlertCircle size={16} className="text-red-500" />,
    [AuditStatus.PENDING]: <Clock size={16} className="text-yellow-500" />,
  };

  return (
    <Card
      className="group cursor-pointer border-white/10 bg-zinc-900 transition-all hover:border-white/30"
      onClick={onView}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Activity size={16} className={AUDIT_ACTION_COLORS[log.action]} />
            <Typography variant="small" className="font-mono text-white uppercase">
              {AUDIT_ACTION_LABELS[log.action]}
            </Typography>
          </div>
          {statusIcon[log.status]}
        </div>

        {/* Actor Info */}
        <div className="mb-3 space-y-1">
          <Typography variant="small" className="text-zinc-400">
            {log.actor_email}
          </Typography>
        </div>

        {/* Resource Info */}
        <div className="mb-3 flex items-center gap-2">
          <Badge variant="outline" className="border-white/20 text-zinc-400">
            {RESOURCE_TYPE_LABELS[log.resource_type]}
          </Badge>
          <Typography variant="tiny" className="text-zinc-600">
            ID: {log.resource_id.slice(0, 8)}...
          </Typography>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/10 pt-3">
          <Typography variant="tiny" className="text-zinc-600">
            {formatDistanceToNow(new Date(log.created_at), {
              addSuffix: true,
              locale: vi,
            })}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
}
