import { Filter, LayoutGrid, Rows, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import Media from '@/features/content/components/media';
import { ContentItem } from '@/features/content/types';
import { ContentGridSkeleton, ContentTableSkeleton } from '@/shared/components';
import ContentGrid from '@/shared/components/content-grid';
import { useInfiniteScroll } from '@/shared/hooks';
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Typography,
} from '@/shared/ui';
import { useNavigate } from '@tanstack/react-router';
import { debounce } from 'lodash';
import { toast } from 'sonner';
import { ContentTable, RejectConfirmationModal } from '../components';
import { useCrawlContent, useMakeVideoCrawler } from '../hooks/useCrawlContent';
import { useCrawlStore } from '../stores/useCrawlStore';

function ContentCrawlPageComponent() {
  const navigate = useNavigate();

  const {
    data: crawlContent,
    isLoading: _isLoadingCrawlContent,
    error: _errorCrawlContent,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useCrawlContent();

  // Infinite scroll
  const loadMoreRef = useInfiniteScroll({
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    threshold: 300,
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isBatchRejectModalOpen, setIsBatchRejectModalOpen] = useState(false);

  const { setContentDetails, resetFilters } = useCrawlStore();

  const { mutate: makeVideoCrawler } = useMakeVideoCrawler();

  const handleNavigateToDetail = (item: ContentItem) => {
    makeVideoCrawler({
      payload: {
        is_previewed: true,
        message: 'Ok',
        video_id: Number(item.id),
      },
      video_id: Number(item.id),
    });
    setContentDetails(item);
    navigate({
      to: `${item.details_link}/$contentId`,
      params: { contentId: item.id },
      search: { approving_status: item.status },
    });
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleSelectAll = (visibleItems: ContentItem[]) => {
    const visibleIds = visibleItems.map((i) => i.id);
    if (visibleIds.every((id) => selectedIds.includes(id))) {
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      const newSelection = new Set([...selectedIds, ...visibleIds]);
      setSelectedIds(Array.from(newSelection).map((id) => id.toString()));
    }
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
      makeVideoCrawler({
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
      makeVideoCrawler({
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

  const { filters, setFilters } = useCrawlStore();

  const debounceFn = useMemo(
    () => debounce((value: string) => setFilters('search', value), 500),
    [setFilters]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchQuery(value);
    debounceFn(value);
  };

  const sortOrderOptions = [
    { id: 'asc', label: 'Mới nhất' },
    { id: 'desc', label: 'Cũ nhất' },
  ];

  const categoryOptions = [
    { id: 'false', label: 'Chưa xem trước' },
    { id: 'true', label: 'Đã xem trước' },
  ];

  // Count selected items for approve/reject
  const batchApproveCount = crawlContent.filter((i: ContentItem) =>
    selectedIds.includes(i.id)
  ).length;
  const batchRejectCount = batchApproveCount; // Same for crawl page

  useEffect(() => {
    return () => {
      resetFilters();
    };
  }, []);

  return (
    <div className="relative space-y-8">
      <div className="flex flex-col gap-6">
        {/* Status Filter */}
        <div className="space-y-3">
          <Typography variant="tiny" className="flex items-center gap-2 font-mono text-zinc-500">
            <Filter size={10} /> Lọc Xem Trước
          </Typography>
          <div className="flex flex-wrap gap-1">
            {categoryOptions?.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilters('is_previewed', tab.id)}
                className={`flex items-center gap-2 border px-4 py-2 font-mono text-[10px] uppercase transition-all ${
                  filters.is_previewed === tab.id
                    ? 'border-white bg-white text-black'
                    : 'border-zinc-800 bg-transparent text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1">
            <div className="group relative">
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-zinc-600 transition-colors group-hover:text-white" />
              <Input
                placeholder="TÌM_KIẾM_CƠ_SỞ_DỮ_LIỆU..."
                className="h-10 border-white/10 bg-black pl-10 font-mono text-xs text-white uppercase focus:border-white"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={filters.sort_order}
              onValueChange={(value) => setFilters('sort_order', value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>

              <SelectContent>
                {sortOrderOptions.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex border border-white/10 bg-black p-1">
              <button
                type="button"
                className={`flex h-8 w-8 items-center justify-center transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'
                }`}
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                type="button"
                className={`flex h-8 w-8 items-center justify-center transition-colors ${
                  viewMode === 'table' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'
                }`}
                onClick={() => setViewMode('table')}
              >
                <Rows size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {_isLoadingCrawlContent && viewMode === 'table' && <ContentTableSkeleton rows={10} />}
      {_isLoadingCrawlContent && viewMode === 'grid' && <ContentGridSkeleton count={12} />}
      {!_isLoadingCrawlContent && viewMode === 'table' && (
        <ContentTable
          items={crawlContent}
          onView={handleNavigateToDetail}
          selectedIds={selectedIds}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
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
