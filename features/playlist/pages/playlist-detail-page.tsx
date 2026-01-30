import { VideoPlayer } from '@/shared/components';
import { Button, Input, Label, Textarea, Typography } from '@/shared/ui';
import { useNavigate, useParams } from '@tanstack/react-router';
import { ArrowLeft, Plus, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormField from '@/shared/ui/form-field';
import { AddVideoModal, DeleteConfirmationModal, DraggableVideoList } from '../components';
// import {
//   useAddVideoToPlaylist,
//   usePlaylist,
//   useRemoveVideoFromPlaylist,
//   useReorderPlaylist,
//   useUpdatePlaylist,
//   useDeletePlaylist,
// } from '../hooks/usePlaylist';
import {
  useMockAddVideoToPlaylist,
  useMockDeletePlaylist,
  useMockPlaylist,
  useMockRemoveVideoFromPlaylist,
  useMockReorderPlaylist,
  useMockUpdatePlaylist,
} from '../mocks/use-mock-service';
import { createPlaylistSchema, CreatePlaylistSchema } from '../schema/create-playlist.schema';
import { usePlaylistStore } from '../stores/usePlaylistStore';
import type { PlaylistVideo } from '../types';

function PlaylistDetailPage() {
  const navigate = useNavigate();
  const { playlistId } = useParams({ strict: false });

  // Store
  const {
    playlistVideos,
    setPlaylistVideos,
    activeVideoId,
    setActiveVideoId,
    isAddVideoModalOpen,
    setIsAddVideoModalOpen,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
  } = usePlaylistStore();

  // Delete confirmation modal
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: 'video' | 'playlist' | null;
    video: PlaylistVideo | null;
  }>({
    isOpen: false,
    type: null,
    video: null,
  });

  // Queries
  // const { data: playlist, isLoading } = usePlaylist(playlistId!);
  const { data: playlist, isLoading, isFetched } = useMockPlaylist(playlistId!);

  // Mutations
  const { mutate: updatePlaylist, isPending: isUpdating } = useMockUpdatePlaylist();
  const { mutate: addVideo, isPending: isAddingVideo } = useMockAddVideoToPlaylist();
  const { mutate: removeVideo, isPending: isRemovingVideo } = useMockRemoveVideoFromPlaylist();
  const { mutate: deletePlaylist, isPending: isDeleting } = useMockDeletePlaylist();

  // Local state
  const {
    register,
    handleSubmit,
    formState: { isDirty, errors },
    watch,
    reset,
    setValue,
    control,
  } = useForm<CreatePlaylistSchema>({
    values: playlist
      ? {
          name: playlist.name,
          description: playlist.description || '',
          video_ids: playlist.videos?.map((v) => v.video_id) || [],
        }
      : undefined,
    resolver: zodResolver(createPlaylistSchema),
    mode: 'all',
  });

  useEffect(() => {
    if (playlist && isFetched) {
      setActiveVideoId(playlist.videos?.[0]?.id || null);
      setPlaylistVideos(playlist.videos || []);
    }
  }, [playlist, isFetched]);

  // Handlers
  const handleSave = (data: CreatePlaylistSchema) => {
    if (!playlistId) return;

    updatePlaylist({
      id: playlistId,
      payload: {
        name: data.name.trim(),
        description: data.description?.trim() || undefined,
      },
    });
  };

  const handleCancel = () => {
    reset({
      name: playlist?.name || '',
      description: playlist?.description || '',
      video_ids: playlist?.videos?.map((v) => v.video_id) || [],
    });
  };

  const handleAddVideo = (video: PlaylistVideo) => {
    if (!playlistId) return;

    // addVideo({
    //   playlistId,
    //   payload: { video_id: videoId },
    // });
    addVideoToPlaylist(playlistId, {
      ...video,
      position: playlistVideos.length,
    });
    const previousVideoIds = watch('video_ids') || [];
    setValue('video_ids', [...previousVideoIds, video.video_id], {
      shouldDirty: true,
    });
  };

  const handleRemoveVideo = (video: PlaylistVideo) => {
    // Check if it's the last video
    if (playlistVideos.length === 1) {
      setDeleteModal({
        isOpen: true,
        type: 'playlist',
        video,
      });
    } else {
      setDeleteModal({
        isOpen: true,
        type: 'video',
        video,
      });
    }
  };

  const handleConfirmDelete = () => {
    if (!playlistId || !deleteModal.video) return;

    if (deleteModal.type === 'playlist') {
      // Delete entire playlist
      deletePlaylist(playlistId, {
        onSuccess: () => {
          navigate({ to: '/playlists' });
        },
      });
    } else {
      // Delete just the video
      removeVideo({
        playlistId,
        videoId: deleteModal.video.video_id,
      });

      // If deleted video was active, set next video as active
      if (activeVideoId === deleteModal.video.id && playlistVideos.length > 1) {
        const nextVideo = playlistVideos.find((v) => v.id !== deleteModal.video!.id);
        if (nextVideo) setActiveVideoId(nextVideo.id);
      }
    }
  };

  const handlePlayVideo = (video: PlaylistVideo) => {
    setActiveVideoId(video.id);
  };

  const handleReorder = (reorderedVideos: PlaylistVideo[]) => {
    if (!playlistId) return;

    // Update local state immediately for smooth UI
    setPlaylistVideos(reorderedVideos);
    setValue(
      'video_ids',
      reorderedVideos.map((v) => v.video_id),
      {
        shouldDirty: true,
      }
    );

    // Save to backend
  };

  if (!playlist) return null;
  // Get active video
  const activeVideo = playlist.videos?.find((v) => v.id === activeVideoId);

  return (
    <div className="flex h-full flex-col space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate({ to: '/playlists' })}
          className="flex h-10 w-10 items-center justify-center border border-white/20 text-white transition-colors hover:bg-white hover:text-black"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1">
          <Typography variant="h2" className="font-mono uppercase">
            Chi Tiết Playlist
          </Typography>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Typography className="font-mono text-zinc-500">Đang tải...</Typography>
        </div>
      )}

      {/* Content */}
      {!isLoading && playlist && (
        <form onSubmit={handleSubmit(handleSave)} className="grid flex-1 gap-6 lg:grid-cols-2">
          {/* Left: Video Player & Info */}
          <div className="space-y-6">
            {/* Video Player */}
            <div className="aspect-video w-full">
              {activeVideo ? (
                <VideoPlayer
                  url={activeVideo.thumbnail_url || ''}
                  poster={activeVideo.thumbnail_url}
                  title={activeVideo.title}
                  aspectRatio="16/9"
                  className="h-full w-full"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center border border-white/10 bg-black">
                  <Typography variant="small" className="font-mono text-zinc-500 uppercase">
                    Chọn video để phát
                  </Typography>
                </div>
              )}
            </div>

            {/* Active Video Info */}
            {activeVideo && (
              <div className="space-y-4 border border-white/10 bg-black p-6">
                <Typography className="font-mono text-lg text-white uppercase">
                  {activeVideo.title}
                </Typography>
                <div className="flex items-center gap-4 text-sm">
                  <Typography variant="small" className="font-mono text-zinc-500">
                    Vị trí: {activeVideo.position + 1}/{playlistVideos.length}
                  </Typography>
                  <Typography variant="small" className="font-mono text-zinc-500">
                    Thời lượng: {Math.floor(activeVideo.duration / 60)}:
                    {(activeVideo.duration % 60).toString().padStart(2, '0')}
                  </Typography>
                </div>
              </div>
            )}

            {/* Playlist Info Form */}
            <div className="space-y-4 border border-white/10 bg-black p-6">
              <Typography variant="h4" className="font-mono uppercase">
                Thông Tin Playlist
              </Typography>

              {/* Name */}
              <div className="space-y-2">
                <FormField
                  control={control}
                  label="Tên Playlist"
                  placeholder="Nhập tên đăng nhập..."
                  {...register('name')}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="font-mono text-xs text-zinc-400 uppercase">Mô Tả</Label>
                <Textarea
                  {...register('description')}
                  onChange={(e) => setValue('description', e.target.value, { shouldDirty: true })}
                  defaultValue={watch('description')}
                  className="border-white/20"
                  placeholder="Nhập mô tả..."
                  rows={3}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 border-t border-white/10 pt-4">
                <Button
                  type="submit"
                  disabled={!isDirty || isUpdating}
                  className="flex-1 border-white bg-white font-mono text-black uppercase hover:bg-zinc-200 disabled:opacity-50"
                >
                  <Save size={16} className="mr-2" />
                  Lưu
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleCancel}
                  disabled={!isDirty}
                  className="flex-1 font-mono uppercase hover:bg-white/10 disabled:opacity-50"
                >
                  <X size={16} className="mr-2" />
                  Bỏ Qua
                </Button>
              </div>
            </div>
          </div>

          {/* Right: Video List */}
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <Typography variant="h4" className="font-mono uppercase">
                Danh Sách Video ({playlistVideos.length})
              </Typography>
              <Button
                size="sm"
                onClick={() => setIsAddVideoModalOpen(true)}
                className="border-white bg-white font-mono text-xs text-black uppercase hover:bg-zinc-200"
              >
                <Plus size={14} className="mr-2" />
                Thêm Video
              </Button>
            </div>

            {/* Draggable List */}
            <DraggableVideoList
              videos={playlistVideos}
              activeVideoId={activeVideoId}
              onReorder={handleReorder}
              onPlayVideo={handlePlayVideo}
              onRemoveVideo={handleRemoveVideo}
            />
          </div>
        </form>
      )}

      {/* Modals */}
      <AddVideoModal
        isOpen={isAddVideoModalOpen}
        onClose={() => setIsAddVideoModalOpen(false)}
        onAddVideo={handleAddVideo}
        existingVideoIds={playlistVideos.map((v) => v.video_id)}
      />

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, type: null, video: null })}
        onConfirm={handleConfirmDelete}
        title={deleteModal.type === 'playlist' ? 'Xóa Playlist' : 'Xóa Video'}
        message={
          deleteModal.type === 'playlist'
            ? `Đây là video cuối cùng trong playlist. Xóa video này sẽ xóa luôn playlist "${playlist?.name}". Bạn có chắc chắn?`
            : `Bạn có chắc chắn muốn xóa video "${deleteModal.video?.title}" khỏi playlist?`
        }
        confirmText={deleteModal.type === 'playlist' ? 'Xóa Playlist' : 'Xóa Video'}
      />
    </div>
  );
}

export default PlaylistDetailPage;
