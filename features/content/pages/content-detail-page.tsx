import { DetailPageSkeleton, QueueSkeleton, VideoPlayer } from '@/shared/components';
import { useInfiniteScroll } from '@/shared/hooks';
import { ContentStatus } from '@/shared/types';
import { Badge, Button, Typography } from '@/shared/ui';
import { useNavigate, useParams, useSearch } from '@tanstack/react-router';
import { AlertCircle, AlertTriangle, Globe, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { STATUS_LABELS } from '@/shared';
import {
  FloatingBatchActionBar,
  Queue,
  RejectConfirmationModal,
  ScheduleModal,
  useContentContext,
  WorkflowSteps,
} from '../components';
import {
  useApproveContents,
  useContent,
  useContentDetails,
  usePublishContent,
  useRejectContents,
} from '../hooks/useContent';
import { useScheduleContent } from '../hooks/useSchedule';
import { ContentDetailSearchSchema } from '../schemas';
import { useContentStore } from '../stores/useContentStore';
import { ApproveContentBatchPayload } from '../types';

function DetailPageComponent() {
  const { contentId } = useParams({ strict: false });
  const searchParams: ContentDetailSearchSchema = useSearch({ strict: false });

  const {
    data: realContent,
    isLoading: isLoadingCrawlContent,
    error: _errorCrawlContent,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useContent(searchParams?.approving_status as ContentStatus);

  const { categories } = useContentContext();
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

  // Count items eligible for approve/reject
  const batchApproveCount = realContent?.filter((i) => selectedIds.includes(i.id)).length;

  const batchRejectCount = realContent?.filter((i) => selectedIds.includes(i.id)).length;

  const navigate = useNavigate();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isBatchRejectModalOpen, setIsBatchRejectModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [_pendingRejectId, setPendingRejectId] = useState<string | null>(null);

  const { mutate: scheduleContent, isPending: isSchedulingContent } = useScheduleContent();
  const { mutate: publishContent, isPending: isPublishingContent } = usePublishContent();

  const handleToggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      }
      return [...prev, categoryId];
    });
  };

  const handleApproveContent = () => {
    if (!item) return;
    const toastId = toast.loading(`Đang duyệt nội dung...`);

    approveContents(
      {
        reel_ids: [
          {
            reel_id: item.id,
            categories: selectedCategories,
          },
        ],
        reason: 'Ok',
      },
      {
        onSuccess: () => {
          toast.dismiss(toastId);
          toast.success('Duyệt nội dung thành công');
          const itemIndex = realContent?.findIndex((c) => c.id === item.id) || 0;
          const nextItem = realContent?.[itemIndex + 1];
          if (nextItem) {
            navigate({
              to: '/content/detail/$contentId',
              params: { contentId: nextItem.id },
              search: { approving_status: nextItem?.approving_status as string },
            });
          } else {
            navigate({ to: '/content' });
          }
          setSelectedCategories([]);
        },
        onError: () => {
          toast.dismiss(toastId);
          toast.error('Duyệt nội dung thất bại');
        },
      }
    );
  };

  const handlePublishContent = () => {
    if (!item) return;
    const toastId = toast.loading(`Đang đăng nội dung...`);
    publishContent(
      {
        reel_ids: [item.id],
      },
      {
        onSuccess: () => {
          toast.dismiss(toastId);
          toast.success('Đăng nội dung thành công');
          const itemIndex = realContent?.findIndex((c) => c.id === item.id) || 0;
          const nextItem = realContent?.[itemIndex + 1];
          if (nextItem) {
            navigate({
              to: '/content/detail/$contentId',
              params: { contentId: nextItem.id },
              search: { approving_status: nextItem?.approving_status as string },
            });
          } else {
            navigate({ to: '/content' });
          }
        },
        onError: () => {
          toast.dismiss(toastId);
          toast.error('Đăng nội dung thất bại');
        },
      }
    );
  };

  const handleConfirmReject = (reason: string) => {
    if (item) {
      rejectContents(
        {
          reel_ids: [item.id],
          reason,
        },
        {
          onSuccess: () => {
            toast.success('Từ chối nội dung thành công');
            setIsRejectModalOpen(false);
            setPendingRejectId(null);
            const itemIndex = realContent?.findIndex((c) => c.id === item.id) || 0;
            const nextItem = realContent?.[itemIndex + 1];
            if (nextItem) {
              navigate({
                to: '/content/detail/$contentId',
                params: { contentId: nextItem.id },
                search: { approving_status: nextItem?.approving_status as string },
              });
            } else {
              navigate({ to: '/content' });
            }
            setSelectedCategories([]);
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

    const reelIds = eligibleApprovals.map((contentItem) => {
      return {
        reel_id: contentItem.id,
        categories: selectedCategories,
      };
    });

    approveContents(
      {
        reel_ids: reelIds as ApproveContentBatchPayload['reel_ids'],
        reason: 'Approved by admin',
      },
      {
        onSuccess: () => {
          toast.dismiss(toastId);
          toast.success('DUYỆT THÀNH CÔNG', {
            description: `Đã duyệt ${eligibleApprovals.length} nội dung`,
          });
          setSelectedIds([]);
          setSelectedCategories([]);
          const nextItem = realContent?.find((c) => !eligibleApprovals.includes(c));
          if (nextItem) {
            navigate({
              to: '/content/detail/$contentId',
              params: { contentId: nextItem.id },
              search: { approving_status: nextItem?.approving_status as string },
            });
          } else {
            navigate({ to: '/content' });
          }
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
          setIsBatchRejectModalOpen(false);
          const nextItem = realContent?.find((c) => !eligibleRejections.includes(c));
          if (nextItem) {
            navigate({
              to: '/content/detail/$contentId',
              params: { contentId: nextItem.id },
              search: { approving_status: nextItem?.approving_status as string },
            });
          } else {
            navigate({ to: '/content' });
          }
          setSelectedIds([]);
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
          setSelectedCategories([]);
          const itemIndex = realContent?.findIndex((c) => c.id === item.id) || 0;
          const nextItem = realContent?.[itemIndex + 1];
          if (nextItem) {
            navigate({
              to: '/content/detail/$contentId',
              params: { contentId: nextItem.id },
              search: { approving_status: nextItem?.approving_status as string },
            });
          } else {
            navigate({ to: '/content' });
          }
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

  const handleUpdateStatus = (nextStatus: ContentStatus) => {
    if (!item) return;
    switch (nextStatus) {
      case ContentStatus.REJECTED:
        setIsRejectModalOpen(true);
        break;
      case ContentStatus.APPROVED:
        handleApproveContent();
        break;
      case ContentStatus.PUBLISHED:
        handlePublishContent();
        break;
      default:
        break;
    }
  };

  if (isLoadingContentDetails) {
    return <DetailPageSkeleton />;
  }
  if (!item) {
    return <EmptyDetailPage />;
  }

  const workflowSteps = [
    { id: ContentStatus.PENDING_REVIEW, label: STATUS_LABELS[ContentStatus.PENDING_REVIEW] },
    { id: ContentStatus.APPROVED, label: STATUS_LABELS[ContentStatus.APPROVED] },
    { id: ContentStatus.SCHEDULED, label: STATUS_LABELS[ContentStatus.SCHEDULED] },
    { id: ContentStatus.PUBLISHED, label: STATUS_LABELS[ContentStatus.PUBLISHED] },
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
              {/* <span className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#00ff66] shadow-[0_0_10px_#00ff66]" />{' '}
                GHI
              </span> */}
              <div />
              <span>{new Date(item.created_at).toLocaleTimeString()}</span>
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
          {/* <video src={item.media_url} className="video-mock" autoPlay muted loop /> */}
          <VideoPlayer
            url={item.media_url}
            poster={item.thumbnail_url}
            title={item.title}
            aspectRatio="16/9"
            className="video-mock"
          />
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

        {/* CATEGORIES */}
        {!!categories?.length && item.status === ContentStatus.PENDING_REVIEW && (
          <div className="flex flex-col gap-2">
            <Typography variant="tiny" className="text-muted-foreground font-medium">
              DANH MỤC
            </Typography>
            <Typography
              variant="tiny"
              className="text-toast-warning flex items-center gap-2 font-medium"
            >
              <AlertCircle size={10} /> Vui lòng chọt ít nhất 1 danh mục để duyệt nội dung
            </Typography>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((category) => (
                <Badge
                  key={category.id}
                  variant={selectedCategories.includes(category.name) ? 'default' : 'outline'}
                  onClick={() => handleToggleCategory(category.name)}
                  className="cursor-pointer transition-colors"
                >
                  {category.name}
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
              onClick={() => handleUpdateStatus(ContentStatus.PUBLISHED)}
              disabled={isPublishingContent || item.status === ContentStatus.PUBLISHED}
            >
              Đăng ngay
            </Button>
          )}
          {item.status === ContentStatus.PENDING_REVIEW && (
            <Button
              variant="default"
              onClick={() => handleUpdateStatus(ContentStatus.APPROVED)}
              disabled={isApprovingBatch || selectedCategories.length === 0}
            >
              {isApprovingBatch ? 'ĐANG DUYỆT...' : 'DUYỆT'}
            </Button>
          )}
        </div>
      </aside>

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
      <FloatingBatchActionBar
        showCategorySelector
        selectedCount={selectedIds.length}
        approveCount={batchApproveCount}
        rejectCount={batchRejectCount}
        isApproving={isApprovingBatch}
        isRejecting={isRejectingBatch}
        onApprove={handleBatchApprove}
        onReject={handleBatchReject}
        onCancel={() => {
          setSelectedIds([]);
          setSelectedCategories([]);
        }}
        categories={categories.map((cat) => cat.name)}
        onCategoriesChange={(cats: string[]) => setSelectedCategories(cats)}
        selectedCategories={selectedCategories}
      />
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
