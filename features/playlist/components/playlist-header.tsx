import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Typography,
} from '@/shared';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { debounce } from 'lodash';
import { Plus, Search } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import { PLAYLIST_SORT_OPTIONS } from '../contants';
import { PlaylistSearchSchema } from '../schema';

type PlaylistHeaderProps = {
  onOpenCreateModal: () => void;
};
function PlaylistHeader({ onOpenCreateModal }: PlaylistHeaderProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const filters: PlaylistSearchSchema = useSearch({ strict: false });
  const updateFilters = useCallback(
    (key: keyof PlaylistSearchSchema, value: any) => {
      navigate({
        to: '/playlists',
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
    <header className="sticky top-0 z-50 flex flex-col gap-6 bg-black/80 py-4 backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h2" className="font-mono uppercase">
            Danh sách phát
          </Typography>
          <Typography variant="p" className="mt-2 font-mono text-zinc-500">
            Quản lý danh sách phát video
          </Typography>
        </div>

        {/* Create Button */}
        <button
          type="button"
          onClick={onOpenCreateModal}
          className="flex items-center gap-2 border border-white bg-white px-6 py-3 font-mono text-sm text-black uppercase transition-colors hover:bg-zinc-200"
        >
          <Plus size={16} />
          Tạo Playlist
        </button>
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
          <Select value={filters.sorted} onValueChange={(value) => updateFilters('sorted', value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>
            <SelectContent>
              {PLAYLIST_SORT_OPTIONS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
}

export default PlaylistHeader;
