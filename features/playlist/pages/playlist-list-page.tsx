import { cn } from '@/lib';
import { toast } from '@/shared';
import { Typography } from '@/shared/ui';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { ListVideo, Plus } from 'lucide-react';
import { useState } from 'react';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import {
  CreatePlaylistModal,
  DeleteConfirmationModal,
  PlaylistCard,
  PlaylistCardSkeleton,
  PlaylistGridSkeleton,
  PlaylistHeader,
} from '../components';
import { CreatePlaylistDto } from '../dto';
import { useCreatePlaylist, useDeletePlaylist, usePlaylists } from '../hooks/usePlaylist';
import { PlaylistSearchSchema } from '../schema';
import type { Playlist } from '../types';

function PlaylistListPage() {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState<Playlist | null>(null);

  const filters: PlaylistSearchSchema = useSearch({ strict: false });

  // Queries
  const {
    data: playlists,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPlaceholderData,
  } = usePlaylists({
    limit: filters.limit,
    search: filters.search,
    sort: filters.sort,
    sorted: filters.sorted,
  });

  const [loadMoreRef] = useInfiniteScroll({
    hasNextPage,
    onLoadMore: fetchNextPage,
    loading: isFetchingNextPage,
  });

  // Mutations
  const { mutate: createPlaylist, isPending: isCreating } = useCreatePlaylist();
  const { mutate: deletePlaylist, isPending: isDeleting } = useDeletePlaylist();

  const handleCreatePlaylist = (payload: CreatePlaylistDto, onSuccess?: () => void) => {
    createPlaylist(payload, {
      onSuccess: () => {
        onSuccess?.();
        toast.success('Tạo danh sách phát thành công');
      },
      onError: () => {
        toast.error('Tạo danh sách phát thất bại');
      },
    });
  };

  const handleViewPlaylist = (playlist: Playlist) => {
    navigate({ to: `/playlists/${playlist.id}` });
  };

  const handleDeletePlaylist = (playlist: Playlist) => {
    setPlaylistToDelete(playlist);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = (onSuccess?: () => void) => {
    if (playlistToDelete) {
      deletePlaylist(playlistToDelete.id, {
        onSuccess: () => {
          setPlaylistToDelete(null);
          onSuccess?.();
        },
      });
    }
  };

  return (
    <div className="flex h-full flex-col space-y-8 p-4 sm:p-10">
      {/* Header */}
      <PlaylistHeader onOpenCreateModal={() => setIsCreateModalOpen(true)} />
      {/* Loading State */}
      {isLoading && <PlaylistGridSkeleton count={8} />}

      {/* Empty State */}
      {!isLoading && (!playlists || playlists.length === 0) && (
        <div className="flex flex-col items-center justify-center py-20">
          <ListVideo size={48} className="mb-4 text-zinc-700" />
          <Typography variant="h3" className="mb-2 font-mono text-zinc-500 uppercase">
            Chưa có playlist
          </Typography>
          <Typography variant="small" className="mb-6 text-zinc-600">
            Tạo playlist đầu tiên để bắt đầu
          </Typography>
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 border border-white bg-white px-6 py-3 font-mono text-sm text-black uppercase transition-colors hover:bg-zinc-200"
          >
            <Plus size={16} />
            Tạo Playlist
          </button>
        </div>
      )}

      {/* Playlist Grid */}
      {!isLoading && playlists && playlists.length > 0 && (
        <div
          className={cn(
            'grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
            isPlaceholderData && 'pointer-events-none opacity-50'
          )}
        >
          {isCreating && <PlaylistCardSkeleton />}
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              onView={handleViewPlaylist}
              onDelete={handleDeletePlaylist}
              isDeleting={isDeleting}
            />
          ))}
          {hasNextPage && (
            <div ref={loadMoreRef} className="h-10">
              {isFetchingNextPage && (
                <>
                  <PlaylistCardSkeleton />
                  <PlaylistCardSkeleton />
                  <PlaylistCardSkeleton />
                  <PlaylistCardSkeleton />
                </>
              )}
              {!isFetchingNextPage && hasNextPage && (
                <div className="font-mono text-xs text-zinc-600 uppercase">
                  Cuộn xuống để tải thêm
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <CreatePlaylistModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePlaylist}
        isCreating={isCreating}
      />

      <DeleteConfirmationModal
        isDeleting={isDeleting}
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setPlaylistToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Xóa Playlist"
        message={`Bạn có chắc chắn muốn xóa playlist "${playlistToDelete?.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa Playlist"
      />
    </div>
  );
}

export default PlaylistListPage;
