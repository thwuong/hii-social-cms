import { Badge, Button, Typography } from '@/shared/ui';
import { VideoPlayer } from '@/shared/components';
import { useNavigate, useParams } from '@tanstack/react-router';
import { AlertTriangle, Check, MessageSquare, Video, X, XCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { RejectConfirmationModal } from '@/features/content/components';
import { AcceptConfirmationModal, ReportItem } from '../components';
import { useAcceptReport, useRejectReport, useReportDetail } from '../hooks/useReport';
import { ReportStatus } from '../types';
import { formatDate, getReportStatusColor } from '../utils';

function ReportDetailPage() {
  const { reportId } = useParams({ strict: false });
  const navigate = useNavigate();
  const { data: report, isLoading } = useReportDetail(reportId as string);

  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedVideoIds, setSelectedVideoIds] = useState<string[]>([]);

  const { mutate: acceptReport, isPending: isAccepting } = useAcceptReport();
  const { mutate: rejectReport, isPending: isRejecting } = useRejectReport();

  // Get pending reports only (for selection)
  const pendingReports = report?.reports.filter((r) => r.status === ReportStatus.PENDING) || [];

  const hasPendingReports = pendingReports.length > 0;

  // Toggle single report selection
  const handleToggleSelect = (videoId: string) => {
    setSelectedVideoIds((prev) =>
      prev.includes(videoId) ? prev.filter((id) => id !== videoId) : [...prev, videoId]
    );
  };

  // Toggle all pending reports
  const handleSelectAll = () => {
    if (selectedVideoIds.length === pendingReports.length) {
      setSelectedVideoIds([]);
    } else {
      setSelectedVideoIds(pendingReports.map((r) => r.video_id));
    }
  };

  const allSelected =
    pendingReports.length > 0 && selectedVideoIds.length === pendingReports.length;

  const handleAccept = () => {
    if (!report) return;

    // If no selection, accept all pending reports
    const videoIds =
      selectedVideoIds.length > 0 ? selectedVideoIds : pendingReports.map((r) => r.video_id);

    if (videoIds.length === 0) {
      toast.error('Không có báo cáo nào để xử lý');
      return;
    }

    const toastId = toast.loading(`Đang xử lý ${videoIds.length} báo cáo...`);

    acceptReport(
      {
        is_hidden: true,
        video_ids: videoIds,
      },
      {
        onSuccess: () => {
          toast.dismiss(toastId);
          toast.success('CHẤP NHẬN THÀNH CÔNG', {
            description: `${videoIds.length} video đã được ẩn khỏi hệ thống`,
          });
          setIsAcceptModalOpen(false);
          setSelectedVideoIds([]);
          navigate({ to: '/report' });
        },
        onError: () => {
          toast.dismiss(toastId);
          toast.error('CHẤP NHẬN THẤT BẠI', {
            description: 'Không thể xử lý báo cáo. Vui lòng thử lại.',
          });
        },
      }
    );
  };

  const handleReject = (_reason: string) => {
    if (!report) return;

    // If no selection, reject all pending reports
    const videoIds =
      selectedVideoIds.length > 0 ? selectedVideoIds : pendingReports.map((r) => r.video_id);

    if (videoIds.length === 0) {
      toast.error('Không có báo cáo nào để xử lý');
      return;
    }

    const toastId = toast.loading(`Đang xử lý ${videoIds.length} báo cáo...`);

    rejectReport(
      {
        is_hidden: false,
        video_ids: videoIds,
      },
      {
        onSuccess: () => {
          toast.dismiss(toastId);
          toast.success('TỪ CHỐI THÀNH CÔNG', {
            description: `${videoIds.length} video vẫn hiển thị bình thường`,
          });
          setIsRejectModalOpen(false);
          setSelectedVideoIds([]);
          navigate({ to: '/report' });
        },
        onError: () => {
          toast.dismiss(toastId);
          toast.error('TỪ CHỐI THẤT BẠI', {
            description: 'Không thể xử lý báo cáo. Vui lòng thử lại.',
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex items-center gap-2 font-mono text-sm text-zinc-500">
          <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
          <span>ĐANG TẢI...</span>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <AlertTriangle size={48} className="mb-4 text-zinc-600" />
        <Typography variant="h3" className="text-zinc-500">
          KHÔNG TÌM THẤY BÁO CÁO
        </Typography>
        <Button variant="link" onClick={() => navigate({ to: '/report' })}>
          QUAY LẠI DANH SÁCH
        </Button>
      </div>
    );
  }

  const statusColor = getReportStatusColor(report.video_info.status as ReportStatus);
  const reportCount = report.reports?.length || 0;

  return (
    <div className="animate-in fade-in grid w-full grid-cols-1 gap-6 duration-300 md:grid-cols-2">
      {/* Header */}
      <div className="col-span-2 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-8 w-8 text-red-500" />
          <div>
            <Typography variant="h2" className="text-white">
              CHI TIẾT VIDEO BỊ BÁO CÁO
            </Typography>
            <Typography variant="small" className="text-muted-foreground font-mono">
              Video ID: {report.video_info.id}
            </Typography>
          </div>
        </div>

        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/report' })}
          className="text-zinc-500 hover:text-white"
        >
          <X size={20} />
        </Button>
      </div>
      {/* LEFT: Video Preview */}
      <aside className="queue-sidebar">
        <div className="flex h-full flex-col">
          <Typography variant="tiny" className="mb-4 font-mono text-zinc-500 uppercase">
            <Video size={12} className="mr-2 inline" />
            VIDEO BỊ BÁO CÁO
          </Typography>

          {/* Video Player */}
          {report.video_info.media && report.video_info.media.length > 0 ? (
            <VideoPlayer
              url={report.video_info.media[0].url}
              poster={report.video_info.thumbnail?.url}
              title={report.video_info.title}
              aspectRatio="9/16"
              className="mb-4"
            />
          ) : (
            <div className="relative mb-4 aspect-[9/16] overflow-hidden border border-white/10 bg-black">
              <div className="flex h-full items-center justify-center">
                <AlertTriangle className="h-12 w-12 text-zinc-600" />
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* CENTER: Report Details */}
      <section className="relative overflow-y-auto p-8">
        <div className="space-y-6">
          {/* Video Status */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={`font-mono text-sm uppercase ${statusColor}`}>
              {report.video_info.status}
            </Badge>
            <Badge variant="destructive" className="font-mono text-sm">
              <MessageSquare size={12} className="mr-1" />
              {reportCount} Báo Cáo
            </Badge>
          </div>

          {/* Video Information */}
          <div className="space-y-3 border-t border-white/10 pt-6">
            <Typography variant="tiny" className="font-mono text-zinc-500 uppercase">
              THÔNG TIN VIDEO
            </Typography>
            <div className="space-y-2 border border-white/10 bg-black/50 p-4">
              <div className="font-mono text-sm text-white">{report.video_info.title}</div>
              {report.video_info.description && (
                <div className="font-mono text-xs text-zinc-400">
                  {report.video_info.description}
                </div>
              )}
              <div className="flex items-center gap-4 pt-2 font-mono text-xs text-zinc-600">
                <span>Tạo: {formatDate(report.video_info.created_at)}</span>
                <span>•</span>
                <span>Owner: {report.video_info.owner_id}</span>
              </div>
            </div>
          </div>

          {/* All Reports Section */}
          <div className="space-y-4 border-t border-white/10 pt-6">
            <div className="flex items-center justify-between">
              <Typography variant="tiny" className="font-mono text-zinc-500 uppercase">
                <MessageSquare size={12} className="mr-2 inline" />
                DANH SÁCH BÁO CÁO ({reportCount})
              </Typography>

              {/* Select All Checkbox - Only if has pending reports */}
              {hasPendingReports && (
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="flex items-center gap-2 font-mono text-xs text-zinc-400 transition-colors hover:text-white"
                >
                  <div
                    className={`flex h-5 w-5 items-center justify-center border transition-all ${
                      allSelected
                        ? 'border-white bg-white'
                        : 'border-white/20 bg-transparent hover:border-white'
                    }`}
                  >
                    {allSelected && <Check size={12} className="text-black" />}
                  </div>
                  <span className="uppercase">
                    {allSelected ? 'Bỏ Chọn Tất Cả' : 'Chọn Tất Cả'}
                  </span>
                </button>
              )}
            </div>

            <div className="space-y-3">
              {report.reports && report.reports.length > 0 ? (
                report.reports.map((reportItem, index) => (
                  <ReportItem
                    key={reportItem.id}
                    report={reportItem}
                    index={index}
                    isSelected={selectedVideoIds.includes(reportItem.id)}
                    onToggleSelect={handleToggleSelect}
                  />
                ))
              ) : (
                <div className="border border-white/10 bg-black/50 p-8 text-center">
                  <Typography variant="small" className="text-zinc-500">
                    Không có báo cáo
                  </Typography>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {hasPendingReports && (
            <div className="actions sticky bottom-0 border-t border-white/10 bg-black/95 pt-6 backdrop-blur">
              <Button
                variant="default"
                onClick={() => setIsAcceptModalOpen(true)}
                disabled={isAccepting || isRejecting}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                <Check size={16} className="mr-2" />
                CHẤP NHẬN - ẨN VIDEO
                {selectedVideoIds.length > 0 && ` (${selectedVideoIds.length})`}
              </Button>
              <Button
                variant="destructive"
                onClick={() => setIsRejectModalOpen(true)}
                disabled={isAccepting || isRejecting}
              >
                <XCircle size={16} className="mr-2" />
                TỪ CHỐI BÁO CÁO
                {selectedVideoIds.length > 0 && ` (${selectedVideoIds.length})`}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Modals */}
      <AcceptConfirmationModal
        isOpen={isAcceptModalOpen}
        onClose={() => setIsAcceptModalOpen(false)}
        onConfirm={handleAccept}
        count={selectedVideoIds.length > 0 ? selectedVideoIds.length : pendingReports.length}
      />

      <RejectConfirmationModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleReject}
      />
    </div>
  );
}

export default ReportDetailPage;
