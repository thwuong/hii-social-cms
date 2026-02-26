import { queryClient } from '@/lib';
import { Permission, STATUS_LABELS } from '@/shared';
import { DetailPageSkeleton, PermissionGate, QueueSkeleton } from '@/shared/components';
import { useDebounceSearch } from '@/shared/hooks/use-debounce-search';
import { usePermission } from '@/shared/hooks/use-permission';
import { ContentStatus } from '@/shared/types';
import { Badge, Button, Dialog, DialogTrigger, Textarea, Typography } from '@/shared/ui';
import { useNavigate, useParams, useSearch } from '@tanstack/react-router';
import { formatDate } from 'date-fns';
import { AlertTriangle, Clock, Globe, Languages, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { toast } from 'sonner';
import {
  ContentBody,
  MetadataModal,
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
  useContentInPlaylist,
  usePublishContent,
  useRejectContents,
} from '../hooks/useContent';
import { useCountries } from '../hooks/useCountry';
import { useLanguages } from '../hooks/useLanguage';
import { useScheduleContent } from '../hooks/useSchedule';
import { queryKeys } from '../query-keys';
import { ContentDetailSearchSchema, UpdateReelSchema } from '../schemas';
import { useContentStore } from '../stores/useContentStore';
import { detectTags } from '../utils';

function DetailPageComponent() {
  const { contentId } = useParams({ strict: false });
  const searchParams: ContentDetailSearchSchema = useSearch({ strict: false });
  const { playlist, ...restSearchParams } = searchParams;

  const {
    data: realContent,
    isLoading: isLoadingCrawlContent,
    error: _errorCrawlContent,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    totalItems,
  } = useContent({
    ...restSearchParams,
    approving_status: searchParams?.approving_status as string,
  });

  const {
    data: contentInPlaylist,
    isLoading: isLoadingContentInPlaylist,
    error: _errorContentInPlaylist,
    fetchNextPage: fetchNextPageContentInPlaylist,
    hasNextPage: hasNextPageContentInPlaylist,
    isFetchingNextPage: isFetchingNextPageContentInPlaylist,
    totalItems: totalItemsContentInPlaylist,
  } = useContentInPlaylist({
    ...searchParams,
    approving_status: searchParams?.approving_status as string,
    playlist,
  });

  // Mutate
  const { mutate: rejectContents } = useRejectContents();
  const { mutate: scheduleContent } = useScheduleContent();
  const { mutate: publishContent } = usePublishContent();
  const { mutate: approveContent, isPending: isApprovingContent } = useApproveContent();
  // Store
  const { selectedIds, setSelectedIds } = useContentStore((state) => state);

  const [loadMoreRef] = useInfiniteScroll({
    hasNextPage,
    onLoadMore: fetchNextPage,
    loading: isFetchingNextPage,
  });

  const [loadMoreRefContentInPlaylist] = useInfiniteScroll({
    hasNextPage: hasNextPageContentInPlaylist,
    onLoadMore: fetchNextPageContentInPlaylist,
    loading: isFetchingNextPageContentInPlaylist,
  });

  const {
    data: item,
    isLoading: isLoadingContentDetails,
    isFetched,
  } = useContentDetails({
    id: contentId,
    approving_status: searchParams?.approving_status as string,
  });

  const contentIgnoreInPlaylist = useMemo(() => {
    return realContent?.filter(
      (c) => !contentInPlaylist?.map((content) => content.id).includes(c.id)
    );
  }, [realContent, item]);

  const mergeContent = useMemo(() => {
    return [...(contentInPlaylist || []), ...(contentIgnoreInPlaylist || [])];
  }, [contentIgnoreInPlaylist, contentInPlaylist]);

  const firstFetch = useRef(false);

  useEffect(() => {
    if (!mergeContent || !item || firstFetch.current) return;

    const foundItem = mergeContent.some((c) => {
      return c.id === item.id;
    });
    if (foundItem) {
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

    if (hasNextPageContentInPlaylist) {
      fetchNextPageContentInPlaylist();
      return;
    }

    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [
    item,
    mergeContent,
    hasNextPage,
    fetchNextPage,
    isFetched,
    fetchNextPageContentInPlaylist,
    hasNextPageContentInPlaylist,
    isFetchingNextPage,
  ]);

  const navigate = useNavigate();

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isBatchRejectModalOpen, setIsBatchRejectModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [_pendingRejectId, setPendingRejectId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { dirtyFields },
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
          country: item?.country || [],
          language: item?.language,
        }
      : undefined,
  });

  const { categories, platforms } = useContentContext();

  const watchTitle = watch('title');
  const watchPlatforms = watch('platforms');
  const watchCategories = watch('categories');
  const watchCountry = watch('country');
  const watchLanguage = watch('language');
  // const watchIsAllowComment = watch('is_allow_comment');
  const watchTags = useMemo(() => {
    return detectTags(watchTitle);
  }, [watchTitle]);
  const [scheduleAt, setScheduleAt] = useState<string | undefined>();

  useEffect(() => {
    setScheduleAt(item?.scheduled_at);
  }, [item]);

  const handleChangeMetadata = (key: 'platforms' | 'categories' | 'country', value: any) => {
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
      tags: watchTags.length > 0 ? watchTags : undefined,
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
        country: watchCountry,
        language: watchLanguage,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: queryKeys.content.inPlaylist({
              ...searchParams,
              approving_status: searchParams?.approving_status as string,
              playlist,
            }),
          });
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
          queryClient.invalidateQueries({
            queryKey: queryKeys.content.inPlaylist({
              ...searchParams,
              approving_status: searchParams?.approving_status as string,
              playlist,
            }),
          });
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
            queryClient.invalidateQueries({
              queryKey: queryKeys.content.inPlaylist({
                ...searchParams,
                approving_status: searchParams?.approving_status as string,
                playlist,
              }),
            });
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
          queryClient.invalidateQueries({
            queryKey: queryKeys.content.inPlaylist({
              ...searchParams,
              approving_status: searchParams?.approving_status as string,
              playlist,
            }),
          });
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
    setScheduleAt(scheduledTime);

    scheduleContent(
      {
        schedules: [
          {
            reel_id: item.id,
            scheduled_at: scheduledTime,
          },
        ],
        approving_status: searchParams?.approving_status as string,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: queryKeys.content.inPlaylist({
              ...searchParams,
              approving_status: searchParams?.approving_status as string,
              playlist,
            }),
          });
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

  const workflowSteps = [
    { id: ContentStatus.PENDING_REVIEW, label: STATUS_LABELS[ContentStatus.PENDING_REVIEW] },
    { id: ContentStatus.APPROVED, label: STATUS_LABELS[ContentStatus.APPROVED] },
    { id: ContentStatus.SCHEDULED, label: STATUS_LABELS[ContentStatus.SCHEDULED] },
    { id: ContentStatus.PUBLISHED, label: STATUS_LABELS[ContentStatus.PUBLISHED] },
  ];

  const currentStepIndex = workflowSteps.findIndex((s) => s.id === item?.status);
  const isRejected = item?.status === ContentStatus.REJECTED;
  const isArchived = item?.status === ContentStatus.ARCHIVED;

  const aprovePermission = usePermission(Permission.REELS_APPROVE);
  const rejectPermission = usePermission(Permission.REELS_REJECT);
  const canEdit =
    (item?.status === ContentStatus.PENDING_REVIEW || item?.status === ContentStatus.REJECTED) &&
    aprovePermission &&
    rejectPermission;

  const categoryList = useMemo(() => {
    if (!canEdit) return item?.categories;
    return categories.map((category) => category.slug);
  }, [canEdit, item?.categories]);
  const platformList = useMemo(() => {
    if (!canEdit) return item?.target_platforms;
    return platforms.map((platform) => platform.api_key);
  }, [canEdit, item?.target_platforms]);

  const renderSelectedItems = (
    items: { id: string | number; name: string; value: string }[],
    onRemove: (value: string) => void
  ) => {
    return (
      <div className="flex flex-wrap gap-1">
        {items.map((itemData) => (
          <Badge key={itemData.id} variant="default" className="flex items-center gap-1">
            {itemData.name}
            {canEdit && (
              <X size={12} className="cursor-pointer" onClick={() => onRemove(itemData.value)} />
            )}
          </Badge>
        ))}
      </div>
    );
  };

  let activeIndex = currentStepIndex;
  if (isRejected) activeIndex = 1;
  if (isArchived) activeIndex = 5;

  if (isLoadingContentDetails) {
    return <DetailPageSkeleton />;
  }
  if (!item) {
    return <EmptyDetailPage />;
  }
  return (
    <div className="detail-layout animate-in fade-in p-4 duration-300 sm:p-10">
      {/* LEFT: QUEUE SIDEBAR */}
      <aside className="queue-sidebar">
        {isLoadingContentInPlaylist ? (
          <QueueSkeleton count={12} />
        ) : (
          !!contentInPlaylist.length && (
            <Queue
              title="Danh sách gợi ý"
              totalItems={totalItemsContentInPlaylist}
              queueItems={contentInPlaylist || []}
              item={item}
              hasNextPage={hasNextPageContentInPlaylist}
              isFetchingNextPage={isFetchingNextPageContentInPlaylist}
              loadMoreRef={loadMoreRefContentInPlaylist}
            />
          )
        )}
        {isLoadingCrawlContent ? (
          <QueueSkeleton count={12} />
        ) : (
          <Queue
            totalItems={totalItems - totalItemsContentInPlaylist}
            queueItems={contentIgnoreInPlaylist || []}
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
                <Badge key={tag} variant="default">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* DISTRIBUTION NETWORKS */}
        {!!platformList && (
          <div className="flex flex-col gap-2">
            <Typography variant="small" className="text-muted-foreground font-medium">
              MẠNG LƯỚI PHÂN PHỐI
            </Typography>
            <div className="flex flex-wrap gap-1.5">
              {platformList.map((platform) => (
                <Badge
                  variant={watchPlatforms?.includes(platform) ? 'default' : 'outline'}
                  key={platform}
                  onClick={canEdit ? () => handleChangeMetadata('platforms', platform) : undefined}
                  className={canEdit ? 'cursor-pointer' : ''}
                >
                  <Globe size={10} />
                  {platform}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* CATEGORIES */}
        {!!categoryList?.length && (
          <div className="flex flex-col gap-2">
            <Typography variant="small" className="text-muted-foreground font-medium">
              DANH MỤC
            </Typography>
            <div className="flex flex-wrap gap-1.5">
              {categoryList.map((category) => (
                <Badge
                  variant={watchCategories?.includes(category) ? 'default' : 'outline'}
                  key={category}
                  onClick={canEdit ? () => handleChangeMetadata('categories', category) : undefined}
                  className={canEdit ? 'cursor-pointer' : ''}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* LANGUAGES */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Typography variant="small" className="text-muted-foreground font-medium">
              NGÔN NGỮ
            </Typography>
            {canEdit && (
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
                  onSelect={(val) => setValue('language', val, { shouldDirty: true })}
                  hasNextPage={languagesQuery.hasNextPage}
                  fetchNextPage={languagesQuery.fetchNextPage}
                  isFetchingNextPage={languagesQuery.isFetchingNextPage}
                />
              </Dialog>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {watchLanguage ? (
              renderSelectedItems(
                languagesQuery.data
                  .filter((l) => l.slug === watchLanguage)
                  .map((l) => ({ id: l.id, name: l.name, value: l.slug })),
                () => setValue('language', '', { shouldDirty: true })
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
            {canEdit && (
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
                  onSelect={(val) => handleChangeMetadata('country', val)}
                  multiple
                  hasNextPage={countriesQuery.hasNextPage}
                  fetchNextPage={countriesQuery.fetchNextPage}
                  isFetchingNextPage={countriesQuery.isFetchingNextPage}
                />
              </Dialog>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {(watchCountry?.length ?? 0) > 0 ? (
              renderSelectedItems(
                countriesQuery.data
                  .filter((c) => watchCountry?.includes(c.code))
                  .map((c) => ({ id: c.id, name: c.name, value: c.code })),
                (code) => handleChangeMetadata('country', code)
              )
            ) : (
              <p className="text-muted-foreground text-xs">Chưa chọn quốc gia</p>
            )}
          </div>
        </div>

        {/* WORKFLOW STATUS PROGRESS */}
        <WorkflowSteps
          isRejected={isRejected}
          item={item}
          workflowSteps={workflowSteps}
          activeIndex={activeIndex}
        />

        {/* ACTIONS */}
        <div className="mt-auto flex flex-col gap-3">
          {scheduleAt && (
            <div className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 p-2 text-pretty">
              <Clock size={16} />
              <Typography variant="small">
                Nội dung sẽ được đăng vào lúc: {formatDate(scheduleAt, 'dd/MM/yyyy HH:mm')}
              </Typography>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {canEdit && (
              <PermissionGate permission={Permission.REELS_REJECT}>
                <Button
                  variant="destructive"
                  onClick={() => handleUpdateStatus(ContentStatus.REJECTED)}
                  isLoading={item.is_pending}
                  disabled={isRejected}
                  className="flex-1"
                >
                  TỪ CHỐI
                </Button>
              </PermissionGate>
            )}
            {(item.status === ContentStatus.APPROVED ||
              item.status === ContentStatus.SCHEDULED) && (
              <PermissionGate permission={Permission.REELS_SCHEDULE}>
                <Button
                  variant="outline"
                  onClick={() => setIsScheduleModalOpen(true)}
                  isLoading={item.is_pending}
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  {item.status === ContentStatus.SCHEDULED ? 'Cập nhật lịch' : 'Lên lịch'}
                </Button>
              </PermissionGate>
            )}
            {(item.status === ContentStatus.APPROVED ||
              item.status === ContentStatus.SCHEDULED) && (
              <PermissionGate permission={Permission.REELS_PUBLISH}>
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={() => handleUpdateStatus(ContentStatus.PUBLISHED)}
                  disabled={item.is_pending}
                >
                  Đăng ngay
                </Button>
              </PermissionGate>
            )}
            {canEdit && (
              <PermissionGate permission={Permission.REELS_APPROVE}>
                <Button
                  variant="default"
                  type="submit"
                  disabled={item.is_pending}
                  className="flex-1"
                >
                  {isApprovingContent ? 'ĐANG DUYỆT...' : 'DUYỆT'}
                </Button>
              </PermissionGate>
            )}
          </div>
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
