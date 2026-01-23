import { createRoute } from '@tanstack/react-router';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  Hash,
  Layers,
  LayoutGrid,
  Rows,
  Search,
  ShieldAlert,
  ThumbsUp,
  Zap,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import ContentGrid from '../components/ContentGrid';
import ContentTable from '../components/ContentTable';
import { Button, Input, Select } from '../components/ui/primitives';
import { ContentItem, ContentStatus, SourcePlatform } from '../types';
import { rootRoute } from './root-layout';

export const contentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/content',
  component: ContentPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      status: (search.status as string) || 'ALL',
      source: (search.source as string) || 'ALL',
    };
  },
});

function ContentPage() {
  const navigate = contentRoute.useNavigate();
  const { status, source } = contentRoute.useSearch();
  const { items, categories, service, currentUser, refreshData } = contentRoute.useRouteContext();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(status || 'ALL');
  const [sourceFilter] = useState<string>(source || 'ALL');
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [platformFilter, setPlatformFilter] = useState<string>('ALL');

  const handleNavigateToDetail = (id: string) => {
    navigate({ to: '/detail/$contentId', params: { contentId: id } });
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleSelectAll = (visibleItems: ContentItem[]) => {
    const visibleIds = visibleItems.map((i) => i.content_id);
    if (visibleIds.every((id) => selectedIds.includes(id))) {
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      const newSelection = new Set([...selectedIds, ...visibleIds]);
      setSelectedIds(Array.from(newSelection));
    }
  };

  const handleBatchApprove = () => {
    const eligibleApprovals = items.filter(
      (item: ContentItem) =>
        selectedIds.includes(item.content_id) && item.status === ContentStatus.PENDING_REVIEW
    );

    if (eligibleApprovals.length === 0) return;

    eligibleApprovals.forEach((item: ContentItem) => {
      service.updateContent(item.content_id, { status: ContentStatus.APPROVED }, currentUser.name);
    });

    refreshData();
    setSelectedIds([]);
  };

  const toggleCategory = (cat: string) => {
    setCategoryFilters((prev) =>
      prev.includes(cat) ? prev.filter((c: string) => c !== cat) : [...prev, cat]
    );
  };

  const filteredContent = useMemo(() => {
    return items.filter((item: ContentItem) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!item.title.toLowerCase().includes(q) && !item.content_id.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
      if (sourceFilter !== 'ALL') {
        if (item.source_type !== sourceFilter && item.source_platform !== sourceFilter)
          return false;
      }
      if (platformFilter !== 'ALL') {
        if (
          item.source_platform !== platformFilter &&
          !item.target_platforms?.includes(platformFilter as SourcePlatform)
        ) {
          return false;
        }
      }
      if (categoryFilters.length > 0 && !categoryFilters.includes(item.category)) {
        return false;
      }
      return true;
    });
  }, [items, searchQuery, statusFilter, sourceFilter, platformFilter, categoryFilters]);

  const statusTabs = [
    { id: 'ALL', label: 'Tất cả', icon: Layers },
    { id: ContentStatus.DRAFT, label: 'Nháp', icon: Zap },
    { id: ContentStatus.PENDING_REVIEW, label: 'Chờ duyệt', icon: Clock },
    { id: ContentStatus.APPROVED, label: 'Đã duyệt', icon: ThumbsUp },
    { id: ContentStatus.SCHEDULED, label: 'Đã lên lịch', icon: Calendar },
    { id: ContentStatus.PUBLISHED, label: 'Đã đăng', icon: CheckCircle2 },
    { id: ContentStatus.REJECTED, label: 'Từ chối', icon: ShieldAlert },
  ];

  const platformTabs = [
    { id: 'ALL', label: 'Tất cả nền tảng' },
    { id: SourcePlatform.YAAH_CONNECT, label: 'Yaah Connect' },
    { id: SourcePlatform.LALALA, label: 'Lalala' },
    { id: SourcePlatform.VOTEME, label: 'Voteme' },
  ];

  const batchActionableCount = items.filter(
    (i: ContentItem) =>
      selectedIds.includes(i.content_id) && i.status === ContentStatus.PENDING_REVIEW
  ).length;

  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col gap-6">
        {/* Status Filter */}
        <div className="space-y-3">
          <label className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider flex items-center gap-2">
            <Filter size={10} /> Lọc Trạng Thái
          </label>
          <div className="flex flex-wrap gap-1">
            {statusTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-[10px] font-mono uppercase border transition-all ${
                  statusFilter === tab.id
                    ? 'bg-white text-black border-white'
                    : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-500 hover:text-zinc-300'
                }`}
              >
                <tab.icon size={12} /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-3">
          <label className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider flex items-center gap-2">
            <Hash size={10} /> Lọc Danh Mục
          </label>
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setCategoryFilters([])}
              className={`px-3 py-1 text-[10px] font-mono uppercase border transition-all ${
                categoryFilters.length === 0
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-500 hover:text-zinc-300'
              }`}
            >
              TẤT CẢ
            </button>
            {categories.map((cat: string) => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-3 py-1 text-[10px] font-mono uppercase border transition-all ${
                  categoryFilters.includes(cat)
                    ? 'bg-white text-black border-white'
                    : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-500 hover:text-zinc-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 border-t border-white/10 pt-6">
          <div className="flex-1">
            <div className="relative group">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-600 group-hover:text-white transition-colors" />
              <Input
                placeholder="TÌM_KIẾM_CƠ_SỞ_DỮ_LIỆU..."
                className="pl-10 h-10 bg-black border-white/10 focus:border-white text-white font-mono uppercase text-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-48">
              <Select value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value)}>
                {platformTabs.map((p) => (
                  <option key={p.id} value={p.id} className="bg-black text-white">
                    {p.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="border border-white/10 flex p-1 bg-black">
              <button
                className={`h-8 w-8 flex items-center justify-center transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'
                }`}
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                className={`h-8 w-8 flex items-center justify-center transition-colors ${
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

      {viewMode === 'table' ? (
        <ContentTable
          items={filteredContent}
          onView={handleNavigateToDetail}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleAll={() => handleSelectAll(filteredContent)}
        />
      ) : (
        <ContentGrid items={filteredContent} onView={handleNavigateToDetail} />
      )}

      {/* Floating Batch Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-4 bg-zinc-900 border border-white/20 p-2 pl-6 shadow-2xl animate-in slide-in-from-bottom-10 fade-in">
          <span className="font-mono text-xs text-white uppercase">
            {selectedIds.length} ĐÃ CHỌN
          </span>
          <div className="h-4 w-[1px] bg-white/20" />
          <Button
            variant="default"
            className="bg-white text-black hover:bg-zinc-200 h-8"
            onClick={handleBatchApprove}
            disabled={batchActionableCount === 0}
          >
            DUYỆT HÀNG LOẠT ({batchActionableCount})
          </Button>
          <Button
            variant="ghost"
            className="h-8 text-zinc-400 hover:text-white"
            onClick={() => setSelectedIds([])}
          >
            HỦY
          </Button>
        </div>
      )}
    </div>
  );
}
