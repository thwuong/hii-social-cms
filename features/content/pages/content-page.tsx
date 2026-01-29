import { useState } from 'react';

import ContentTable from '@/features/content/components/content-table';
import { ApproveContentBatchPayload, ContentItem, ContentStatus } from '@/features/content/types';
import { ContentGrid, ContentGridSkeleton, ContentTableSkeleton } from '@/shared/components';
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';
import { useNavigate, useRouteContext, useSearch } from '@tanstack/react-router';
import { toast } from 'sonner';
import {
  ContentHeader,
  FloatingBatchActionBar,
  RejectConfirmationModal,
  useContentContext,
} from '../components';
import Media from '../components/media';
import { useApproveContents, useContent, useRejectContents } from '../hooks/useContent';
import { ContentSearchSchema } from '../schemas';
import { useContentStore } from '../stores/useContentStore';

function ContentPageComponent() {
  const navigate = useNavigate();

  const {
    data: items,
    isLoading,
    error: _error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useContent();

  // Infinite scroll
  const loadMoreRef = useInfiniteScroll({
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    threshold: 300,
  });

  const {
    service: _service,
    currentUser: _currentUser,
    refreshData: _refreshData,
  } = useRouteContext({
    strict: false,
  });

  const { categories } = useContentContext();
  const filters: ContentSearchSchema = useSearch({ strict: false });

  const { selectedIds, setSelectedIds, viewMode } = useContentStore((state) => state);

  const [isBatchRejectModalOpen, setIsBatchRejectModalOpen] = useState(false);

  // Batch mutations
  const { mutate: approveContents, isPending: isApprovingBatch } = useApproveContents();
  const { mutate: rejectContents, isPending: isRejectingBatch } = useRejectContents();

  const handleNavigateToDetail = (item: ContentItem) => {
    navigate({
      to: `${item.details_link}/$contentId`,
      params: { contentId: item.id },
      search: { approving_status: item.approving_status },
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

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleBatchApprove = () => {
    const eligibleApprovals = items?.filter((item: ContentItem) => selectedIds.includes(item.id));

    if (!eligibleApprovals || eligibleApprovals.length === 0) {
      toast.error('KHÔNG CÓ NỘI DUNG HỢP LỆ', {
        description: 'Chỉ có thể duyệt nội dung ở trạng thái CHỜ DUYỆT',
      });
      return;
    }

    const toastId = toast.loading(`Đang duyệt ${eligibleApprovals.length} nội dung...`);

    const reelIds = eligibleApprovals.map((item) => ({
      reel_id: item.id,
      categories: selectedCategories,
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
        selectedIds.includes(item.id) &&
        (item.status === ContentStatus.PENDING_REVIEW || item.status === ContentStatus.APPROVED)
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
        selectedIds.includes(item.id) &&
        (item.status === ContentStatus.PENDING_REVIEW || item.status === ContentStatus.APPROVED)
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

  // Count items eligible for approve (PENDING_REVIEW only)
  const batchApproveCount = items?.filter((i: ContentItem) => selectedIds.includes(i.id)).length;

  // Count items eligible for reject (PENDING_REVIEW or APPROVED)
  const batchRejectCount = items?.filter((i: ContentItem) => selectedIds.includes(i.id)).length;

  return (
    <div className="relative space-y-8">
      <ContentHeader />
      {isLoading && viewMode === 'table' && <ContentTableSkeleton rows={10} />}
      {isLoading && viewMode === 'grid' && <ContentGridSkeleton count={12} />}

      {!isLoading && viewMode === 'table' && (
        <ContentTable
          items={items || []}
          onView={handleNavigateToDetail}
          selectedIds={selectedIds}
          onToggleSelect={
            filters.approving_status === ContentStatus.PENDING_REVIEW
              ? handleToggleSelect
              : undefined
          }
          onToggleAll={
            filters.approving_status === ContentStatus.PENDING_REVIEW
              ? () => handleSelectAll(items || [])
              : undefined
          }
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      )}

      {!isLoading && viewMode === 'grid' && (
        <ContentGrid
          isEmpty={items?.length === 0}
          loadMoreRef={loadMoreRef}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        >
          {items?.map((item: ContentItem) => {
            const isPending = item.status === ContentStatus.PENDING_REVIEW;
            return (
              <Media
                item={item}
                onView={() => handleNavigateToDetail(item)}
                isSelected={selectedIds.includes(item.id)}
                onToggleSelect={isPending ? handleToggleSelect : undefined}
                key={item.content_id}
              />
            );
          })}
        </ContentGrid>
      )}

      {/* Floating Batch Action Bar */}
      <FloatingBatchActionBar
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
        showCategorySelector
        onCategoriesChange={(cats: string[]) => setSelectedCategories(cats)}
        selectedCategories={selectedCategories}
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

export default ContentPageComponent;
