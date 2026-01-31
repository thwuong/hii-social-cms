import { Button, Dialog, DialogContent, Typography } from '@/shared/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CreatePlaylistDto } from '../dto';
import { CreatePlaylistSchema, createPlaylistSchema } from '../schema/create-playlist.schema';
import { PlaylistForm } from './playlist-form';

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreatePlaylistDto) => void;
  selectedVideoIds?: string[];
}

export function CreatePlaylistModal({
  isOpen,
  onClose,
  onSubmit,
  selectedVideoIds = [],
}: CreatePlaylistModalProps) {
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
      description: '',
      video_ids: [],
      thumbnail: '',
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmitForm = (data: CreatePlaylistSchema) => {
    onSubmit({
      ...data,
      video_ids: selectedVideoIds,
      thumbnail: data.thumbnail || '',
    });

    // Reset form
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md border-white/20 bg-black p-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <Typography variant="h4" className="font-mono uppercase">
            Tạo Playlist Mới
          </Typography>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmitForm)} className="p-6">
          <PlaylistForm
            control={control}
            watch={watch}
            setValue={setValue}
            selectedVideoCount={selectedVideoIds.length}
            showVideoCount={selectedVideoIds.length > 0}
          />
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
            disabled={!isValid || !isDirty}
            className="border-white bg-white font-mono text-black uppercase hover:bg-zinc-200"
          >
            Tạo Playlist
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
