import { useInfiniteScroll } from '@/shared/hooks';
import { QueueSkeleton, DetailPageSkeleton } from '@/shared/components';
import { ContentStatus } from '@/shared/types';
import { Badge, Button, Typography } from '@/shared/ui';
import { useNavigate, useParams, useRouteContext, useSearch } from '@tanstack/react-router';
import { AlertTriangle, Globe, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  ActivityLogModal,
  Queue,
  RejectConfirmationModal,
  ScheduleModal,
  WorkflowSteps,
} from '../components';
import {
  useApproveContent,
  useApproveContents,
  useContent,
  useContentDetails,
  usePublishContent,
  useRejectContent,
  useRejectContents,
} from '../hooks/useContent';
import { useScheduleContent } from '../hooks/useSchedule';
import { useContentStore } from '../stores/useContentStore';

function DetailPageComponent() {
  const { contentId } = useParams({ strict: false });
  const searchParams = useSearch({ strict: false });

  const {
    data: realContent,
    isLoading: isLoadingCrawlContent,
    error: _errorCrawlContent,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useContent(searchParams?.approving_status as ContentStatus);

  const { mutate: approveContent, isPending: isApproveContentPending } = useApproveContent();
  const { mutate: rejectContent, isPending: _isRejectContentPending } = useRejectContent();

  // Batch operations
  const { mutate: approveContents, isPending: isApprovingBatch } = useApproveContents();
  const { mutate: rejectContents, isPending: isRejectingBatch } = useRejectContents();
  const { selectedIds, setSelectedIds } = useContentStore((state) => state);

  const loadMoreRef = useInfiniteScroll({
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    threshold: 200,
  });

  const { data: item, isLoading: isLoadingContentDetails } = useContentDetails({
    id: contentId,
    approving_status: searchParams?.approving_status as string,
  });
  const navigate = useNavigate();
  const { service, currentUser: _currentUser } = useRouteContext({ strict: false });

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isBatchRejectModalOpen, setIsBatchRejectModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [_pendingRejectId, setPendingRejectId] = useState<string | null>(null);

  const { mutate: scheduleContent, isPending: isSchedulingContent } = useScheduleContent();
  const { mutate: publishContent, isPending: isPublishingContent } = usePublishContent();

  const approveContentHandler = () => {
    if (!item) return;
    const toastId = toast.loading(`Duyệt nội dung ${item.id}...`);

    approveContent(
      {
        reel_id: item.id,
        reason: 'Ok',
      },
      {
        onSuccess: () => {
          toast.dismiss(toastId);
          toast.success('Duyệt nội dung thành công');
          navigate({ to: '/content' });
        },
        onError: () => {
          toast.dismiss(toastId);
          toast.error('Duyệt nội dung thất bại');
        },
      }
    );
  };

  const publishContentHandler = () => {
    if (!item) return;
    const toastId = toast.loading(`Đang đăng nội dung ${item.id}...`);
    publishContent(
      {
        reel_ids: [item.id],
      },
      {
        onSuccess: () => {
          toast.dismiss(toastId);
          toast.success('Đăng nội dung thành công');
          navigate({ to: '/content' });
        },
        onError: () => {
          toast.dismiss(toastId);
          toast.error('Đăng nội dung thất bại');
        },
      }
    );
  };

  const handleUpdateStatus = (nextStatus: ContentStatus) => {
    if (!item) return;
    switch (nextStatus) {
      case ContentStatus.REJECTED:
        setIsRejectModalOpen(true);
        break;
      case ContentStatus.APPROVED:
        approveContentHandler();
        break;
      case ContentStatus.PUBLISHED:
        publishContentHandler();
        break;
      default:
        break;
    }
  };

  const handleConfirmReject = (reason: string) => {
    if (item) {
      rejectContent(
        {
          reel_id: item.id,
          reason,
        },
        {
          onSuccess: () => {
            toast.success('Từ chối nội dung thành công');
            setIsRejectModalOpen(false);
            setPendingRejectId(null);
            navigate({ to: '/content' });
          },
          onError: () => {
            toast.error('Từ chối nội dung thất bại');
          },
        }
      );
    }
  };

  const handleToggleSelect = (id: string) => {
    const isExists = selectedIds.includes(id);
    if (isExists) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBatchApprove = () => {
    const eligibleApprovals = realContent?.filter((contentItem) =>
      selectedIds.includes(contentItem.id)
    );

    if (!eligibleApprovals || eligibleApprovals.length === 0) {
      toast.error('KHÔNG CÓ NỘI DUNG HỢP LỆ', {
        description: 'Chỉ có thể duyệt nội dung ở trạng thái CHỜ DUYỆT',
      });
      return;
    }

    const toastId = toast.loading(`Đang duyệt ${eligibleApprovals.length} nội dung...`);

    approveContents(
      {
        reel_ids: eligibleApprovals.map((contentItem) => contentItem.id),
        reason: 'Approved by admin',
      },
      {
        onSuccess: () => {
          toast.dismiss(toastId);
          toast.success('DUYỆT THÀNH CÔNG', {
            description: `Đã duyệt ${eligibleApprovals.length} nội dung`,
          });
          setSelectedIds([]);
          navigate({ to: '/content' });
        },
        onError: () => {
          toast.dismiss(toastId);
          toast.error('DUYỆT THẤT BẠI', {
            description: 'Không thể duyệt nội dung. Vui lòng thử lại.',
          });
        },
      }
    );
  };

  const handleBatchReject = () => {
    const eligibleRejections = realContent?.filter((contentItem) =>
      selectedIds.includes(contentItem.id)
    );

    if (!eligibleRejections || eligibleRejections.length === 0) {
      toast.error('KHÔNG CÓ NỘI DUNG HỢP LỆ', {
        description: 'Chỉ có thể từ chối nội dung ở trạng thái CHỜ DUYỆT hoặc ĐÃ DUYỆT',
      });
      return;
    }

    // Show confirmation modal
    setIsBatchRejectModalOpen(true);
  };

  const handleConfirmBatchReject = (reason: string) => {
    const eligibleRejections = realContent?.filter((contentItem) =>
      selectedIds.includes(contentItem.id)
    );

    if (!eligibleRejections || eligibleRejections.length === 0) return;

    const toastId = toast.loading(`Đang từ chối ${eligibleRejections.length} nội dung...`);

    rejectContents(
      {
        reel_ids: eligibleRejections.map((contentItem) => contentItem.id),
        reason,
      },
      {
        onSuccess: () => {
          toast.dismiss(toastId);
          toast.success('TỪ CHỐI THÀNH CÔNG', {
            description: `Đã từ chối ${eligibleRejections.length} nội dung`,
          });
          setSelectedIds([]);
          setIsBatchRejectModalOpen(false);
          navigate({ to: '/content' });
        },
        onError: () => {
          toast.dismiss(toastId);
          toast.error('TỪ CHỐI THẤT BẠI', {
            description: 'Không thể từ chối nội dung. Vui lòng thử lại.',
          });
        },
      }
    );
  };

  // Count items eligible for approve/reject
  const batchApproveCount = realContent?.filter((i) => selectedIds.includes(i.id)).length;

  const batchRejectCount = realContent?.filter((i) => selectedIds.includes(i.id)).length;

  const handleScheduleConfirm = (scheduledTime: string) => {
    if (!item) return;

    const toastId = toast.loading('ĐANG_LÊN_LỊCH...');

    scheduleContent(
      {
        reel_id: item.id,
        scheduled_at: scheduledTime,
        approving_status: searchParams?.approving_status as string,
      },
      {
        onSuccess: () => {
          toast.dismiss(toastId);
          toast.success('LÊN_LỊCH_THÀNH_CÔNG', {
            description: `Video sẽ được đăng vào ${new Date(scheduledTime).toLocaleString('vi-VN')}`,
            duration: 4000,
          });
          setIsScheduleModalOpen(false);
        },
        onError: () => {
          toast.dismiss(toastId);
          toast.error('LÊN_LỊCH_THẤT_BẠI', {
            description: 'Không thể lên lịch. Vui lòng thử lại.',
            duration: 4000,
          });
        },
      }
    );
  };

  if (isLoadingContentDetails) {
    return <DetailPageSkeleton />;
  }
  if (!item) {
    return <EmptyDetailPage />;
  }

  const workflowSteps = [
    { id: ContentStatus.PENDING_REVIEW, label: 'CHỜ DUYỆT' },
    { id: ContentStatus.APPROVED, label: 'DUYỆT' },
    { id: ContentStatus.SCHEDULED, label: 'LÊN LỊCH' },
    { id: ContentStatus.PUBLISHED, label: 'ĐĂNG' },
  ];

  const currentStepIndex = workflowSteps.findIndex((s) => s.id === item?.status);
  const isRejected = item?.status === ContentStatus.REJECTED;
  const isArchived = item?.status === ContentStatus.ARCHIVED;

  let activeIndex = currentStepIndex;
  if (isRejected) activeIndex = 1;
  if (isArchived) activeIndex = 5;
  return (
    <div className="detail-layout animate-in fade-in duration-300">
      {/* LEFT: QUEUE SIDEBAR */}
      <aside className="queue-sidebar">
        {isLoadingCrawlContent ? (
          <QueueSkeleton count={12} />
        ) : (
          <Queue
            queueItems={realContent || []}
            item={item}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            loadMoreRef={loadMoreRef}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
          />
        )}
      </aside>

      {/* CENTER: VIEWPORT SECTION */}
      <section className="viewport-container group">
        <div className="shutter-frame">
          <div className="shutter-blade shutter-top" />
          <div className="shutter-blade shutter-bottom" />

          {/* UI Overlay */}
          <div className="ui-overlay">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#00ff66] shadow-[0_0_10px_#00ff66]" />{' '}
                GHI
              </span>
              <span>{new Date().toLocaleTimeString()}</span>
            </div>
            <div className="scanline" />
            <div className="text-right">
              <span>
                {item.media_type?.toUpperCase()} {/* HD */}
              </span>
              <br />
              <span>BITRATE: 45MBPS</span>
            </div>
          </div>

          {/* Media Content */}
          <video src={item.media_url} className="video-mock" autoPlay muted loop />
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
        <div className="flex flex-col gap-2">
          <Typography variant="tiny" className="text-muted-foreground font-medium">
            NHẬT KÝ PHIÊN DỊCH
          </Typography>
          <p className="readout border border-transparent p-2">
            &ldquo;{item.short_description}&rdquo;
          </p>
        </div>

        {/* DISTRIBUTION NETWORKS */}
        <div className="flex flex-col gap-2">
          <Typography variant="tiny" className="text-muted-foreground font-medium">
            MẠNG LƯỚI PHÂN PHỐI
          </Typography>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="outline">
              <Globe size={10} />
              {item.category}
            </Badge>
          </div>
        </div>

        {/* TAGS */}
        {!!item.tags?.length && (
          <div className="flex flex-col gap-2">
            <Typography variant="tiny" className="text-muted-foreground font-medium">
              THẺ PHÂN LOẠI
            </Typography>
            <div className="flex flex-wrap gap-1.5">
              {item.tags?.map((tag: string) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* WORKFLOW STATUS PROGRESS */}
        <WorkflowSteps
          isRejected={isRejected}
          item={item}
          workflowSteps={workflowSteps}
          activeIndex={activeIndex}
        />

        {/* ACTIONS */}
        <div className="actions">
          {item.status === ContentStatus.PENDING_REVIEW && (
            <Button
              variant="destructive"
              onClick={() => handleUpdateStatus(ContentStatus.REJECTED)}
              disabled={isRejected}
            >
              TỪ CHỐI
            </Button>
          )}
          {item.status !== ContentStatus.PENDING_REVIEW && (
            <Button
              variant="outline"
              onClick={() => setIsScheduleModalOpen(true)}
              disabled={item.status === ContentStatus.PUBLISHED || isSchedulingContent}
              className="border-white/20 text-white hover:bg-white/10"
            >
              LÊN LỊCH
            </Button>
          )}
          {item.status !== ContentStatus.PENDING_REVIEW && (
            <Button
              variant="default"
              onClick={() => handleUpdateStatus(ContentStatus.APPROVED)}
              disabled={isPublishingContent}
            >
              Đăng ngay
            </Button>
          )}
          {item.status === ContentStatus.PENDING_REVIEW && (
            <Button
              variant="default"
              onClick={() => handleUpdateStatus(ContentStatus.APPROVED)}
              disabled={isApproveContentPending}
            >
              DUYỆT
            </Button>
          )}
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
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onConfirm={handleScheduleConfirm}
        item={item}
      />

      {/* Batch Reject Confirmation Modal */}
      <RejectConfirmationModal
        isOpen={isBatchRejectModalOpen}
        onClose={() => setIsBatchRejectModalOpen(false)}
        onConfirm={handleConfirmBatchReject}
      />

      {/* Floating Batch Action Bar */}
      {selectedIds.length > 0 && (
        <div className="animate-in slide-in-from-bottom-10 fade-in fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 transform items-center gap-3 border border-white/20 bg-zinc-900 p-2 pl-6 shadow-2xl backdrop-blur-md">
          <span className="font-mono text-xs text-white uppercase">
            {selectedIds.length} ĐÃ CHỌN
          </span>
          <div className="h-4 w-[1px] bg-white/20" />

          {/* Approve Button */}
          <Button
            variant="default"
            className="h-8 bg-white text-black hover:bg-zinc-200 disabled:opacity-50"
            onClick={handleBatchApprove}
            disabled={batchApproveCount === 0 || isApprovingBatch}
          >
            {isApprovingBatch ? 'ĐANG DUYỆT...' : `DUYỆT (${batchApproveCount || 0})`}
          </Button>

          {/* Reject Button */}
          <Button
            variant="destructive"
            className="h-8 disabled:opacity-50"
            onClick={handleBatchReject}
            disabled={batchRejectCount === 0 || isRejectingBatch}
          >
            {isRejectingBatch ? 'ĐANG TỪ CHỐI...' : `TỪ CHỐI (${batchRejectCount || 0})`}
          </Button>

          {/* Cancel Button */}
          <div className="h-4 w-[1px] bg-white/20" />
          <Button
            variant="ghost"
            className="h-8 text-zinc-400 hover:text-white"
            onClick={() => setSelectedIds([])}
          >
            HỦY
          </Button>
        </div>
      )}
    </div>
  );
}

export default DetailPageComponent;

function EmptyDetailPage() {
  const navigate = useNavigate();
  return (
    <div className="flex h-full flex-col items-center justify-center font-mono text-zinc-500 uppercase">
      <AlertTriangle size={48} className="mb-4 opacity-50" />
      <p className="font-semibold">KHÔNG TÌM THẤY TÀI NGUYÊN</p>
      <Button variant="link" onClick={() => navigate({ to: '/content' })}>
        QUAY LẠI DANH SÁCH
      </Button>
    </div>
  );
}
