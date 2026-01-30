import { useUser } from '@/features/auth/stores/useAuthStore';
import { STATUS_LABELS } from '@/shared';
import { DetailPageSkeleton, FilterSkeleton, VideoPlayer } from '@/shared/components';
import { ContentStatus, UserRole } from '@/shared/types';
import { Badge, Button, Textarea, Typography } from '@/shared/ui';
import { useNavigate, useParams } from '@tanstack/react-router';
import { AlertTriangle, Globe, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { Queue, useContentContext, WorkflowSteps } from '../components';
import { useCreateContent } from '../hooks/useContent';
import { useDraftContent, useGetDraftContentDetails } from '../hooks/useDraftContent';
import { ContentSchema } from '../schemas/content.schema';

function DetailPageComponent() {
  const { contentId } = useParams({ strict: false });
  const {
    data: crawlContent,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingCrawlContent,
  } = useDraftContent();

  // Infinite scroll for queue
  const [loadMoreRef] = useInfiniteScroll({
    hasNextPage,
    onLoadMore: fetchNextPage,
    loading: isFetchingNextPage,
  });

  const { mutate: createContent } = useCreateContent();

  const navigate = useNavigate();
  const currentUser = useUser();

  const { platforms, categories } = useContentContext();

  const {
    data: contentDetails,
    isFetched,
    isLoading: isLoadingContentDetails,
  } = useGetDraftContentDetails(Number(contentId));
  const firstFetch = useRef(false);

  useEffect(() => {
    if (!crawlContent || !contentDetails || firstFetch.current) return;

    const itemIndex = crawlContent?.findIndex((c) => c.id === contentDetails.id) || 0;
    if (itemIndex >= 0) {
      const queueList = document.querySelector('.queue-list');
      const activeItem = document.querySelector('.queue-item-active');
      if (activeItem && isFetched) {
        requestAnimationFrame(() => {
          const activeItemRect = activeItem.getBoundingClientRect();
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
  }, [contentDetails, crawlContent, hasNextPage, fetchNextPage, isFetched]);

  const allTags = contentDetails?.tags;
  const { register, handleSubmit, setValue, watch } = useForm<ContentSchema>({
    values: contentDetails
      ? {
          title: contentDetails?.title || '',
          description: contentDetails?.short_description || '',
          is_allow_comment: true,
          tags: contentDetails?.tags || undefined,
          media: [contentDetails?.media_url || ''],
          thumbnail: contentDetails?.thumbnail_url || '',
          platforms: platforms?.map((p) => p.api_key) || [],
          status: ContentStatus.PRIVATE,
          id: contentDetails?.id || '',
          categories: [],
        }
      : undefined,
  });

  const watchPlatforms = watch('platforms');
  const watchTags = watch('tags');
  const watchCategories = watch('categories');

  const handleUpdateMetadata = (key: 'platforms' | 'tags' | 'categories', value: any) => {
    const isExist = watch(key).includes(value);
    if (isExist) {
      setValue(
        key,
        watch(key).filter((p) => p !== value)
      );
    } else {
      setValue(key, [...watch(key), value]);
    }
  };

  const onSubmit = (data: ContentSchema) => {
    const toastId = toast.loading(`Khởi tạo nội dung...`);
    const { id, ...rest } = data;

    createContent(
      {
        data: rest,
      },
      {
        onSuccess: () => {
          toast.dismiss(toastId);
          toast.success('Khởi tạo nội dung thành công');
          const itemIndex = crawlContent?.findIndex((c) => c.id === id);
          const nextItem = crawlContent?.[itemIndex + 1];
          if (nextItem) {
            navigate({
              to: '/draft/detail/$contentId',
              params: { contentId: nextItem.id },
            });
          } else {
            navigate({ to: '/draft' });
          }
        },
        onError: () => {
          toast.dismiss(toastId);
          toast.error('Khởi tạo nội dung thất bại');
        },
      }
    );
  };

  if (isLoadingCrawlContent || isLoadingContentDetails) {
    return <DetailPageSkeleton />;
  }
  if (!crawlContent || !contentDetails) {
    return <EmptyDetailPage />;
  }

  const isEditable =
    contentDetails.status === ContentStatus.DRAFT || currentUser?.role === UserRole.ADMIN || true;

  const workflowSteps = [
    { id: ContentStatus.DRAFT, label: STATUS_LABELS[ContentStatus.DRAFT] },
    { id: ContentStatus.PENDING_REVIEW, label: STATUS_LABELS[ContentStatus.PENDING_REVIEW] },
    { id: ContentStatus.APPROVED, label: STATUS_LABELS[ContentStatus.APPROVED] },
    { id: ContentStatus.SCHEDULED, label: STATUS_LABELS[ContentStatus.SCHEDULED] },
    { id: ContentStatus.PUBLISHED, label: STATUS_LABELS[ContentStatus.PUBLISHED] },
  ];

  const currentStepIndex = workflowSteps.findIndex((s) => s.id === contentDetails.status);
  const isRejected = contentDetails.status === ContentStatus.REJECTED;

  let activeIndex = currentStepIndex;
  if (isRejected) activeIndex = 1;

  return (
    <div className="detail-layout animate-in fade-in duration-300">
      {/* LEFT: QUEUE SIDEBAR */}
      <aside className="queue-sidebar">
        <Queue
          queueItems={crawlContent}
          item={contentDetails}
          loadMoreRef={loadMoreRef}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
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
                {contentDetails.media_type?.toUpperCase()} {/* HD */}
              </span>
              <br />
              <span>BITRATE: 45MBPS</span>
            </div>
          </div>

          {/* Media Content */}
          {/* <video src={contentDetails.media_url} className="video-mock" autoPlay muted loop /> */}
          <VideoPlayer
            url={contentDetails.media_url}
            poster={contentDetails.thumbnail_url}
            title={contentDetails.title}
            aspectRatio="16/9"
            className="video-mock"
          />
        </div>

        {/* Close Button */}
        <Button
          variant="ghost"
          className="absolute top-4 right-4 z-40 text-zinc-500 hover:text-white"
          onClick={() => navigate({ to: '/draft' })}
        >
          <X size={20} />
        </Button>
      </section>

      {/* RIGHT: INSPECTOR SECTION */}
      <form onSubmit={handleSubmit(onSubmit)} id="content-form" className="inspector">
        {/* DESCRIPTION */}
        <div className="flex flex-col gap-2">
          <Typography variant="tiny" className="text-muted-foreground font-medium">
            NHẬT KÝ PHIÊN DỊCH
          </Typography>
          {isEditable ? (
            <Textarea
              {...register('description')}
              value={watch('description')}
              className="readout h-32 resize-none border border-white/10 bg-transparent p-2 transition-colors focus:border-white"
            />
          ) : (
            <p className="readout border border-transparent p-2">
              &ldquo;{contentDetails.short_description}&rdquo;
            </p>
          )}
        </div>

        {/* DISTRIBUTION NETWORKS */}
        {platforms.length > 0 ? (
          <div className="flex flex-col gap-2">
            <Typography variant="tiny" className="text-muted-foreground font-medium">
              MẠNG LƯỚI PHÂN PHỐI
            </Typography>
            <div className="flex flex-wrap gap-1.5">
              {platforms?.map((platform) => (
                <Badge
                  key={platform.id}
                  variant={watchPlatforms?.includes(platform.api_key) ? 'default' : 'outline'}
                  onClick={() => handleUpdateMetadata('platforms', platform.api_key)}
                  className="cursor-pointer transition-colors"
                >
                  <Globe size={10} />
                  {platform.api_key}
                </Badge>
              ))}
            </div>
          </div>
        ) : (
          <FilterSkeleton count={3} />
        )}

        {categories.length > 0 ? (
          <div className="space-y-3">
            <Typography variant="tiny" className="text-muted-foreground font-medium">
              DANH MỤC
            </Typography>
            <div className="flex flex-wrap gap-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleUpdateMetadata('categories', cat.name)}
                  className={`border px-3 py-1 font-mono text-[10px] transition-all ${
                    watchCategories?.includes(cat.name)
                      ? 'border-white bg-white text-black'
                      : 'border-zinc-800 bg-transparent text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <FilterSkeleton count={3} />
        )}

        {/* TAGS */}
        <div className="flex flex-col gap-2">
          <Typography variant="tiny" className="text-muted-foreground font-medium">
            THẺ PHÂN LOẠI
          </Typography>
          <div className="flex flex-wrap gap-1.5">
            {!allTags?.length && <p className="text-muted-foreground">Không có thẻ phân loại</p>}
            {allTags?.map((tag: string) => (
              <Badge
                key={tag}
                variant={watchTags?.includes(tag) ? 'default' : 'outline'}
                onClick={() => handleUpdateMetadata('tags', tag)}
                className="cursor-pointer transition-colors"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* WORKFLOW STATUS PROGRESS */}
        <WorkflowSteps
          isRejected={isRejected}
          item={contentDetails}
          workflowSteps={workflowSteps}
          activeIndex={activeIndex}
        />

        {/* ACTIONS */}
        <div className="actions">
          <Button variant="destructive" disabled>
            TỪ CHỐI
          </Button>
          <Button
            type="submit"
            variant="default"
            disabled={
              contentDetails.status === ContentStatus.APPROVED ||
              contentDetails.status === ContentStatus.PUBLISHED ||
              !watchPlatforms?.length ||
              !watchTags?.length ||
              !watchCategories?.length
            }
          >
            DUYỆT
          </Button>
        </div>
      </form>
    </div>
  );
}

function EmptyDetailPage() {
  const navigate = useNavigate();
  return (
    <div className="flex h-full flex-col items-center justify-center font-mono text-zinc-500 uppercase">
      <AlertTriangle size={48} className="mb-4 opacity-50" />
      <p className="font-semibold">KHÔNG TÌM THẤY TÀI NGUYÊN</p>
      <Button variant="link" onClick={() => navigate({ to: '/draft' })}>
        QUAY LẠI DANH SÁCH
      </Button>
    </div>
  );
}

export default DetailPageComponent;
