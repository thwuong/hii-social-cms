import { Typography } from '@/shared/ui';
import { useNavigate } from '@tanstack/react-router';
import { ListVideo, Plus } from 'lucide-react';
import { useState } from 'react';
import { CreatePlaylistModal, DeleteConfirmationModal, PlaylistCard } from '../components';

import { CreatePlaylistDto } from '../dto';
import { useCreatePlaylist, useDeletePlaylist, usePlaylists } from '../hooks/usePlaylist';
import type { Playlist } from '../types';

function PlaylistListPage() {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState<Playlist | null>(null);

  // Queries
  const { data: playlists, isLoading } = usePlaylists({
    limit: 10,
  });

  // Mutations
  const { mutate: createPlaylist, isPending: isCreating } = useCreatePlaylist();
  const { mutate: deletePlaylist, isPending: isDeleting } = useDeletePlaylist();

  const handleCreatePlaylist = (payload: CreatePlaylistDto) => {
    createPlaylist(payload);
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
    <div className="flex h-full flex-col space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h2" className="font-mono uppercase">
            Playlists
          </Typography>
          <Typography variant="small" className="mt-2 font-mono text-zinc-500">
            Quản lý danh sách phát video
          </Typography>
        </div>

        {/* Create Button */}
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 border border-white bg-white px-6 py-3 font-mono text-sm text-black uppercase transition-colors hover:bg-zinc-200"
        >
          <Plus size={16} />
          Tạo Playlist
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`playlist-skeleton-${i + 1}`}
              className="h-80 animate-pulse border border-white/10 bg-zinc-900"
            />
          ))}
        </div>
      )}

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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              onView={handleViewPlaylist}
              onDelete={handleDeletePlaylist}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <CreatePlaylistModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePlaylist}
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
