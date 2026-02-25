import { Filter, LayoutGrid, Rows, Search } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

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
import {
  DRAFT_CONTENT_SEARCH_IS_PREVIEWED_OPTIONS,
  DRAFT_CONTENT_SEARCH_SORT_OPTIONS,
} from '../constants';
import { DraftContentSearchSchema } from '../schemas';
import { useDraftContentStore } from '../stores/useDraftContentStore';

type DraftContentHeaderProps = {
  totalItems: number;
};
function DraftContentHeader({ totalItems }: DraftContentHeaderProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const { viewMode, setViewMode } = useDraftContentStore();

  const filters: DraftContentSearchSchema = useSearch({ strict: false });

  const updateFilters = useCallback(
    (key: keyof DraftContentSearchSchema, value: any) => {
      navigate({
        to: '/draft',
        search: {
          ...filters,
          [key]: value,
        },
      });
    },
    [filters, navigate]
  );

  const debounceFn = useMemo(
    () => debounce((value: string) => updateFilters('search', value), 500),
    [updateFilters]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchQuery(value);
    debounceFn(value);
  };

  return (
    <div className="sticky top-0 z-50 flex flex-col gap-6 bg-black/80 py-4 backdrop-blur">
      {/* Status Filter */}
      <div className="space-y-3">
        <Typography variant="small" className="flex items-center gap-2 font-mono text-zinc-500">
          <Filter size={14} /> Lọc Xem Trước
        </Typography>
        <div className="flex flex-wrap gap-1">
          {DRAFT_CONTENT_SEARCH_IS_PREVIEWED_OPTIONS?.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => updateFilters('is_previewed', tab.id)}
              className={`flex items-center gap-2 border px-4 py-2 font-mono text-xs uppercase transition-all ${
                filters.is_previewed === tab.id
                  ? 'border-white bg-white text-black'
                  : 'border-zinc-800 bg-transparent text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab.label} {filters.is_previewed === tab.id ? `(${totalItems})` : ''}
            </button>
          ))}
        </div>
      </div>
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
          <Select
            value={filters.sort_order}
            onValueChange={(value) => updateFilters('sort_order', value)}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>

            <SelectContent>
              {DRAFT_CONTENT_SEARCH_SORT_OPTIONS.map((p) => (
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
  );
}

export default DraftContentHeader;
