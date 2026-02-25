import { useEffect, useState } from 'react';

import ContentTable from '@/features/content/components/content-table';
import { ConfirmMergeModal } from '@/features/playlist/components';
import { useAddVideosToPlaylists, useCreatePlaylist } from '@/features/playlist/hooks/usePlaylist';
import { CreatePlaylistSchema } from '@/features/playlist/schema/create-playlist.schema';
import { ContentItem, ContentStatus } from '@/shared';
import { ContentGrid, ContentGridSkeleton, ContentTableSkeleton } from '@/shared/components';
import { useNavigate, useRouteContext, useSearch } from '@tanstack/react-router';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { toast } from 'sonner';
import {
  AddToPlaylistModal,
  BatchScheduleModal,
  ContentHeader,
  FloatingBatchActionBar,
  RejectConfirmationModal,
} from '../components';
import Media from '../components/media';
import {
  useApproveContents,
  useContent,
  usePublishContent,
  useRejectContents,
} from '../hooks/useContent';
import { useScheduleContent } from '../hooks/useSchedule';
import { ContentSearchSchema } from '../schemas';
import { useContentStore } from '../stores/useContentStore';
import { ApproveContentBatchPayload } from '../types';
import { checkIsPlaylistPlatform } from '../utils';

function ContentPageComponent() {
  const navigate = useNavigate();

  const filters: ContentSearchSchema = useSearch({ strict: false });

  const {
    data: items,
    isLoading,
    error: _error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isPlaceholderData,
    totalItems,
  } = useContent(filters);

  const {
    service: _service,
    currentUser: _currentUser,
    refreshData: _refreshData,
  } = useRouteContext({
    strict: false,
  });

  const { selectedIds, setSelectedIds, viewMode } = useContentStore((state) => state);

  const [isBatchRejectModalOpen, setIsBatchRejectModalOpen] = useState(false);
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] = useState(false);
  const [isConfirmAddToPlaylistModalOpen, setIsConfirmAddToPlaylistModalOpen] = useState(false);
  const [isBatchScheduleModalOpen, setIsBatchScheduleModalOpen] = useState(false);

  // Infinite scroll for Grid view
  const [loadMoreRef] = useInfiniteScroll({
    hasNextPage,
    onLoadMore: fetchNextPage,
    loading: isFetchingNextPage,
  });

  // Batch mutations
  const { mutate: approveContents, isPending: isApprovingBatch } = useApproveContents();
  const { mutate: rejectContents, isPending: isRejectingBatch } = useRejectContents();
  const { mutate: publishContents, isPending: isPublishingBatch } = usePublishContent();
  const { mutate: scheduleContents, isPending: isSchedulingBatch } = useScheduleContent();
  const { mutate: addVideosToPlaylists } = useAddVideosToPlaylists();
  const { mutate: createPlaylist } = useCreatePlaylist();

  const handleNavigateToDetail = (item: ContentItem) => {
    navigate({
      to: `${item.details_link}/$contentId`,
      params: { contentId: item.id },
      search: { approving_status: item.approving_status, playlist: item?.playlist_id || undefined },
    });
  };

  const handleToggleSelect = (id: string) => {
    const isExists = selectedIds.includes(id);
    if (isExists) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSelectAll = (visibleItems: ContentItem[]) => {
    // Only select pending items
    const visibleIds = visibleItems.map((i) => i.id);

    if (visibleIds.every((id) => selectedIds.includes(id.toString()))) {
      setSelectedIds(selectedIds.filter((id) => !visibleIds.includes(id.toString())));
    } else {
      const newSelection = new Set([...selectedIds, ...visibleIds]);
      setSelectedIds(Array.from(newSelection).map((id) => id.toString()));
    }
  };

  const handleBatchApprove = () => {
    const eligibleApprovals = items?.filter(
      (item: ContentItem) =>
        selectedIds.includes(item.id) &&
        (item.approving_status === ContentStatus.PENDING_REVIEW ||
          item.approving_status === ContentStatus.REJECTED)
    );

    if (!eligibleApprovals || eligibleApprovals.length === 0) {
      toast.error('KHÔNG CÓ NỘI DUNG HỢP LỆ', {
        description: 'Chỉ có thể duyệt nội dung ở trạng thái CHỜ DUYỆT hoặc ĐÃ TỪ CHỐI',
      });
      return;
    }

    const toastId = toast.loading(`Đang duyệt ${eligibleApprovals.length} nội dung...`);

    const reelIds = eligibleApprovals.map((item) => ({
      reel_id: item.id,
    }));

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
    const eligibleRejections = items?.filter(
      (item: ContentItem) =>
        selectedIds.includes(item.id) && item.status === ContentStatus.PENDING_REVIEW
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
    const eligibleRejections = items?.filter(
      (item: ContentItem) =>
        selectedIds.includes(item.id) && item.status === ContentStatus.PENDING_REVIEW
    );

    if (!eligibleRejections || eligibleRejections.length === 0) return;

    const toastId = toast.loading(`Đang từ chối ${eligibleRejections.length} nội dung...`);

    rejectContents(
      {
        reel_ids: eligibleRejections.map((item) => item.id),
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

  const handleBatchPublish = () => {
    const eligiblePublish = items?.filter(
      (item: ContentItem) =>
        selectedIds.includes(item.id) &&
        (item.approving_status === ContentStatus.APPROVED ||
          item.approving_status === ContentStatus.SCHEDULED)
    );

    if (!eligiblePublish || eligiblePublish.length === 0) {
      toast.error('KHÔNG CÓ NỘI DUNG HỢP LỆ', {
        description: 'Chỉ có thể đăng nội dung ở trạng thái ĐÃ DUYỆT hoặc ĐÃ LÊN LỊCH',
      });
      return;
    }

    const toastId = toast.loading(`Đang đăng ${eligiblePublish.length} nội dung...`);

    publishContents(
      {
        reel_ids: eligiblePublish.map((item) => item.id),
      },
      {
        onSuccess: () => {
          toast.dismiss(toastId);
          toast.success('ĐĂNG THÀNH CÔNG', {
            description: `Đã đăng ${eligiblePublish.length} nội dung`,
          });
          setSelectedIds([]);
        },
        onError: () => {
          toast.dismiss(toastId);
          toast.error('ĐĂNG THẤT BẠI', {
            description: 'Không thể đăng nội dung. Vui lòng thử lại.',
          });
        },
      }
    );
  };

  const handleBatchSchedule = (scheduledTime: string) => {
    const eligibleSchedule = items?.filter(
      (item: ContentItem) =>
        selectedIds.includes(item.id) &&
        (item.approving_status === ContentStatus.APPROVED ||
          item.approving_status === ContentStatus.SCHEDULED)
    );

    if (!eligibleSchedule || eligibleSchedule.length === 0) {
      toast.error('KHÔNG CÓ NỘI DUNG HỢP LỆ', {
        description: 'Chỉ có thể lên lịch nội dung ở trạng thái ĐÃ DUYỆT hoặc ĐÃ LÊN LỊCH',
      });
      return;
    }

    const toastId = toast.loading(`Đang lên lịch ${eligibleSchedule.length} nội dung...`);

    scheduleContents(
      {
        schedules: eligibleSchedule.map((item) => ({
          reel_id: item.id,
          scheduled_at: scheduledTime,
        })),
        approving_status: filters.approving_status || ContentStatus.APPROVED,
      },
      {
        onSuccess: () => {
          toast.dismiss(toastId);
          toast.success('LÊN LỊCH THÀNH CÔNG', {
            description: `Đã lên lịch ${eligibleSchedule.length} nội dung`,
          });
          setSelectedIds([]);
          setIsBatchScheduleModalOpen(false);
        },
        onError: () => {
          toast.dismiss(toastId);
          toast.error('LÊN LỊCH THẤT BẠI', {
            description: 'Không thể lên lịch nội dung. Vui lòng thử lại.',
          });
        },
      }
    );
  };

  // Add to Playlist handlers
  const handleOpenAddToPlaylist = () => {
    if (selectedIds.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 video');
      return;
    }

    // Check if all selected videos are published
    const selectedItems = items?.filter((item) => selectedIds.includes(item.id)) || [];
    const hasNonPublished = selectedItems.some(
      (item) => item.approving_status !== ContentStatus.PUBLISHED
    );

    if (hasNonPublished) {
      toast.error('Chỉ có thể thêm video đã đăng vào playlist');
      return;
    }

    setIsAddToPlaylistModalOpen(true);
  };

  const [selectedPlaylistIds, setSelectedPlaylistIds] = useState<string[]>([]);
  const handleToggleSelectPlaylist = (playlistId: string) => {
    const isExists = selectedPlaylistIds.includes(playlistId);
    if (isExists) {
      setSelectedPlaylistIds(selectedPlaylistIds.filter((id) => id !== playlistId));
    } else {
      setSelectedPlaylistIds([...selectedPlaylistIds, playlistId]);
    }
  };

  const addToPlaylist = (isMergedPlatforms: boolean) => {
    // Add each selected video to the playlist
    const totalCount = selectedIds.length;

    addVideosToPlaylists(
      {
        payload: {
          video_ids: selectedIds,
          playlist_ids: selectedPlaylistIds,
          is_merged_platforms: isMergedPlatforms,
        },
      },
      {
        onSuccess: () => {
          // Show toast only after last video
          toast.success(`Đã thêm ${totalCount} video vào playlist`);
          setSelectedIds([]);
          setSelectedPlaylistIds([]);
        },
        onError: () => {
          // Show toast only after last video
          toast.error('Thêm video vào playlist thất bại');
        },
      }
    );
  };

  const handleAddToPlaylist = () => {
    const selectedItems = items?.filter((item) => selectedIds.includes(item.id)) || [];
    const isMergedPlatforms = checkIsPlaylistPlatform(selectedItems);
    if (isMergedPlatforms) {
      setIsConfirmAddToPlaylistModalOpen(true);
    } else {
      addToPlaylist(isMergedPlatforms);
    }
  };

  const handleConfirmAddToPlaylist = () => {
    addToPlaylist(true);
    setIsConfirmAddToPlaylistModalOpen(false);
  };

  const handleCreatePlaylistWithVideos = (data: CreatePlaylistSchema) => {
    createPlaylist(
      {
        name: data.name,
        description: data.description,
        video_ids: data.video_ids,
        thumbnail: data.thumbnail,
      },
      {
        onSuccess: () => {
          setSelectedIds([]);
          setSelectedPlaylistIds([]);
          toast.success(`Đã tạo playlist ${data.name}`);
        },
        onError: () => {
          toast.error('Tạo playlist thất bại');
        },
      }
    );
  };

  useEffect(() => {
    return () => {
      setSelectedIds([]);
    };
  }, []);

  const canSelect = filters.approving_status !== '';

  return (
    <div className="relative flex h-full flex-col space-y-8 p-4 sm:p-10">
      <ContentHeader totalItems={totalItems} />
      {isLoading && viewMode === 'table' && <ContentTableSkeleton rows={10} />}
      {isLoading && viewMode === 'grid' && <ContentGridSkeleton count={12} />}

      {!isLoading && viewMode === 'table' && (
        <ContentTable
          items={items || []}
          onView={handleNavigateToDetail}
          selectedIds={selectedIds}
          onToggleSelect={canSelect ? handleToggleSelect : undefined}
          onToggleAll={canSelect ? () => handleSelectAll(items || []) : undefined}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          loadMoreRef={loadMoreRef}
          isPlaceholderData={isPlaceholderData}
        />
      )}

      {!isLoading && viewMode === 'grid' && (
        <ContentGrid
          isEmpty={items?.length === 0}
          loadMoreRef={loadMoreRef}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          isPlaceholderData={isPlaceholderData}
        >
          {items?.map((item: ContentItem) => {
            return (
              <Media
                item={item}
                onView={() => handleNavigateToDetail(item)}
                isSelected={selectedIds.includes(item.id)}
                onToggleSelect={canSelect ? handleToggleSelect : undefined}
                key={item.content_id}
              />
            );
          })}
        </ContentGrid>
      )}

      {/* Floating Batch Action Bar */}
      {selectedIds.length > 0 && (
        <FloatingBatchActionBar
          approvingStatus={filters.approving_status as ContentStatus}
          selectedCount={selectedIds.length}
          isApproving={isApprovingBatch}
          isRejecting={isRejectingBatch}
          isPublishing={isPublishingBatch}
          isScheduling={isSchedulingBatch}
          onApprove={handleBatchApprove}
          onReject={handleBatchReject}
          onPublish={handleBatchPublish}
          onSchedule={() => setIsBatchScheduleModalOpen(true)}
          onCancel={() => {
            setSelectedIds([]);
          }}
          // Add to Playlist action (only for PUBLISHED status)
          onAddToPlaylist={
            filters.approving_status === ContentStatus.PUBLISHED
              ? handleOpenAddToPlaylist
              : undefined
          }
        />
      )}

      {/* Batch Reject Confirmation Modal */}
      <RejectConfirmationModal
        isOpen={isBatchRejectModalOpen}
        onClose={() => setIsBatchRejectModalOpen(false)}
        onConfirm={handleConfirmBatchReject}
      />

      {/* Add to Playlist Modal */}
      <AddToPlaylistModal
        isOpen={isAddToPlaylistModalOpen}
        onClose={() => setIsAddToPlaylistModalOpen(false)}
        onAddToPlaylist={handleAddToPlaylist}
        selectedPlaylistIds={selectedPlaylistIds}
        onToggleSelectPlaylist={handleToggleSelectPlaylist}
        onCreatePlaylist={handleCreatePlaylistWithVideos}
        selectedCount={selectedIds.length}
        selectedVideoIds={selectedIds}
      />

      {/* Confirm Add to Playlist Modal */}
      <ConfirmMergeModal
        isOpen={isConfirmAddToPlaylistModalOpen}
        onClose={() => setIsConfirmAddToPlaylistModalOpen(false)}
        onConfirm={handleConfirmAddToPlaylist}
      />

      {/* Batch Schedule Modal */}
      <BatchScheduleModal
        isOpen={isBatchScheduleModalOpen}
        onClose={() => setIsBatchScheduleModalOpen(false)}
        onConfirm={handleBatchSchedule}
        selectedCount={selectedIds.length}
        defaultDate={items?.find((item) => selectedIds.includes(item.id))?.scheduled_at}
      />
    </div>
  );
}

export default ContentPageComponent;
