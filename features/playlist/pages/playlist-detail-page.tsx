import { ThumbnailUpload, VideoPlayer } from '@/shared/components';
import { Button, CarouselContent, Label, Textarea, Typography } from '@/shared/ui';
import FormField from '@/shared/ui/form-field';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from '@tanstack/react-router';
import { ArrowLeft, Plus, Save, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { MediaType } from '@/shared';
import { MediaCarousel } from '@/features/content';
import {
  AddVideosModal,
  DeleteConfirmationModal,
  DraggableVideoList,
  DraggableVideoListSkeleton,
  PlaylistDetailSkeleton,
  PlaylistFormSkeleton,
} from '../components';

import { useDeletePlaylist, usePlaylist, useUpdatePlaylist } from '../hooks/usePlaylist';
import { updatePlaylistSchema, UpdatePlaylistSchema } from '../schema/update-playlist.schema';
import { usePlaylistStore } from '../stores/usePlaylistStore';
import type { PlaylistContent } from '../types';

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
    video: PlaylistContent | null;
  }>({
    isOpen: false,
    type: null,
    video: null,
  });

  const { data: playlist, isLoading } = usePlaylist(playlistId!);
  const initialRender = useRef(false);

  // Mutations
  const { mutate: updatePlaylist, isPending: isUpdating } = useUpdatePlaylist();
  const { mutate: deletePlaylist, isPending: isDeleting } = useDeletePlaylist();

  // Local state
  const {
    register,
    handleSubmit,
    formState: { isDirty, dirtyFields },
    watch,
    reset,
    setValue,
    control,
  } = useForm<UpdatePlaylistSchema>({
    values: playlist
      ? {
          name: playlist.name,
          description: playlist.description || '',
          video_ids: playlist.contents?.map((v) => v.video_id) || [],
          thumbnail: playlist.thumbnail_url || '',
        }
      : undefined,
    resolver: zodResolver(updatePlaylistSchema),
    mode: 'all',
  });

  const watchedVideoIds = useMemo(() => watch('video_ids') || [], [watch]);

  useEffect(() => {
    if (playlist?.contents && !initialRender.current) {
      initialRender.current = true;
      setActiveVideoId(playlist.contents?.[0]?.id || null);
      setPlaylistVideos(playlist.contents || []);
    }
  }, [playlist, setActiveVideoId, setPlaylistVideos]);

  // Handlers
  const handleSave = (data: UpdatePlaylistSchema) => {
    if (!playlistId) return;

    if (playlistVideos.length === 0) {
      setDeleteModal({
        isOpen: true,
        type: 'playlist',
        video: null,
      });
      return;
    }

    const payload: UpdatePlaylistSchema = {};

    Object.keys(dirtyFields || {}).forEach((key) => {
      const typedKey = key as keyof UpdatePlaylistSchema;
      // @ts-expect-error - Dynamic key assignment from form data
      payload[typedKey] = data[typedKey];
    });

    updatePlaylist({
      id: playlistId,
      payload,
    });
  };

  const handleCancel = () => {
    reset({
      name: playlist?.name || '',
      description: playlist?.description || '',
      video_ids: playlist?.contents?.map((v) => v.video_id) || [],
      thumbnail: playlist?.thumbnail_url || '',
    });
  };

  const handleAddVideo = (video: PlaylistContent) => {
    if (!playlistId) return;

    addVideoToPlaylist(playlistId, {
      ...video,
      position: playlistVideos.length + 1,
    });
    setValue('video_ids', [...watchedVideoIds, video.video_id], {
      shouldDirty: true,
    });
  };

  const handleRemoveVideo = (video: PlaylistContent) => {
    const newVideos = playlistVideos.filter((v) => v.id !== video.id);

    // Check if it's the last video
    setValue('video_ids', newVideos.map((v) => v.video_id) || [], {
      shouldDirty: true,
    });
    removeVideoFromPlaylist(playlistId, video.id);
  };

  const handleConfirmDelete = (onSuccess?: () => void) => {
    if (!playlistId) return;

    deletePlaylist(playlistId, {
      onSuccess: () => {
        onSuccess?.();
        navigate({ to: '/playlists' });
      },
    });
  };

  const handlePlayVideo = (video: PlaylistContent) => {
    setActiveVideoId(video.id);
  };

  const handleReorder = (reorderedVideos: PlaylistContent[]) => {
    if (!playlistId) return;

    setPlaylistVideos(reorderedVideos);
    setValue(
      'video_ids',
      reorderedVideos.map((v) => v.video_id),
      {
        shouldDirty: true,
      }
    );
  };

  // Get active video
  const activeVideo = playlist?.contents?.find((v) => v.id === activeVideoId);

  if (isLoading) return <PlaylistDetailSkeleton />;

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
            Chi tiết danh sách phát
          </Typography>
        </div>
      </div>

      {/* Content */}
      {!isLoading && playlist && (
        <div className="grid flex-1 gap-6 lg:grid-cols-2">
          {/* Left: Video Player & Info */}
          <div className="aspect-video space-y-6">
            {/* Video Player */}
            {!activeVideo && (
              <div className="flex h-full w-full items-center justify-center border border-white/10 bg-black">
                <Typography variant="small" className="font-mono text-zinc-500 uppercase">
                  Chọn video để phát
                </Typography>
              </div>
            )}
            {activeVideo &&
              (activeVideo.type === MediaType.REEL ? (
                <VideoPlayer
                  url={activeVideo.url}
                  poster={activeVideo.thumbnail_url}
                  title={activeVideo.title}
                  aspectRatio="video"
                />
              ) : (
                <MediaCarousel
                  media={activeVideo.media}
                  title={activeVideo.title}
                  aspectRatio="video"
                  size="lg"
                  objectFit="contain"
                />
              ))}

            {/* Active Video Info */}
            {activeVideo && (
              <div className="space-y-4 border border-white/10 bg-black p-6">
                <Typography className="font-mono text-lg text-white uppercase">
                  {activeVideo.title}
                </Typography>
                <div className="flex items-center gap-4 text-sm">
                  <Typography variant="small" className="font-mono text-zinc-500">
                    Vị trí: {activeVideo.position}/{playlistVideos.length}
                  </Typography>
                  <Typography variant="small" className="font-mono text-zinc-500">
                    Thời lượng: {Math.floor(activeVideo.duration / 60)}:
                    {(activeVideo.duration % 60).toString().padStart(2, '0')}
                  </Typography>
                </div>
              </div>
            )}
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
          </div>

          {/* Playlist Info Form */}
          <form
            onSubmit={handleSubmit(handleSave)}
            className="h-fit space-y-4 border border-white/10 bg-black p-6"
          >
            <Typography variant="h4" className="font-mono uppercase">
              Thông Tin Danh Sách Phát
            </Typography>

            {/* Name */}
            <div className="space-y-2">
              <FormField
                control={control}
                label="Tên Danh Sách Phát"
                placeholder="Nhập tên đăng nhập..."
                {...register('name')}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-xs">Mô Tả</Label>
              <Textarea
                {...register('description')}
                onChange={(e) => setValue('description', e.target.value, { shouldDirty: true })}
                defaultValue={watch('description')}
                className="border-white/20"
                placeholder="Nhập mô tả..."
                rows={3}
              />
            </div>

            {/* Thumbnail */}
            <div className="space-y-2">
              <Label className="text-xs">Ảnh đại diện</Label>
              <ThumbnailUpload
                value={watch('thumbnail')}
                onChange={(base64: string) => setValue('thumbnail', base64, { shouldDirty: true })}
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
          </form>
        </div>
      )}

      {/* Modals */}
      <AddVideosModal
        isOpen={isAddVideoModalOpen}
        onClose={() => setIsAddVideoModalOpen(false)}
        onAddVideo={handleAddVideo}
        existingVideoIds={playlistVideos.map((v) => v.video_id)}
      />

      <DeleteConfirmationModal
        isDeleting={isDeleting}
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
