import { Filter, Hash, Layers, LayoutGrid, Rows, Search } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import { ContentStatus } from '@/shared';
import { FilterSkeleton } from '@/shared/components';
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Typography,
} from '@/shared/ui';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { debounce } from 'lodash';

import { useApprovingStatus } from '../hooks/useContent';
import { ContentSearchSchema } from '../schemas';
import { useContentStore } from '../stores/useContentStore';
import { transformStatusLabel } from '../utils';
import { useContentContext } from './content-context';

type ContentHeaderProps = {
  totalItems?: number;
};
function ContentHeader({ totalItems }: ContentHeaderProps) {
  const navigate = useNavigate();

  const { data: approvingStatus, isLoading: isLoadingApprovingStatus } = useApprovingStatus();
  const { platforms, categories } = useContentContext();

  const filters: ContentSearchSchema = useSearch({ strict: false });

  const { viewMode, setViewMode, resetSelectedIds } = useContentStore();

  const [searchQuery, setSearchQuery] = useState('');
  const updateFilters = useMemo(() => {
    return (key: keyof ContentSearchSchema, value: any) => {
      navigate({
        to: '/content',
        search: {
          ...filters,
          [key]: value,
        },
      });
    };
  }, [filters, navigate]);

  const setFilters = useCallback(
    (key: keyof ContentSearchSchema, value: any) => updateFilters(key, value),
    [updateFilters]
  );

  const debounceFn = useMemo(
    () => debounce((value: string) => setFilters('search', value), 500),
    [setFilters]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchQuery(value);
    debounceFn(value);
  };

  const toggleCategory = (cat: string) => {
    const isExists = filters.categories.includes(cat);
    if (isExists) {
      setFilters(
        'categories',
        filters.categories.filter((c: string) => c !== cat)
      );
    } else {
      setFilters('categories', [...filters.categories, cat]);
    }
  };

  const handleFilterStatus = (status: string) => {
    setFilters('approving_status', status);
    if (status !== ContentStatus.APPROVED) {
      resetSelectedIds();
    }
  };

  const statusTabs = useMemo(() => {
    const tabs = approvingStatus
      ?.filter((tab) => tab.slug !== 'draft')
      .map((tab) => ({
        slug: tab.slug,
        name: transformStatusLabel(tab.slug),
        icon: Layers,
      }));
    tabs?.unshift({ slug: '', name: transformStatusLabel(ContentStatus.ALL), icon: Layers });
    return tabs;
  }, [approvingStatus]);

  return (
    <div className="sticky top-0 z-50 flex flex-col gap-6 bg-black/80 py-4 backdrop-blur">
      {/* Status Filter */}
      {isLoadingApprovingStatus ? (
        <FilterSkeleton count={6} />
      ) : (
        <div className="space-y-3">
          <Typography variant="small" className="flex items-center gap-2 font-mono text-zinc-500">
            <Filter size={14} /> Lọc Trạng Thái
          </Typography>
          <div className="flex flex-wrap gap-1">
            {statusTabs?.map((tab) => (
              <button
                key={tab.slug}
                type="button"
                onClick={() => handleFilterStatus(tab.slug)}
                className={`flex items-center gap-2 border px-4 py-2 font-mono text-xs uppercase transition-all ${
                  filters.approving_status === tab.slug
                    ? 'border-white bg-white text-black'
                    : 'border-zinc-800 bg-transparent text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'
                }`}
              >
                {tab.name} {filters.approving_status === tab.slug && `(${totalItems})`}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category Filter */}
      {isLoadingApprovingStatus ? (
        <FilterSkeleton count={5} />
      ) : (
        <div className="space-y-3">
          <Typography variant="small" className="flex items-center gap-2 font-mono text-zinc-500">
            <Hash size={14} /> Lọc Danh Mục
          </Typography>
          <div className="flex flex-wrap gap-1">
            <button
              type="button"
              onClick={() => setFilters('categories', [])}
              className={`border px-3 py-1 font-mono text-[10px] uppercase transition-all ${
                filters.categories.length === 0
                  ? 'border-white bg-white text-black'
                  : 'border-zinc-800 bg-transparent text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'
              }`}
            >
              TẤT CẢ
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleCategory(cat.name)}
                className={`border px-3 py-1 font-mono text-xs uppercase transition-all ${
                  filters.categories.includes(cat.name)
                    ? 'border-white bg-white text-black'
                    : 'border-zinc-800 bg-transparent text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 border-t border-white/10 pt-6 md:flex-row">
        <div className="flex-1">
          <div className="group relative">
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-zinc-600 transition-colors group-hover:text-white" />
            <Input
              placeholder="TÌM KIẾM..."
              className="h-10 border-white/10 bg-black pl-10 font-mono text-xs text-white focus:border-white"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filters.platform} onValueChange={(value) => setFilters('platform', value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Tất cả nền tảng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem defaultChecked value="all">
                Tất cả nền tảng
              </SelectItem>
              {platforms.map((p) => (
                <SelectItem key={p.id} value={p.api_key}>
                  {p.name}
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
  );
}

export default ContentHeader;
