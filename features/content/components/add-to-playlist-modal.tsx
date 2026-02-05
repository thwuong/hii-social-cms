import { PlaylistForm } from '@/features/playlist/components';
import { usePlaylists } from '@/features/playlist/hooks/usePlaylist';
import {
  CreatePlaylistSchema,
  createPlaylistSchema,
} from '@/features/playlist/schema/create-playlist.schema';
import { cn } from '@/lib';
import { useDebounceSearch } from '@/shared/hooks/use-debounce-search';
import { Button, Dialog, DialogContent, Input, Typography } from '@/shared/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ListVideo, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface AddToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToPlaylist: () => void;
  onCreatePlaylist: (data: CreatePlaylistSchema) => void;
  selectedCount: number;
  selectedPlaylistIds: string[];
  onToggleSelectPlaylist: (playlistId: string) => void;
  selectedVideoIds: string[];
}

export function AddToPlaylistModal({
  isOpen,
  onClose,
  onAddToPlaylist,
  onCreatePlaylist,
  selectedCount,
  selectedPlaylistIds,
  onToggleSelectPlaylist,
  selectedVideoIds,
}: AddToPlaylistModalProps) {
  const [searchTerms, setSearchTerms] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const {
    handleSubmit,
    formState: { isValid, isDirty, errors },
    control,
    watch,
    setValue,
  } = useForm<CreatePlaylistSchema>({
    resolver: zodResolver(createPlaylistSchema),
    values: {
      name: '',
      description: undefined,
      video_ids: selectedVideoIds,
      thumbnail: undefined,
    },
    mode: 'all',
  });

  // Get playlists
  const { data: playlists, isLoading } = usePlaylists({
    limit: 10,
    search: searchTerms,
  });

  const { handleChange, value: debouncedSearchTerm } = useDebounceSearch((value) => {
    setSearchTerms(value);
  }, 500);

  const handleClose = () => {
    handleChange('');
    setShowCreateForm(false);
    onClose();
  };

  const handleAddToPlaylist = () => {
    onAddToPlaylist();
    handleClose();
  };

  const handleCreateNewPlaylist = (data: CreatePlaylistSchema) => {
    onCreatePlaylist(data);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl border-white/20 bg-black p-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <div>
            <Typography variant="h4" className="font-mono uppercase">
              Thêm Vào Playlist
            </Typography>
            <Typography variant="small" className="mt-1 font-mono text-zinc-500">
              {selectedCount} video đã chọn
            </Typography>
          </div>
        </div>

        {/* Content */}
        {!showCreateForm ? (
          <>
            {/* Search & Create Button */}
            <div className="space-y-4 border-b border-white/10 p-6">
              <div className="relative">
                <Search className="absolute top-2.5 left-3 h-4 w-4 text-zinc-500" />
                <Input
                  placeholder="Tìm kiếm playlist..."
                  value={debouncedSearchTerm}
                  onChange={(e) => handleChange(e.target.value)}
                  className="border-white/20 bg-zinc-900 pl-10 font-mono text-white"
                />
              </div>

              <Button
                onClick={() => setShowCreateForm(true)}
                className="w-full border-white bg-white font-mono text-sm text-black uppercase hover:bg-zinc-200"
              >
                <Plus size={16} className="mr-2" />
                Tạo Playlist Mới
              </Button>
            </div>

            {/* Playlist List */}
            <div className="max-h-96 overflow-y-auto p-6">
              {isLoading && (
                <div className="flex justify-center py-8">
                  <Typography variant="small" className="font-mono text-zinc-500">
                    Đang tải...
                  </Typography>
                </div>
              )}

              {!isLoading && playlists?.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8">
                  <ListVideo className="mb-2 h-12 w-12 text-zinc-700" />
                  <Typography variant="small" className="font-mono text-zinc-500">
                    {debouncedSearchTerm ? 'Không tìm thấy playlist' : 'Chưa có playlist'}
                  </Typography>
                </div>
              )}

              {!isLoading && playlists.length > 0 && (
                <div className="space-y-2">
                  {playlists.map((playlist) => {
                    const isSelected = selectedPlaylistIds.includes(playlist.id);
                    return (
                      <button
                        key={playlist.id}
                        type="button"
                        onClick={() => onToggleSelectPlaylist(playlist.id)}
                        className={cn(
                          'group flex w-full items-center gap-4 border border-white/10 bg-zinc-900 p-4 text-left transition-all hover:border-white/30 hover:bg-zinc-800',
                          isSelected && 'border-white/30 bg-zinc-800'
                        )}
                      >
                        {/* Thumbnail */}
                        <div className="h-16 w-28 flex-shrink-0 overflow-hidden bg-black">
                          {playlist.thumbnail_url ? (
                            <img
                              src={playlist.thumbnail_url}
                              alt={playlist.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <ListVideo className="h-8 w-8 text-zinc-700" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 overflow-hidden">
                          <Typography className="line-clamp-1 font-mono text-sm text-white">
                            {playlist.name}
                          </Typography>
                          <div className="mt-1 flex items-center gap-3">
                            <Typography variant="tiny" className="font-mono text-zinc-500">
                              {playlist.video_count} video
                            </Typography>
                            {playlist.description && (
                              <Typography
                                variant="tiny"
                                className="line-clamp-1 font-mono text-zinc-600"
                              >
                                {playlist.description}
                              </Typography>
                            )}
                          </div>
                        </div>

                        {/* Add Icon */}
                        <div className="flex h-8 w-8 items-center justify-center border border-white/20 bg-transparent text-white opacity-0 transition-opacity group-hover:opacity-100">
                          {isSelected ? <Check size={14} /> : <Plus size={14} />}
                        </div>
                      </button>
                    );
                  })}

                  {selectedPlaylistIds.length > 0 && (
                    <div className="flex items-center gap-2 border-t border-white/10 pt-4">
                      <Button
                        fullWidth
                        variant="ghost"
                        onClick={handleAddToPlaylist}
                        className="font-mono uppercase hover:bg-white/10"
                      >
                        <Plus size={14} className="mr-2" />
                        Thêm Vào Playlist
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          /* Create Playlist Form */
          <form onSubmit={handleSubmit(handleCreateNewPlaylist)} className="p-6">
            <div className="space-y-6">
              <PlaylistForm
                control={control}
                watch={watch}
                setValue={setValue}
                selectedVideoCount={selectedCount}
                showVideoCount
              />

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-6">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowCreateForm(false)}
                  className="font-mono uppercase hover:bg-white/10"
                >
                  Quay Lại
                </Button>
                <Button
                  type="submit"
                  disabled={!isValid || !isDirty}
                  className="border-white bg-white font-mono text-black uppercase hover:bg-zinc-200 disabled:opacity-50"
                >
                  Tạo & Thêm Video
                </Button>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
