import { createRoute } from '@tanstack/react-router';
import { AlertTriangle, FileText, Globe, ListVideo, X } from 'lucide-react';
import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Textarea,
} from '@/shared/ui/primitives';
import { ContentStatus, MediaType } from '@/shared/types';
import { STATUS_LABELS } from '@/shared';
import { rootRoute } from './root-layout';

// Modal components từ App.tsx
function RejectConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError('Vui lòng nhập lý do từ chối.');
      return;
    }
    onConfirm(reason);
    setReason('');
    setError('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle size={20} /> Xác Nhận Từ Chối
        </DialogTitle>
      </DialogHeader>
      <div className="py-4 space-y-4">
        <p className="text-sm font-mono text-muted-foreground">
          Hành động này sẽ chuyển trạng thái bài viết về &ldquo;Từ Chối&rdquo; và yêu cầu chỉnh sửa.
        </p>
        <div className="space-y-2">
          <label htmlFor="reject-reason" className="text-xs font-mono uppercase font-medium">
            Lý do từ chối
          </label>
          <Textarea
            id="reject-reason"
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError('');
            }}
            placeholder="Nhập lý do chi tiết..."
            className="h-24 font-mono text-sm"
          />
          {error && <p className="text-destructive text-xs font-mono">{error}</p>}
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Hủy Bỏ
        </Button>
        <Button variant="destructive" onClick={handleSubmit}>
          Xác Nhận Từ Chối
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

function ActivityLogModal({ item, isOpen, onClose, service }: any) {
  const logs = service.getAuditLogs().filter((log: any) => log.content_id === item.content_id);
  const sortedLogs = [...logs].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogHeader>
        <DialogTitle>NHẬT_KÝ_HỆ_THỐNG :: {item.content_id}</DialogTitle>
      </DialogHeader>
      <div className="max-h-[60vh] overflow-y-auto space-y-0 py-4 border-t border-b border-white/10 my-4">
        <div className="flex gap-4 py-3 border-l-2 border-primary pl-4 relative">
          <div className="flex-1">
            <div className="text-xs font-mono font-bold text-white uppercase">KHỞI_TẠO</div>
            <div className="text-[10px] font-mono text-zinc-500">
              {new Date(item.created_at).toLocaleString('vi-VN')}
            </div>
          </div>
          <div className="flex-1 text-right">
            <div className="text-xs font-mono text-zinc-400">USER: {item.created_by}</div>
          </div>
        </div>

        {sortedLogs.map((log) => (
          <div
            key={log.id}
            className={`flex gap-4 py-3 border-l-2 pl-4 relative ${
              log.new_status === ContentStatus.REJECTED ? 'border-destructive' : 'border-white/20'
            }`}
          >
            <div className="flex-1">
              <div className="text-xs font-mono font-bold text-white uppercase">{log.action}</div>
              <div className="text-[10px] font-mono text-zinc-500">
                {new Date(log.timestamp).toLocaleString('vi-VN')}
              </div>
            </div>
            <div className="flex-1 text-right">
              <div className="text-xs font-mono text-zinc-400">USER: {log.user}</div>
            </div>
          </div>
        ))}
      </div>
      <DialogFooter>
        <Button onClick={onClose} className="w-full">
          ĐÓNG CỬA SỔ
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

export const detailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/detail/$contentId',
  component: DetailPage,
});

function DetailPage() {
  const { contentId } = detailRoute.useParams();
  const navigate = detailRoute.useNavigate();
  const { items, service, currentUser, refreshData } = detailRoute.useRouteContext();

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [pendingRejectId, setPendingRejectId] = useState<string | null>(null);

  const item = items.find((i: any) => i.content_id === contentId);

  const handleUpdateStatus = (id: string, nextStatus: ContentStatus) => {
    if (nextStatus === ContentStatus.REJECTED) {
      setPendingRejectId(id);
      setIsRejectModalOpen(true);
    } else {
      service.updateContent(id, { status: nextStatus }, currentUser.name);
      refreshData();
    }
  };

  const handleConfirmReject = (reason: string) => {
    if (pendingRejectId) {
      service.updateContent(
        pendingRejectId,
        {
          status: ContentStatus.REJECTED,
          moderation_notes: reason,
        },
        currentUser.name
      );
      refreshData();
    }
    setIsRejectModalOpen(false);
    setPendingRejectId(null);
  };

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-500 font-mono uppercase">
        <AlertTriangle size={48} className="mb-4 opacity-50" />
        <p className="font-semibold">KHÔNG TÌM THẤY TÀI NGUYÊN</p>
        <Button variant="link" onClick={() => navigate({ to: '/content' })}>
          QUAY LẠI DANH SÁCH
        </Button>
      </div>
    );
  }

  const isEditable = item.status === ContentStatus.DRAFT || currentUser.role === 'ADMIN';
  const queueItems = items.filter((i: any) => i.status === item.status);

  const workflowSteps = [
    { id: ContentStatus.DRAFT, label: 'K.TẠO' },
    { id: ContentStatus.PENDING_REVIEW, label: 'DUYỆT' },
    { id: ContentStatus.APPROVED, label: 'XONG' },
    { id: ContentStatus.SCHEDULED, label: 'CHỜ' },
    { id: ContentStatus.PUBLISHED, label: 'ĐĂNG' },
  ];

  const currentStepIndex = workflowSteps.findIndex((s) => s.id === item.status);
  const isRejected = item.status === ContentStatus.REJECTED;
  const isArchived = item.status === ContentStatus.ARCHIVED;

  let activeIndex = currentStepIndex;
  if (isRejected) activeIndex = 1;
  if (isArchived) activeIndex = 5;

  return (
    <div className="detail-layout animate-in fade-in duration-300">
      {/* LEFT: QUEUE SIDEBAR */}
      <aside className="queue-sidebar">
        <div className="queue-header flex items-center gap-2">
          <ListVideo size={12} />
          <span>HÀNG ĐỢI // {STATUS_LABELS[item.status as ContentStatus]}</span>
          <span className="ml-auto opacity-50">{queueItems.length}</span>
        </div>
        <div className="queue-list custom-scrollbar">
          {queueItems.map((qItem: any) => (
            <div
              key={qItem.content_id}
              className={`queue-item ${qItem.content_id === item.content_id ? 'active' : ''}`}
              onClick={() =>
                navigate({
                  to: '/detail/$contentId',
                  params: { contentId: qItem.content_id },
                })
              }
            >
              <img
                src={`https://picsum.photos/seed/${qItem.content_id}/200/300`}
                className="queue-thumb"
                alt="thumb"
              />
              <div className="queue-info">
                <div className="font-bold text-[11px] text-white line-clamp-2 leading-tight">
                  {qItem.title}
                </div>
                <div className="font-mono text-[9px] text-zinc-500">{qItem.content_id}</div>
                <div className="font-mono text-[9px] text-zinc-600 mt-1 uppercase">
                  {qItem.category}
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* CENTER: VIEWPORT SECTION */}
      <section className="viewport-container group">
        <div className="shutter-frame">
          <div className="shutter-blade shutter-top" />
          <div className="shutter-blade shutter-bottom" />

          {/* UI Overlay */}
          <div className="ui-overlay">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00ff66] shadow-[0_0_10px_#00ff66] animate-pulse" />{' '}
                GHI
              </span>
              <span>{new Date().toLocaleTimeString()}</span>
            </div>
            <div className="scanline" />
            <div className="text-right">
              <span>
                {item.media_type.toUpperCase()} {/* HD */}
              </span>
              <br />
              <span>BITRATE: 45MBPS</span>
            </div>
          </div>

          {/* Media Content */}
          {item.media_type === MediaType.VIDEO ? (
            <img
              src={`https://picsum.photos/seed/${item.content_id}/450/800`}
              className="video-mock"
              alt="Preview"
            />
          ) : (
            <div className="video-mock bg-zinc-900 flex items-center justify-center">
              <FileText size={64} className="text-zinc-600" />
            </div>
          )}
        </div>

        {/* Close Button */}
        <Button
          variant="ghost"
          className="absolute top-4 right-4 z-40 text-zinc-500 hover:text-white"
          onClick={() => navigate({ to: '/content' })}
        >
          <X size={20} />
        </Button>
      </section>

      {/* RIGHT: INSPECTOR SECTION */}
      <aside className="inspector">
        {/* DESCRIPTION */}
        <div className="meta-group">
          <span className="label">NHẬT_KÝ_PHIÊN_DỊCH</span>
          {isEditable ? (
            <Textarea
              value={item.short_description}
              onChange={(e) => {
                service.updateContent(
                  item.content_id,
                  { short_description: e.target.value },
                  currentUser.name
                );
                refreshData();
              }}
              className="readout bg-transparent border border-white/10 p-2 h-32 resize-none focus:border-white transition-colors"
            />
          ) : (
            <p className="readout border border-transparent p-2">
              &ldquo;{item.short_description}&rdquo;
            </p>
          )}
        </div>

        {/* DISTRIBUTION NETWORKS */}
        <div className="meta-group">
          <span className="label">MẠNG_LƯỚI_PHÂN_PHỐI</span>
          <div className="tag-container">
            {item.target_platforms?.map((platform: any) => (
              <div
                key={platform}
                className="tag text-zinc-300 border-zinc-700 bg-zinc-900/50 flex items-center gap-2"
              >
                <Globe size={10} />
                {platform}
              </div>
            ))}
          </div>
        </div>

        {/* TAGS */}
        <div className="meta-group">
          <span className="label">THẺ_PHÂN_LOẠI</span>
          <div className="tag-container">
            <div className="tag text-white border-white">{item.category}</div>
            {item.tags.map((tag: any) => (
              <div key={tag} className="tag">
                #{tag}
              </div>
            ))}
          </div>
        </div>

        {/* WORKFLOW STATUS PROGRESS */}
        <div className="meta-group mt-6">
          <span className="label">TRẠNG_THÁI // QUY_TRÌNH</span>

          {isRejected && (
            <div className="mb-2 p-2 border border-red-500/50 bg-red-950/20 text-red-400 font-mono text-[10px] uppercase">
              ⚠ Nội dung bị từ chối: {item.moderation_notes || 'Phát hiện vi phạm'}
            </div>
          )}

          <div className="relative mt-4 mb-2 select-none">
            <div className="flex justify-between items-center relative z-10">
              {workflowSteps.map((step, index) => {
                let stateClass = 'bg-[#1a1a1a] border-zinc-700 text-zinc-600';
                if (index < activeIndex) stateClass = 'bg-white border-white text-white';
                if (index === activeIndex) {
                  if (isRejected)
                    stateClass =
                      'bg-red-500 border-red-500 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
                  else
                    stateClass =
                      'bg-[#00ff66] border-[#00ff66] text-[#00ff66] shadow-[0_0_10px_rgba(0,255,102,0.5)]';
                }
                if (isRejected && index === 1)
                  stateClass = 'bg-red-500 border-red-500 text-red-500';

                return (
                  <div key={step.id} className="flex flex-col items-center gap-2">
                    <div
                      className={`w-2 h-2 border transform rotate-45 transition-colors duration-500 ${
                        stateClass.split(' ')[0]
                      } ${stateClass.split(' ')[1]}`}
                    />
                    <span
                      className={`text-[9px] font-mono font-bold tracking-widest transition-colors duration-500 ${
                        index <= activeIndex
                          ? isRejected && index === activeIndex
                            ? 'text-red-500'
                            : 'text-white'
                          : 'text-zinc-700'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="absolute top-1 left-0 w-full h-[1px] bg-[#1a1a1a] -z-0" />
            <div
              className={`absolute top-1 left-0 h-[1px] transition-all duration-700 -z-0 ${
                isRejected ? 'bg-red-900' : 'bg-white'
              }`}
              style={{ width: `${(activeIndex / (workflowSteps.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="actions">
          <button
            type="button"
            onClick={() => handleUpdateStatus(item.content_id, ContentStatus.REJECTED)}
            className="btn-kinetic btn-reject"
            disabled={isRejected}
          >
            TỪ CHỐI
          </button>
          <button
            type="button"
            onClick={() => handleUpdateStatus(item.content_id, ContentStatus.APPROVED)}
            className="btn-kinetic"
            disabled={
              item.status === ContentStatus.APPROVED || item.status === ContentStatus.PUBLISHED
            }
          >
            DUYỆT
          </button>
        </div>
      </aside>

      <ActivityLogModal
        item={item}
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        service={service}
      />
      <RejectConfirmationModal
        isOpen={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false);
          setPendingRejectId(null);
        }}
        onConfirm={handleConfirmReject}
      />
    </div>
  );
}
