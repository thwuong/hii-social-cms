import { Badge, Typography } from '@/shared/ui';
import { AlertTriangle, Clock, User } from 'lucide-react';
import type { ReportStatus, Video } from '../types';
import { formatDate, getReportStatusColor } from '../utils';

interface ReportCardProps {
  report: Video;
  onView: () => void;
}

function ReportCard({ report, onView }: ReportCardProps) {
  const statusColor = getReportStatusColor(report.video_info.status as ReportStatus);

  return (
    <button
      type="button"
      onClick={onView}
      className="group relative cursor-pointer overflow-hidden border border-white/10 bg-black p-6 text-left transition-colors hover:border-white/30 hover:bg-white/5"
    >
      {/* Hover Line */}
      <div className="absolute top-0 left-0 z-20 h-[1px] w-full origin-left scale-x-0 transform bg-white transition-transform duration-500 group-hover:scale-x-100" />

      {/* Video Thumbnail */}
      <div className="relative mb-4 aspect-video overflow-hidden border border-white/5 bg-[#111]">
        <img
          src={report.video_info.thumbnail.url}
          alt={report.video_info.title}
          className="h-full w-full object-cover opacity-70 transition-all duration-500 group-hover:opacity-100"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <AlertTriangle className="h-12 w-12 text-red-500 opacity-75" />
        </div>
      </div>

      {/* Report Info */}
      <div className="space-y-3">
        {/* Video Title */}
        <Typography variant="h4" className="line-clamp-2 text-white">
          {report.video_info.title}
        </Typography>

        {/* Report Count & Status */}
        <div className="flex items-center gap-2">
          <Badge variant="destructive" className="font-mono text-[10px] uppercase">
            {report.report_count} BÁO CÁO
          </Badge>
          <Badge variant="outline" className={`font-mono text-[10px] uppercase ${statusColor}`}>
            {report.video_info.status}
          </Badge>
        </div>

        {/* Latest Reporter Info */}
        <div className="flex items-center gap-2 font-mono text-xs text-zinc-500">
          <User size={12} />
          <span className="flex-1">{report.reports[0].user_reporter}</span>
          {report.report_count > 1 && (
            <span className="text-zinc-600">+{report.report_count - 1} người khác</span>
          )}
        </div>

        {/* Latest Report Time */}
        <div className="flex items-center gap-2 font-mono text-xs text-zinc-500">
          <Clock size={12} />
          <span>Báo cáo mới nhất: {formatDate(report.latest_report)}</span>
        </div>

        {/* Description Preview - Only first report */}
        {report.reports[0].description && (
          <Typography variant="small" className="line-clamp-2 text-zinc-400">
            {report.reports[0].description}
          </Typography>
        )}
      </div>
    </button>
  );
}

export default ReportCard;
