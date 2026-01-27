import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';
import { ContentStatus } from '@/shared/types';
import { Badge, Button, Textarea, Typography } from '@/shared/ui';
import { useNavigate, useParams, useRouteContext } from '@tanstack/react-router';
import { AlertTriangle, Globe, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { DetailPageSkeleton } from '@/shared/components';
import {
  ActivityLogModal,
  Queue,
  RejectConfirmationModal,
  useContentContext,
  WorkflowSteps,
} from '../components';
import { useCreateContent } from '../hooks/useContent';
import {
  useCrawlContent,
  useGetContentCrawlerDetails,
  useMakeVideoCrawler,
} from '../hooks/useCrawlContent';
import { ContentSchema } from '../schemas/content.schema';
import { useCrawlStore } from '../stores/useCrawlStore';

function DetailPageComponent() {
  const { contentId } = useParams({ strict: false });
  const {
    data: crawlContent,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingCrawlContent,
  } = useCrawlContent();

  // Infinite scroll for queue
  const loadMoreRef = useInfiniteScroll({
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    threshold: 200,
  });

  const { mutate: createContent } = useCreateContent();
  const { mutateAsync: makeVideoCrawler } = useMakeVideoCrawler();
  const { selectedIds, setSelectedIds } = useCrawlStore();

  const navigate = useNavigate();
  const { service, currentUser } = useRouteContext({
    strict: false,
  });

  const { platforms, categories } = useContentContext();

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isBatchRejectModalOpen, setIsBatchRejectModalOpen] = useState(false);
  const [pendingRejectId, setPendingRejectId] = useState<string | null>(null);

  const { data: contentDetails, isLoading: isLoadingContentDetails } = useGetContentCrawlerDetails(
    Number(contentId)
  );

  const allTags = [...(contentDetails?.tags || []), ...categories.map((c) => c.slug)];
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
        }
      : undefined,
  });

  const watchPlatforms = watch('platforms');
  const watchTags = watch('tags');

  const handleUpdateMetadata = (key: 'platforms' | 'tags', value: string) => {
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
    const toastId = toast.loading(`Publishing content...`);
    createContent(
      {
        data,
      },
      {
        onSuccess: () => {
          toast.dismiss(toastId);
          toast.success('Publish content successfully');
          navigate({ to: '/review' });
        },
        onError: () => {
          toast.dismiss(toastId);
          toast.error('Publish content failed');
        },
      }
    );
  };

  if (!contentDetails) {
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

  const isEditable =
    contentDetails.status === ContentStatus.DRAFT || currentUser.role === 'ADMIN' || true;

  const workflowSteps = [
    { id: ContentStatus.DRAFT, label: 'K.TẠO' },
    { id: ContentStatus.PENDING_REVIEW, label: 'DUYỆT' },
    { id: ContentStatus.APPROVED, label: 'XONG' },
    { id: ContentStatus.SCHEDULED, label: 'CHỜ' },
    { id: ContentStatus.PUBLISHED, label: 'ĐĂNG' },
  ];

  const currentStepIndex = workflowSteps.findIndex((s) => s.id === contentDetails.status);
  const isRejected = contentDetails.status === ContentStatus.REJECTED;
  const isArchived = contentDetails.status === ContentStatus.ARCHIVED;

  let activeIndex = currentStepIndex;
  if (isRejected) activeIndex = 1;
  if (isArchived) activeIndex = 5;

  if (isLoadingCrawlContent) {
    return <DetailPageSkeleton />;
  }
  if (!crawlContent) {
    return <EmptyDetailPage />;
  }

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
          selectedIds={selectedIds}
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
          <video src={contentDetails.media_url} className="video-mock" autoPlay muted loop />
        </div>

        {/* Close Button */}
        <Button
          variant="ghost"
          className="absolute top-4 right-4 z-40 text-zinc-500 hover:text-white"
          onClick={() => navigate({ to: '/review' })}
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
        <div className="flex flex-col gap-2">
          <Typography variant="tiny" className="text-muted-foreground font-medium">
            MẠNG LƯỚI PHÂN PHỐI
          </Typography>
          <div className="flex flex-wrap gap-1.5">
            {platforms?.map((platform) => (
              <Badge
                key={platform.id}
                variant={watchPlatforms.includes(platform.api_key) ? 'default' : 'outline'}
                onClick={() => handleUpdateMetadata('platforms', platform.api_key)}
                className="cursor-pointer transition-colors"
              >
                <Globe size={10} />
                {platform.api_key}
              </Badge>
            ))}
          </div>
        </div>

        {/* TAGS */}
        <div className="flex flex-col gap-2">
          <Typography variant="tiny" className="text-muted-foreground font-medium">
            THẺ PHÂN LOẠI
          </Typography>
          <div className="flex flex-wrap gap-1.5">
            {!allTags.length && <p className="text-muted-foreground">Không có thẻ phân loại</p>}
            {allTags.map((tag: string) => (
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
              !watchTags?.length
            }
          >
            DUYỆT
          </Button>
        </div>
      </form>

      <ActivityLogModal
        item={contentDetails}
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        service={service}
      />
    </div>
  );
}

function EmptyDetailPage() {
  const navigate = useNavigate();
  return (
    <div className="flex h-full flex-col items-center justify-center font-mono text-zinc-500 uppercase">
      <AlertTriangle size={48} className="mb-4 opacity-50" />
      <p className="font-semibold">KHÔNG TÌM THẤY TÀI NGUYÊN</p>
      <Button variant="link" onClick={() => navigate({ to: '/content/crawl' })}>
        QUAY LẠI DANH SÁCH
      </Button>
    </div>
  );
}

export default DetailPageComponent;
