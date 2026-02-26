import { useUser } from '@/features/auth/stores/useAuthStore';
import { cn } from '@/lib';
import { STATUS_LABELS } from '@/shared';
import { DetailPageSkeleton, FilterSkeleton, VideoPlayer } from '@/shared/components';
import { useDebounceSearch } from '@/shared/hooks/use-debounce-search';
import { ContentStatus, UserRole } from '@/shared/types';
import { Badge, Button, Dialog, DialogTrigger, Textarea, Typography } from '@/shared/ui';
import { useNavigate, useParams, useSearch } from '@tanstack/react-router';
import { AlertTriangle, Globe, Languages, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { toast } from 'sonner';
import { MetadataModal, Queue, useContentContext, WorkflowSteps } from '../components';
import { useCreateContent } from '../hooks/useContent';
import { useCountries } from '../hooks/useCountry';
import {
  useDraftContent,
  useGetDraftContentDetails,
  useGetDraftContentPlaylist,
} from '../hooks/useDraftContent';
import { useLanguages } from '../hooks/useLanguage';
import { DraftContentSearchSchema } from '../schemas';
import { ContentSchema } from '../schemas/content.schema';
import { detectTags } from '../utils';

function DetailPageComponent() {
  const { contentId } = useParams({ strict: false });
  const filters: DraftContentSearchSchema = useSearch({ strict: false });
  const { playlist, ...restFilters } = filters;

  const {
    data: crawlContent,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingCrawlContent,
    totalItems,
  } = useDraftContent(restFilters);

  const {
    data: recommendedPlaylists,
    fetchNextPage: fetchNextPagePlaylist,
    hasNextPage: hasNextPagePlaylist,
    isFetchingNextPage: isFetchingNextPagePlaylist,
    totalItems: totalItemsPlaylist,
  } = useGetDraftContentPlaylist(filters);

  const filteredCrawlContent = useMemo(() => {
    return (
      crawlContent?.filter((c) => !recommendedPlaylists?.map((p) => p.id).includes(c.id)) || []
    );
  }, [crawlContent, recommendedPlaylists]);

  // Infinite scroll for queue
  const [loadMoreRef] = useInfiniteScroll({
    hasNextPage,
    onLoadMore: fetchNextPage,
    loading: isFetchingNextPage,
  });

  // Infinite scroll for playlist queue
  const [loadMorePlaylistRef] = useInfiniteScroll({
    hasNextPage: hasNextPagePlaylist,
    onLoadMore: fetchNextPagePlaylist,
    loading: isFetchingNextPagePlaylist,
  });

  const showPlaylistQueue = filters.playlist && filters.playlist.length > 0;

  const { mutate: createContent } = useCreateContent();

  const navigate = useNavigate();
  const currentUser = useUser();

  const { platforms, categories } = useContentContext();

  const [languageSearch, setLanguageSearch] = useState('');
  const [countrySearch, setCountrySearch] = useState('');

  const { handleChange: handleChangeLanguage, value: debouncedLanguageSearch } = useDebounceSearch(
    (value) => {
      setLanguageSearch(value);
    },
    500
  );

  const { handleChange: handleChangeCountry, value: debouncedCountrySearch } = useDebounceSearch(
    (value) => {
      setCountrySearch(value);
    },
    500
  );

  const languagesQuery = useLanguages({ q: debouncedLanguageSearch });
  const countriesQuery = useCountries({ q: debouncedCountrySearch });

  const {
    data: contentDetails,
    isFetched,
    isLoading: isLoadingContentDetails,
  } = useGetDraftContentDetails(Number(contentId));
  const firstFetch = useRef(false);

  const mergeContent = useMemo(() => {
    return [...(recommendedPlaylists || []), ...(filteredCrawlContent || [])];
  }, [recommendedPlaylists, filteredCrawlContent]);

  useEffect(() => {
    if (!mergeContent || !contentDetails || firstFetch.current) return;

    const foundItem = mergeContent?.some((c) => c.id === contentDetails.id);

    if (foundItem) {
      const activeItem = document.querySelector('.queue-item-active');
      const queueList = document.querySelector('.queue-list');

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

    if (hasNextPagePlaylist) {
      fetchNextPagePlaylist();
      return;
    }
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [
    contentDetails,
    hasNextPage,
    mergeContent,
    isFetched,
    hasNextPagePlaylist,
    fetchNextPage,
    fetchNextPagePlaylist,
    isFetchingNextPagePlaylist,
    isFetchingNextPage,
  ]);

  const { register, handleSubmit, setValue, watch } = useForm<ContentSchema>({
    values: contentDetails
      ? {
          title: contentDetails?.title || '',
          description: contentDetails?.short_description || '',
          is_allow_comment: true,
          media: [contentDetails?.media_url || ''],
          thumbnail: contentDetails?.thumbnail_url || '',
          platforms: platforms?.map((p) => p.api_key) || [],
          status: ContentStatus.PRIVATE,
          id: contentDetails?.id || '',
          categories: [],
          crawler_id: contentDetails?.id || '',
          playlist: contentDetails?.playlist_id ? [contentDetails?.playlist_id] : [],
          language: '',
          country: [],
        }
      : undefined,
  });

  const watchPlatforms = watch('platforms');
  const watchCategories = watch('categories');
  const watchTitle = watch('title');
  const watchLanguage = watch('language');
  const watchCountry = watch('country');

  const allTags = useMemo(() => {
    return detectTags(watchTitle);
  }, [watchTitle]);

  const handleUpdateMetadata = (key: 'platforms' | 'categories' | 'country', value: any) => {
    const isExist = watch(key)?.includes(value);
    if (isExist) {
      setValue(
        key,
        watch(key)?.filter((p: any) => p !== value)
      );
    } else {
      setValue(key, [...(watch(key) || []), value]);
    }
  };

  const handleSelectLanguage = (value: string) => {
    setValue('language', value);
  };

  const renderSelectedItems = (
    items: { id: string | number; name: string; value: string }[],
    onRemove: (value: string) => void
  ) => {
    return (
      <div className="flex flex-wrap gap-1">
        {items.map((item) => (
          <Badge key={item.id} variant="default" className="flex items-center gap-1">
            {item.name}
            <X size={12} className="cursor-pointer" onClick={() => onRemove(item.value)} />
          </Badge>
        ))}
      </div>
    );
  };

  const onSubmit = (data: ContentSchema) => {
    const toastId = toast.loading(`Khởi tạo nội dung...`);
    const { id, ...rest } = data;

    createContent(
      {
        data: {
          ...rest,
          tags: allTags,
        },
      },
      {
        onSuccess: () => {
          if (!mergeContent) return;
          toast.dismiss(toastId);
          toast.success('Khởi tạo nội dung thành công');
          const itemIndex = mergeContent?.findIndex((c) => c.id === id);
          const nextItem = mergeContent?.[itemIndex + 1];
          if (nextItem) {
            navigate({
              to: '/draft/detail/$contentId',
              params: { contentId: nextItem.id },
              search: {
                playlist: filters.playlist,
                is_previewed: filters.is_previewed,
              },
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
    <div
      className={cn(
        'detail-layout animate-in fade-in p-4 duration-300 sm:p-10',
        showPlaylistQueue && 'has-playlist-queue'
      )}
    >
      {/* LEFT: QUEUE SIDEBAR */}
      <aside className="queue-sidebar flex flex-col gap-5">
        {/* LEFT: PLAYLIST QUEUE SIDEBAR */}
        {showPlaylistQueue && (
          <Queue
            title="DANH SÁCH GỢI Ý"
            queueItems={recommendedPlaylists || []}
            item={contentDetails}
            loadMoreRef={loadMorePlaylistRef}
            hasNextPage={hasNextPagePlaylist}
            isFetchingNextPage={isFetchingNextPagePlaylist}
            totalItems={totalItemsPlaylist}
            className="playlist"
          />
        )}
        <Queue
          queueItems={filteredCrawlContent}
          item={contentDetails}
          loadMoreRef={loadMoreRef}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          totalItems={totalItems}
        />
      </aside>

      {/* CENTER: VIEWPORT SECTION */}
      <section className="viewport-container group">
        <div className="shutter-frame">
          <div className="shutter-blade shutter-top" />
          <div className="shutter-blade shutter-bottom" />

          {/* UI Overlay */}
          <div className="ui-overlay">
            <div className="scanline" />
          </div>

          {/* Media Content */}
          {/* <video src={contentDetails.media_url} className="video-mock" autoPlay muted loop /> */}
          <VideoPlayer
            url={contentDetails.media_url}
            poster={contentDetails.thumbnail_url}
            title={contentDetails.title}
            aspectRatio="9/16"
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
      <form
        onSubmit={handleSubmit(onSubmit)}
        id="content-form"
        className="flex flex-col gap-4 py-4"
      >
        {/* DESCRIPTION */}
        <div className="flex flex-col gap-2">
          <Typography variant="small" className="text-muted-foreground font-medium">
            NHẬT KÝ PHIÊN DỊCH
          </Typography>
          {isEditable ? (
            <Textarea
              {...register('title')}
              value={watch('title')}
              onChange={(e) => {
                setValue('title', e.target.value, { shouldDirty: true });
              }}
              className="h-32 resize-none border border-white/10 bg-transparent p-2 transition-colors focus:border-white"
            />
          ) : (
            <p className="border border-transparent">&ldquo;{contentDetails.title}&rdquo;</p>
          )}
        </div>

        {/* TAGS */}
        <div className="flex flex-col gap-2">
          <Typography variant="small" className="text-muted-foreground font-medium">
            THẺ PHÂN LOẠI
          </Typography>
          <div className="flex flex-wrap gap-1.5">
            {!allTags?.length && <p className="text-muted-foreground">Không có thẻ phân loại</p>}
            {allTags?.map((tag: string) => (
              <Badge key={tag} variant="default">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* DISTRIBUTION NETWORKS */}
        {platforms.length > 0 ? (
          <div className="flex flex-col gap-2">
            <Typography variant="small" className="text-muted-foreground font-medium">
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
            <Typography variant="small" className="text-muted-foreground font-medium">
              DANH MỤC
            </Typography>
            <div className="flex flex-wrap gap-1">
              {categories.map((cat) => (
                <Badge
                  key={cat.id}
                  variant={watchCategories?.includes(cat.slug) ? 'default' : 'outline'}
                  onClick={() => handleUpdateMetadata('categories', cat.slug)}
                  className="cursor-pointer transition-colors"
                >
                  {cat.name}
                </Badge>
              ))}
            </div>
          </div>
        ) : (
          <FilterSkeleton count={3} />
        )}

        {/* LANGUAGES */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Typography variant="small" className="text-muted-foreground font-medium">
              NGÔN NGỮ
            </Typography>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="size-8 rounded-none">
                  <Languages size={16} />
                </Button>
              </DialogTrigger>
              <MetadataModal
                title="NGÔN NGỮ"
                searchTerm={languageSearch}
                onSearchChange={handleChangeLanguage}
                items={languagesQuery.data || []}
                selectedValues={watchLanguage || ''}
                onSelect={handleSelectLanguage}
                hasNextPage={languagesQuery.hasNextPage}
                fetchNextPage={languagesQuery.fetchNextPage}
                isFetchingNextPage={languagesQuery.isFetchingNextPage}
              />
            </Dialog>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {watchLanguage ? (
              renderSelectedItems(
                languagesQuery.data
                  .filter((l) => l.slug === watchLanguage)
                  .map((l) => ({ id: l.id, name: l.name, value: l.slug })),
                () => setValue('language', '')
              )
            ) : (
              <p className="text-muted-foreground text-xs">Chưa chọn ngôn ngữ</p>
            )}
          </div>
        </div>

        {/* COUNTRIES */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Typography variant="small" className="text-muted-foreground font-medium">
              QUỐC GIA
            </Typography>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="size-8 rounded-none">
                  <Globe size={16} />
                </Button>
              </DialogTrigger>
              <MetadataModal
                title="QUỐC GIA"
                searchTerm={countrySearch}
                onSearchChange={handleChangeCountry}
                items={countriesQuery.data || []}
                selectedValues={watchCountry || []}
                onSelect={(val) => handleUpdateMetadata('country', val)}
                multiple
                hasNextPage={countriesQuery.hasNextPage}
                fetchNextPage={countriesQuery.fetchNextPage}
                isFetchingNextPage={countriesQuery.isFetchingNextPage}
              />
            </Dialog>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {(watchCountry?.length ?? 0) > 0 ? (
              renderSelectedItems(
                countriesQuery.data
                  .filter((c) => watchCountry?.includes(c.code))
                  .map((c) => ({ id: c.id, name: c.name, value: c.code })),
                (code) => handleUpdateMetadata('country', code)
              )
            ) : (
              <p className="text-muted-foreground text-xs">Chưa chọn quốc gia</p>
            )}
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
        <div className="mt-auto flex gap-2">
          {/* <Button variant="destructive" disabled>
            TỪ CHỐI
          </Button> */}
          <Button
            className="flex-1"
            type="submit"
            variant="default"
            isLoading={contentDetails.is_pending}
            disabled={
              !watchPlatforms?.length ||
              !watchCategories?.length ||
              !watchCountry?.length ||
              !watchLanguage
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
