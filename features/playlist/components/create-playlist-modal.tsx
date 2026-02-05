import { Button, Dialog, DialogContent, Typography } from '@/shared/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CreatePlaylistDto } from '../dto';
import { CreatePlaylistSchema, createPlaylistSchema } from '../schema/create-playlist.schema';
import type { PlaylistContent } from '../types';
import { AddVideosModal } from './add-videos-modal';
import { PlaylistForm } from './playlist-form';

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreatePlaylistDto, onSuccess?: () => void) => void;
  selectedVideoIds?: string[];
  isCreating: boolean;
}

export function CreatePlaylistModal({
  isOpen,
  onClose,
  onSubmit,
  selectedVideoIds = [],
  isCreating,
}: CreatePlaylistModalProps) {
  const [isAddVideoModalOpen, setIsAddVideoModalOpen] = useState(false);
  const [selectedVideos, setSelectedVideos] = useState<PlaylistContent[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isValid, isDirty },
  } = useForm<CreatePlaylistSchema>({
    resolver: zodResolver(createPlaylistSchema),
    defaultValues: {
      name: '',
      description: undefined,
      video_ids: [],
      thumbnail: undefined,
    },
  });

  const handleClose = () => {
    reset();
    setSelectedVideos([]);
    onClose();
  };

  const handleAddVideo = (video: PlaylistContent) => {
    const videoIds = watch('video_ids');
    setValue('video_ids', [...videoIds, video.video_id], {
      shouldDirty: true,
      shouldValidate: true,
    });
    setSelectedVideos((prev) => [...prev, video]);
  };

  const handleRemoveVideo = (videoId: string) => {
    const videoIds = watch('video_ids');
    setValue(
      'video_ids',
      videoIds.filter((id) => id !== videoId),
      { shouldDirty: true, shouldValidate: true }
    );
    setSelectedVideos((prev) => prev.filter((v) => v.id !== videoId));
  };

  const onSubmitForm = (data: CreatePlaylistSchema) => {
    onSubmit(
      {
        ...data,
      },
      handleClose
    );
  };

  const totalVideoCount = selectedVideoIds.length + selectedVideos.length;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="!max-w-3xl border-white/20 bg-black p-0">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 p-6">
            <Typography variant="h4" className="font-mono uppercase">
              Tạo Danh Sách Phát Mới
            </Typography>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmitForm)} className="p-6">
            <PlaylistForm
              control={control}
              watch={watch}
              setValue={setValue}
              selectedVideoCount={totalVideoCount}
              showVideoCount={totalVideoCount > 0}
            />

            {/* Add Videos Section */}
            <div className="mt-6 space-y-3 border-t border-white/10 pt-6">
              <div className="flex items-center justify-between">
                <Typography variant="small" className="font-mono text-zinc-500 uppercase">
                  Videos ({totalVideoCount})
                </Typography>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setIsAddVideoModalOpen(true)}
                  className="border-white bg-white font-mono text-xs text-black uppercase hover:bg-zinc-200"
                >
                  <Plus size={14} className="mr-2" />
                  Thêm Video
                </Button>
              </div>

              {selectedVideos.length === 0 && (
                <div className="flex items-center justify-center gap-2 border border-red-500/10 bg-red-500/5 p-2">
                  <AlertTriangle size={14} className="text-red-500" />
                  <Typography variant="small" className="font-mono text-red-500">
                    Chọn ít nhất 1 video
                  </Typography>
                </div>
              )}

              {/* Selected Videos List */}
              {selectedVideos.length > 0 && (
                <div className="space-y-2 overflow-y-auto">
                  {selectedVideos.map((video) => (
                    <div
                      key={video.id}
                      className="flex items-center gap-3 border border-white/10 bg-zinc-900/50 p-2"
                    >
                      <img
                        src={video.thumbnail_url}
                        alt={video.title}
                        className="h-12 w-20 object-cover"
                      />
                      <div className="flex flex-1 flex-col gap-1 overflow-hidden">
                        <Typography variant="small" className="truncate text-white">
                          {video.title}
                        </Typography>
                        <Typography variant="small" className="truncate text-zinc-500">
                          {video.platforms.join(', ')}
                        </Typography>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveVideo(video.id)}
                        className="text-sm text-zinc-500 hover:text-red-500"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-white/10 p-6">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              className="font-mono uppercase hover:bg-white/10"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit(onSubmitForm)}
              isLoading={isCreating}
              disabled={!isValid || !isDirty}
              className="border-white bg-white font-mono text-black uppercase hover:bg-zinc-200"
            >
              Tạo Danh Sách Phát
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Videos Modal */}
      <AddVideosModal
        isOpen={isAddVideoModalOpen}
        onClose={() => setIsAddVideoModalOpen(false)}
        onAddVideo={handleAddVideo}
        onRemoveVideo={handleRemoveVideo}
        existingVideoIds={[...selectedVideoIds, ...selectedVideos.map((v) => v.video_id)]}
      />
    </>
  );
}
