import { ContentBody } from '@/features/content';
import { ContentItem, toast } from '@/shared';
import { ThumbnailUpload } from '@/shared/components';
import { Badge, Button, Label, Textarea, Typography } from '@/shared/ui';
import FormField from '@/shared/ui/form-field';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from '@tanstack/react-router';
import { Globe, Plus, Save, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  AddVideosModal,
  ConfirmMergeModal,
  DeleteConfirmationModal,
  DraggableVideoList,
  PlaylistDetailSkeleton,
} from '../components';

import { useDeletePlaylist, usePlaylist, useUpdatePlaylist } from '../hooks/usePlaylist';
import { updatePlaylistSchema, UpdatePlaylistSchema } from '../schema/update-playlist.schema';
import { usePlaylistStore } from '../stores/usePlaylistStore';
import type { PlaylistContent } from '../types';
import { checkIsPlaylistPlatform } from '../utils';

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

  const [isConfirmMergeModalOpen, setIsConfirmMergeModalOpen] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<UpdatePlaylistSchema | null>(null);

  const { data: playlist, isLoading } = usePlaylist(playlistId!);
  const initialRender = useRef(false);

  // Mutations
  const { mutate: updatePlaylist, isPending: isUpdating } = useUpdatePlaylist();
  const { mutate: deletePlaylist, isPending: isDeleting } = useDeletePlaylist();

  // Local state
  const {
    register,
    handleSubmit,
    formState: { isDirty, dirtyFields, isValid },
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
    mode: 'onChange',
  });

  const watchedVideoIds = useMemo(() => watch('video_ids') || [], [watch, playlist]);

  useEffect(() => {
    if (playlist?.contents && !initialRender.current) {
      initialRender.current = true;
      setActiveVideoId(playlist.contents?.[0]?.id || null);
      setPlaylistVideos(playlist.contents || []);
    }
  }, [playlist, setActiveVideoId, setPlaylistVideos]);

  // Handlers
  const handleUpdatePlaylist = (
    id: string,
    payload: UpdatePlaylistSchema,
    isMergedPlatforms?: boolean
  ) => {
    updatePlaylist(
      {
        id,
        payload: {
          ...payload,
          is_merged_platforms: isMergedPlatforms || false,
        },
      },
      {
        onSuccess: () => {
          reset({
            name: playlist?.name || '',
            description: playlist?.description || '',
            video_ids: playlist?.contents?.map((v) => v.video_id) || [],
            thumbnail: playlist?.thumbnail_url || '',
          });
          toast.success('Cập nhật thành công');
        },
        onError: () => {
          toast.error('Cập nhật thất bại');
        },
      }
    );
  };

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

    const payload: any = {};

    Object.keys(dirtyFields || {}).forEach((key) => {
      const typedKey = key as keyof any;
      // @ts-expect-error - Dynamic key assignment from form data
      payload[typedKey] = data[typedKey];
    });

    const isMergedPlatforms = checkIsPlaylistPlatform(playlistVideos);

    if (isMergedPlatforms) {
      setPendingPayload(payload);
      setIsConfirmMergeModalOpen(true);
      return;
    }

    handleUpdatePlaylist(playlistId, payload);
  };

  const handleCancel = () => {
    reset({
      name: playlist?.name || '',
      description: playlist?.description || '',
      video_ids: playlist?.contents?.map((v) => v.video_id) || [],
      thumbnail: playlist?.thumbnail_url || '',
    });
    setPlaylistVideos(playlist?.contents || []);
  };

  const handleAddVideo = (video: PlaylistContent) => {
    if (!playlistId) return;

    addVideoToPlaylist(playlistId, {
      ...video,
      position: playlistVideos.length + 1,
    });
    setValue('video_ids', [...watchedVideoIds, video.video_id], {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleRemoveVideo = (videoId: string) => {
    const newVideos = playlistVideos.filter((v) => v.id !== videoId);

    // Check if it's the last video
    setValue('video_ids', newVideos.map((v) => v.video_id) || [], {
      shouldDirty: true,
      shouldValidate: true,
    });
    removeVideoFromPlaylist(playlistId, videoId);
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
        shouldValidate: true,
      }
    );
  };

  const handleConfirmMerge = () => {
    if (!playlistId || !pendingPayload) return;
    handleUpdatePlaylist(playlistId, pendingPayload, true);
    setIsConfirmMergeModalOpen(false);
    setPendingPayload(null);
  };

  // Get active video
  const activeVideo = playlist?.contents?.find((v) => v.id === activeVideoId);

  if (isLoading) return <PlaylistDetailSkeleton />;

  return (
    <div className="detail-layout animate-in fade-in grid-cols-[350px_1fr_350px]! overflow-hidden p-4 duration-300 max-lg:grid-cols-1 sm:p-10">
      {/* Playlist Info Form */}
      <form
        onSubmit={handleSubmit(handleSave)}
        className="flex h-full flex-col overflow-hidden border-r border-white/10"
        id="playlist-info-form"
      >
        <div className="scrollbar-hide flex-1 overflow-y-auto p-4">
          <div className="flex flex-col gap-4">
            <Typography variant="h4" className="font-mono uppercase">
              Thông Tin Danh Sách Phát
            </Typography>

            {/* Thumbnail */}
            <div className="space-y-2">
              <Label className="text-xs">
                Ảnh đại diện <span className="text-red-500">*</span>
              </Label>
              <ThumbnailUpload
                value={watch('thumbnail')}
                onChange={(base64: string) =>
                  setValue('thumbnail', base64, { shouldDirty: true, shouldValidate: true })
                }
              />
            </div>
            {/* Name */}
            <div className="space-y-2">
              <FormField
                required
                control={control}
                label="Tiêu đề"
                placeholder="Nhập tiêu đề..."
                {...register('name')}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-xs">Mô Tả</Label>
              <Textarea
                {...register('description')}
                onChange={(e) =>
                  setValue('description', e.target.value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                defaultValue={watch('description')}
                className="border-white/20"
                placeholder="Nhập mô tả..."
                rows={3}
              />
            </div>

            {/* Right: Video List */}
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <Typography variant="h5" className="font-mono uppercase">
                  Danh Sách ({playlistVideos.length})
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
        </div>

        {/* Actions - Fixed at Bottom */}
        <div className="mt-auto flex items-center gap-3 border-t border-white/10 bg-black/80 p-4 backdrop-blur-sm">
          <Button
            type="submit"
            isLoading={isUpdating}
            disabled={!isDirty || !isValid}
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

      {/* Content */}
      {!isLoading && (
        <section className="viewport-container group">
          {activeVideo && (
            <div className="shutter-frame">
              <div className="shutter-blade shutter-top" />
              <div className="shutter-blade shutter-bottom" />

              {/* UI Overlay */}
              <div className="ui-overlay">
                <div className="scanline" />
              </div>

              {/* Media Content */}
              <ContentBody
                content={
                  {
                    media_url: activeVideo.url,
                    media_type: activeVideo.type,
                    media: activeVideo.media,
                    title: activeVideo.title,
                    tags: activeVideo.tags,
                    created_at: activeVideo.created_at,
                  } as ContentItem
                }
              />
            </div>
          )}
          {!activeVideo && (
            <div className="flex h-full w-full items-center justify-center border border-white/10 bg-black">
              <Typography variant="small" className="font-mono text-zinc-500 uppercase">
                Chọn video để phát
              </Typography>
            </div>
          )}

          {/* Close Button */}
          <Button
            variant="ghost"
            className="absolute top-4 right-4 z-40 text-zinc-500 hover:text-white"
            onClick={() => navigate({ to: '/playlists' })}
          >
            <X size={20} />
          </Button>
        </section>
      )}

      {/* RIGHT: INSPECTOR SECTION */}
      <div className="flex flex-col gap-4 py-4">
        {/* DESCRIPTION */}
        <div className="flex flex-col gap-2">
          <Typography variant="small" className="text-muted-foreground font-medium">
            NHẬT KÝ PHIÊN DỊCH
          </Typography>
          <p className="font-base border border-transparent">&ldquo;{activeVideo?.title}&rdquo;</p>
        </div>

        {/* TAGS */}
        {!!activeVideo?.tags?.length && (
          <div className="flex flex-col gap-2">
            <Typography variant="small" className="text-muted-foreground font-medium">
              THẺ PHÂN LOẠI
            </Typography>
            <div className="flex flex-wrap gap-1.5">
              {activeVideo?.tags.map((tag: string) => (
                <Badge key={tag} variant="default">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* DISTRIBUTION NETWORKS */}
        {!!activeVideo?.platforms?.length && (
          <div className="flex flex-col gap-2">
            <Typography variant="small" className="text-muted-foreground font-medium">
              MẠNG LƯỚI PHÂN PHỐI
            </Typography>
            <div className="flex flex-wrap gap-1.5">
              {activeVideo?.platforms.map((platform) => (
                <Badge variant="default" key={platform}>
                  <Globe size={10} />
                  {platform}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* CATEGORIES */}
        {!!activeVideo?.categories?.length && (
          <div className="flex flex-col gap-2">
            <Typography variant="small" className="text-muted-foreground font-medium">
              DANH MỤC
            </Typography>
            <div className="flex flex-wrap gap-1.5">
              {activeVideo?.categories.map((category) => (
                <Badge variant="default" key={category}>
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddVideosModal
        isOpen={isAddVideoModalOpen}
        onClose={() => setIsAddVideoModalOpen(false)}
        onAddVideo={handleAddVideo}
        existingVideoIds={playlistVideos.map((v) => v.video_id)}
        onRemoveVideo={handleRemoveVideo}
      />

      <DeleteConfirmationModal
        isDeleting={isDeleting}
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, type: null, video: null })}
        onConfirm={handleConfirmDelete}
        title={deleteModal.type === 'playlist' ? 'Xóa Playlist' : 'Xóa Video'}
        message={`Đây là video cuối cùng trong playlist. Xóa video này sẽ xóa luôn playlist "${playlist?.name}". Bạn có chắc chắn?`}
        confirmText={deleteModal.type === 'playlist' ? 'Xóa Playlist' : 'Xóa Video'}
      />

      <ConfirmMergeModal
        isOpen={isConfirmMergeModalOpen}
        onClose={() => {
          setIsConfirmMergeModalOpen(false);
          setPendingPayload(null);
        }}
        onConfirm={handleConfirmMerge}
        isLoading={isUpdating}
      />
    </div>
  );
}

export default PlaylistDetailPage;
