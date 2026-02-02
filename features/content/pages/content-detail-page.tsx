import { STATUS_LABELS } from '@/shared';
import { DetailPageSkeleton, QueueSkeleton } from '@/shared/components';
import { ContentStatus } from '@/shared/types';
import { Badge, Button, Textarea, Typography } from '@/shared/ui';
import { useNavigate, useParams, useSearch } from '@tanstack/react-router';
import { AlertTriangle, Globe, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { toast } from 'sonner';
import {
  ContentBody,
  Queue,
  RejectConfirmationModal,
  ScheduleModal,
  useContentContext,
  WorkflowSteps,
} from '../components';
import {
  useApproveContent,
  useContent,
  useContentDetails,
  usePublishContent,
  useRejectContents,
} from '../hooks/useContent';
import { useScheduleContent } from '../hooks/useSchedule';
import { ContentDetailSearchSchema, UpdateReelSchema } from '../schemas';
import { useContentStore } from '../stores/useContentStore';

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
  } = useContent({
    ...searchParams,
    approving_status: searchParams?.approving_status as string,
  });

  // Mutate
  const { mutate: rejectContents, isPending: isRejectingBatch } = useRejectContents();
  const { mutate: scheduleContent, isPending: isSchedulingContent } = useScheduleContent();
  const { mutate: publishContent, isPending: isPublishingContent } = usePublishContent();
  const { mutate: approveContent, isPending: isApprovingContent } = useApproveContent();
  // Store
  const { selectedIds, setSelectedIds } = useContentStore((state) => state);

  const [loadMoreRef] = useInfiniteScroll({
    hasNextPage,
    onLoadMore: fetchNextPage,
    loading: isFetchingNextPage,
  });

  const {
    data: item,
    isLoading: isLoadingContentDetails,
    isFetched,
  } = useContentDetails({
    id: contentId,
    approving_status: searchParams?.approving_status as string,
  });

  const firstFetch = useRef(false);

  useEffect(() => {
    if (!realContent || !item || firstFetch.current) return;

    const itemIndex = realContent?.findIndex((c) => c.id === item.id) || 0;
    if (itemIndex >= 0) {
      const queueList = document.querySelector('.queue-list');
      const activeItem = document.querySelector('.queue-item-active');
      if (activeItem && isFetched) {
        requestAnimationFrame(() => {
          const activeItemRect = activeItem.getBoundingClientRect();
          // scroll to the active item, but keep the center of the queue visible
          const top = activeItemRect.top - (queueList?.clientHeight || 0) / 2;
          queueList?.scrollTo({ top, behavior: 'smooth' });
          firstFetch.current = true;
        });
      }
      return;
    }

    if (hasNextPage) {
      fetchNextPage();
    }
  }, [item, realContent, hasNextPage, fetchNextPage, isFetched]);

  const navigate = useNavigate();

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isBatchRejectModalOpen, setIsBatchRejectModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [_pendingRejectId, setPendingRejectId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { isDirty, dirtyFields },
    watch,
    setValue,
  } = useForm<UpdateReelSchema>({
    values: item
      ? {
          title: item?.title || '',
          platforms: item?.target_platforms || [],
          categories: item?.categories || [],
          tags: item?.tags || [],
          is_allow_comment: item?.is_allow_comment || true,
        }
      : undefined,
  });

  const { categories, platforms } = useContentContext();
  const watchTitle = watch('title');
  const watchPlatforms = watch('platforms');
  const watchCategories = watch('categories');
  // const watchIsAllowComment = watch('is_allow_comment');
  const watchTags = useMemo(() => {
    if (!watchTitle) return [];

    return watchTitle.match(/#(\w+)/g) || [];
  }, [watchTitle]);

  const handleChangeMetadata = (key: 'platforms' | 'categories', value: any) => {
    const isExits = watch(key)?.includes(value);
    if (isExits) {
      setValue(
        key,
        watch(key)?.filter((i) => i !== value),
        { shouldDirty: true }
      );
    } else {
      setValue(key, [...(watch(key) || []), value], { shouldDirty: true });
    }
  };

  const handleApproveContent = (data: UpdateReelSchema) => {
    if (!item) return;
    const toastId = toast.loading(`Đang duyệt nội dung...`);

    const payload: UpdateReelSchema = {
      tags: watchTags,
    };

    Object.keys(dirtyFields || {}).forEach((key) => {
      const typedKey = key as keyof UpdateReelSchema;
      // @ts-expect-error - Dynamic key assignment from form data
      payload[typedKey] = data[typedKey];
    });

    approveContent(
      {
        reel_id: item.id,
        reason: 'Ok',
        update_reels: payload,
      },
      {
        onSuccess: () => {
          toast.dismiss(toastId);
          toast.success('Duyệt nội dung thành công');
          const itemIndex = realContent?.findIndex((c) => c.id === item.id) || 0;
          const nextItem = realContent?.[itemIndex + 1];
          const previousItem = realContent?.[itemIndex - 1];
          if (nextItem || previousItem) {
            const nextItemId = nextItem?.id || previousItem?.id;
            const nextItemApprovingStatus =
              nextItem?.approving_status || previousItem?.approving_status;
            navigate({
              to: '/content/detail/$contentId',
              params: { contentId: nextItemId },
              search: { approving_status: nextItemApprovingStatus as string },
            });
          } else {
            navigate({ to: '/content' });
          }
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
          const previousItem = realContent?.[itemIndex - 1];
          if (nextItem || previousItem) {
            const nextItemId = nextItem?.id || previousItem?.id;
            const nextItemApprovingStatus =
              nextItem?.approving_status || previousItem?.approving_status;
            navigate({
              to: '/content/detail/$contentId',
              params: { contentId: nextItemId },
              search: { approving_status: nextItemApprovingStatus as string },
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
            const previousItem = realContent?.[itemIndex - 1];
            if (nextItem || previousItem) {
              const nextItemId = nextItem?.id || previousItem?.id;
              const nextItemApprovingStatus =
                nextItem?.approving_status || previousItem?.approving_status;
              navigate({
                to: '/content/detail/$contentId',
                params: { contentId: nextItemId },
                search: { approving_status: nextItemApprovingStatus as string },
              });
            } else {
              navigate({ to: '/content' });
            }
          },
          onError: () => {
            toast.error('Từ chối nội dung thất bại');
          },
        }
      );
    }
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
          const itemIndex = realContent?.findIndex((c) => c.id === item.id) || 0;
          const nextItem = realContent?.[itemIndex + 1];
          const previousItem = realContent?.[itemIndex - 1];
          if (nextItem || previousItem) {
            const nextItemId = nextItem?.id || previousItem?.id;
            const nextItemApprovingStatus =
              nextItem?.approving_status || previousItem?.approving_status;
            navigate({
              to: '/content/detail/$contentId',
              params: { contentId: nextItemId },
              search: { approving_status: nextItemApprovingStatus as string },
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

  const canEdit = item?.status === ContentStatus.PENDING_REVIEW;
  let activeIndex = currentStepIndex;
  if (isRejected) activeIndex = 1;
  if (isArchived) activeIndex = 5;
  return (
    <div className="detail-layout animate-in fade-in p-4 duration-300 sm:p-10">
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
              <Badge>{new Date(item.created_at).toLocaleTimeString()}</Badge>
            </div>
            <div className="scanline" />
          </div>

          {/* Media Content */}
          <ContentBody content={item} />
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
      <form onSubmit={handleSubmit(handleApproveContent)} className="flex flex-col gap-4 py-4">
        {/* DESCRIPTION */}
        <div className="flex flex-col gap-2">
          <Typography variant="small" className="text-muted-foreground font-medium">
            NHẬT KÝ PHIÊN DỊCH
          </Typography>
          {canEdit ? (
            <Textarea
              {...register('title')}
              value={watchTitle}
              onChange={(e) => {
                setValue('title', e.target.value, { shouldDirty: true });
              }}
              className="h-32 resize-none border border-white/10 bg-transparent p-2 transition-colors focus:border-white"
            />
          ) : (
            <p className="font-base border border-transparent">&ldquo;{item.title}&rdquo;</p>
          )}
        </div>

        {/* TAGS */}
        {!!watchTags?.length && (
          <div className="flex flex-col gap-2">
            <Typography variant="small" className="text-muted-foreground font-medium">
              THẺ PHÂN LOẠI
            </Typography>
            <div className="flex flex-wrap gap-1.5">
              {watchTags.map((tag: string) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* DISTRIBUTION NETWORKS */}
        {!!platforms && (
          <div className="flex flex-col gap-2">
            <Typography variant="small" className="text-muted-foreground font-medium">
              MẠNG LƯỚI PHÂN PHỐI
            </Typography>
            <div className="flex flex-wrap gap-1.5">
              {platforms.map((platform) => (
                <Badge
                  variant={watchPlatforms?.includes(platform.name) ? 'default' : 'outline'}
                  key={platform.id}
                  onClick={
                    canEdit ? () => handleChangeMetadata('platforms', platform.name) : undefined
                  }
                  className={canEdit ? 'cursor-pointer' : ''}
                >
                  <Globe size={10} />
                  {platform.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* CATEGORIES */}
        {!!categories?.length && (
          <div className="flex flex-col gap-2">
            <Typography variant="small" className="text-muted-foreground font-medium">
              DANH MỤC
            </Typography>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((category) => (
                <Badge
                  variant={watchCategories?.includes(category.name) ? 'default' : 'outline'}
                  key={category.id}
                  onClick={
                    canEdit ? () => handleChangeMetadata('categories', category.name) : undefined
                  }
                  className={canEdit ? 'cursor-pointer' : ''}
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
              disabled={isRejected || isRejectingBatch}
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
            <Button variant="default" type="submit" disabled={isApprovingContent}>
              {isApprovingContent ? 'ĐANG DUYỆT...' : 'DUYỆT'}
            </Button>
          )}
        </div>
      </form>

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
