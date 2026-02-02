import { useState } from 'react';

import Media from '@/features/content/components/media';
import { ContentItem } from '@/shared';
import { ContentGridSkeleton, ContentTableSkeleton } from '@/shared/components';
import ContentGrid from '@/shared/components/content-grid';
import { Button } from '@/shared/ui';
import { useNavigate } from '@tanstack/react-router';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { toast } from 'sonner';
import { DraftContentTable, RejectConfirmationModal } from '../components';
import DraftContentHeader from '../components/draft-content-header';
import { useDraftContent, useMakeDraftContentPreview } from '../hooks/useDraftContent';
import { useDraftContentStore } from '../stores/useDraftContentStore';

function ContentCrawlPageComponent() {
  const navigate = useNavigate();

  const {
    data: crawlContent,
    isLoading: _isLoadingCrawlContent,
    error: _errorCrawlContent,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useDraftContent();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Infinite scroll for Grid view only
  const [loadMoreRef] = useInfiniteScroll({
    hasNextPage,
    onLoadMore: fetchNextPage,
    loading: isFetchingNextPage,
  });
  const [isBatchRejectModalOpen, setIsBatchRejectModalOpen] = useState(false);

  const { viewMode } = useDraftContentStore();

  const { mutate: makeDraftContentPreview } = useMakeDraftContentPreview();

  const handleNavigateToDetail = (item: ContentItem) => {
    makeDraftContentPreview({
      payload: {
        is_previewed: true,
        message: 'Ok',
        video_id: Number(item.id),
      },
      video_id: Number(item.id),
    });
    navigate({
      to: `${item.details_link}/$contentId`,
      params: { contentId: item.id },
    });
  };

  const handleBatchApprove = () => {
    const eligibleApprovals = crawlContent.filter((item: ContentItem) =>
      selectedIds.includes(item.id)
    );

    if (eligibleApprovals.length === 0) {
      toast.error('KHÔNG CÓ NỘI DUNG HỢP LỆ', {
        description: 'Vui lòng chọn ít nhất một nội dung để duyệt',
      });
      return;
    }

    const toastId = toast.loading(`Đang duyệt ${eligibleApprovals.length} video...`);

    // Make all videos as previewed (approve for crawl)
    const promises = eligibleApprovals.map((item: ContentItem) =>
      makeDraftContentPreview({
        payload: {
          is_previewed: true,
          message: 'Approved by admin',
          video_id: Number(item.id),
        },
        video_id: Number(item.id),
      })
    );

    Promise.all(promises)
      .then(() => {
        toast.dismiss(toastId);
        toast.success('DUYỆT THÀNH CÔNG', {
          description: `Đã duyệt ${eligibleApprovals.length} video`,
        });
        setSelectedIds([]);
      })
      .catch(() => {
        toast.dismiss(toastId);
        toast.error('DUYỆT THẤT BẠI', {
          description: 'Không thể duyệt video. Vui lòng thử lại.',
        });
      });
  };

  const handleBatchReject = () => {
    const eligibleRejections = crawlContent.filter((item: ContentItem) =>
      selectedIds.includes(item.id)
    );

    if (eligibleRejections.length === 0) {
      toast.error('KHÔNG CÓ NỘI DUNG HỢP LỆ', {
        description: 'Vui lòng chọn ít nhất một nội dung để từ chối',
      });
      return;
    }

    // Show confirmation modal
    setIsBatchRejectModalOpen(true);
  };

  const handleConfirmBatchReject = (reason: string) => {
    const eligibleRejections = crawlContent.filter((item: ContentItem) =>
      selectedIds.includes(item.id)
    );

    if (eligibleRejections.length === 0) return;

    const toastId = toast.loading(`Đang từ chối ${eligibleRejections.length} video...`);

    // Make all videos as rejected
    const promises = eligibleRejections.map((item: ContentItem) =>
      makeDraftContentPreview({
        payload: {
          is_previewed: false,
          message: reason,
          video_id: Number(item.id),
        },
        video_id: Number(item.id),
      })
    );

    Promise.all(promises)
      .then(() => {
        toast.dismiss(toastId);
        toast.success('TỪ CHỐI THÀNH CÔNG', {
          description: `Đã từ chối ${eligibleRejections.length} video`,
        });
        setSelectedIds([]);
        setIsBatchRejectModalOpen(false);
      })
      .catch(() => {
        toast.dismiss(toastId);
        toast.error('TỪ CHỐI THẤT BẠI', {
          description: 'Không thể từ chối video. Vui lòng thử lại.',
        });
      });
  };

  // Count selected items for approve/reject
  const batchApproveCount = crawlContent.filter((i: ContentItem) =>
    selectedIds.includes(i.id)
  ).length;
  const batchRejectCount = batchApproveCount; // Same for crawl page

  return (
    <div className="relative flex h-full flex-col space-y-8 p-4 sm:p-10">
      <DraftContentHeader />

      {_isLoadingCrawlContent && viewMode === 'table' && <ContentTableSkeleton rows={10} />}
      {_isLoadingCrawlContent && viewMode === 'grid' && <ContentGridSkeleton count={12} />}
      {!_isLoadingCrawlContent && viewMode === 'table' && (
        <DraftContentTable
          items={crawlContent}
          onView={handleNavigateToDetail}
          selectedIds={selectedIds}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          loadMoreRef={loadMoreRef}
        />
      )}
      {!_isLoadingCrawlContent && viewMode === 'grid' && (
        <ContentGrid
          isEmpty={crawlContent.length === 0}
          loadMoreRef={loadMoreRef}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        >
          {crawlContent.map((item) => {
            return (
              <Media
                item={item}
                onView={() => handleNavigateToDetail(item)}
                isSelected={selectedIds.includes(item.id)}
                key={item.content_id}
              />
            );
          })}
        </ContentGrid>
      )}

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
            className="h-8 bg-white text-black hover:bg-zinc-200"
            onClick={handleBatchApprove}
            disabled={batchApproveCount === 0}
          >
            DUYỆT ({batchApproveCount || 0})
          </Button>

          {/* Reject Button */}
          <Button
            variant="destructive"
            className="h-8"
            onClick={handleBatchReject}
            disabled={batchRejectCount === 0}
          >
            TỪ CHỐI ({batchRejectCount || 0})
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

      {/* Batch Reject Confirmation Modal */}
      <RejectConfirmationModal
        isOpen={isBatchRejectModalOpen}
        onClose={() => setIsBatchRejectModalOpen(false)}
        onConfirm={handleConfirmBatchReject}
      />
    </div>
  );
}

export default ContentCrawlPageComponent;
