import { Badge, Typography } from '@/shared/ui';
import { AlertTriangle, Calendar, Check, Clock, MessageSquare, User } from 'lucide-react';
import type { Report } from '../types';
import { ReportStatus } from '../types';
import { formatDate, getReportStatusColor, REPORT_STATUS_LABELS } from '../utils';

interface ReportItemProps {
  report: Report;
  index: number;
  isSelected?: boolean;
  onToggleSelect?: (reportId: string) => void;
}

function ReportItem({ report, index, isSelected, onToggleSelect }: ReportItemProps) {
  const statusColor = getReportStatusColor(report.status as any);
  const isPending = report.status === ReportStatus.PENDING;

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleSelect) {
      onToggleSelect(report.id);
    }
  };

  return (
    <div className="group relative border border-white/10 bg-black/50 p-6 transition-all hover:border-white/20 hover:bg-black/70">
      {/* Top Line Animation */}
      <div className="absolute top-0 left-0 h-[1px] w-full origin-left scale-x-0 transform bg-white transition-transform duration-500 group-hover:scale-x-100" />

      {/* Selection Checkbox - Only for PENDING reports */}
      {isPending && onToggleSelect && (
        <button
          type="button"
          onClick={handleCheckboxClick}
          className="absolute top-3 right-3 z-10 flex h-6 w-6 cursor-pointer items-center justify-center border border-white/20 bg-black/80 backdrop-blur transition-all hover:border-white"
        >
          {isSelected && <Check size={14} className="text-white" />}
        </button>
      )}

      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center border border-white/20 bg-black font-mono text-xs text-white">
            #{index + 1}
          </div>
          <div>
            <Typography variant="small" className="font-mono text-white uppercase">
              Báo Cáo #{report.id.slice(0, 8)}
            </Typography>
          </div>
        </div>

        <Badge variant="outline" className={`font-mono text-xs uppercase ${statusColor}`}>
          {REPORT_STATUS_LABELS[report.status as ReportStatus]}
        </Badge>
      </div>

      {/* Reporter Info */}
      <div className="mb-4 space-y-2 border-l-2 border-white/10 pl-4">
        <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
          <User size={12} className="text-zinc-600" />
          <span className="text-white">{report?.reporter_info?.name || report?.user_reporter}</span>
        </div>

        {/* Reason */}
        <div className="flex items-center gap-2 font-mono text-sm text-zinc-400">
          <AlertTriangle size={12} className="text-red-500" />
          <span>Lý do: </span>
          <Badge variant="destructive" className="font-mono text-xs uppercase">
            {report.reason.description}
          </Badge>
        </div>
      </div>

      {/* Description */}
      {report.description && (
        <div className="mb-4 space-y-2">
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-600 uppercase">
            <MessageSquare size={12} />
            <span>Mô Tả</span>
          </div>
          <div className="border-l-2 border-white/5 pl-4">
            <Typography variant="small" className="whitespace-pre-wrap text-zinc-300">
              {report.description}
            </Typography>
          </div>
        </div>
      )}

      {/* Timestamps */}
      <div className="flex flex-wrap items-center gap-4 border-t border-white/5 pt-4 font-mono text-xs text-zinc-600">
        <div className="flex items-center gap-1.5">
          <Calendar size={10} />
          <span>Tạo: {formatDate(report.created_at)}</span>
        </div>
        {report.updated_at !== report.created_at && (
          <div className="flex items-center gap-1.5">
            <Clock size={10} />
            <span>Cập nhật: {formatDate(report.updated_at)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportItem;
