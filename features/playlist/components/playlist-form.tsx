import { ThumbnailUpload } from '@/shared/components';
import { Label, Textarea, Typography } from '@/shared/ui';
import FormField from '@/shared/ui/form-field';
import type { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import type { CreatePlaylistSchema } from '../schema/create-playlist.schema';

interface PlaylistFormProps {
  control: Control<CreatePlaylistSchema>;
  watch: UseFormWatch<CreatePlaylistSchema>;
  setValue: UseFormSetValue<CreatePlaylistSchema>;
  selectedVideoCount?: number;
  showVideoCount?: boolean;
  className?: string;
}

/**
 * Playlist Form Component
 *
 * Reusable form fields for creating/editing playlists
 * - Name field (required)
 * - Description field (optional)
 * - Thumbnail upload (optional)
 * - Video count display (optional)
 *
 * @example
 * const { control, watch, setValue } = useForm<CreatePlaylistSchema>();
 *
 * <PlaylistForm
 *   control={control}
 *   watch={watch}
 *   setValue={setValue}
 *   selectedVideoCount={5}
 *   showVideoCount={true}
 * />
 */
export function PlaylistForm({
  control,
  watch,
  setValue,
  selectedVideoCount = 0,
  showVideoCount = false,
  className = '',
}: PlaylistFormProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Name Field */}
      <div className="space-y-2">
        <FormField
          control={control}
          required
          name="name"
          label="Tiêu đề"
          placeholder="Nhập tiêu đề..."
        />
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <Label htmlFor="playlist-description" className="text-xs">
          Mô Tả
        </Label>
        <Textarea
          id="playlist-description"
          placeholder="Nhập mô tả danh sách phát..."
          value={watch('description')}
          onChange={(e) => setValue('description', e.target.value)}
          className="border-white/20 bg-zinc-900 font-mono text-white"
          rows={3}
        />
      </div>

      {/* Thumbnail Upload */}
      <div className="space-y-2">
        <Label className="text-xs">Ảnh đại diện</Label>
        <ThumbnailUpload
          value={watch('thumbnail')}
          onChange={(base64: string) =>
            setValue('thumbnail', base64, { shouldValidate: true, shouldDirty: true })
          }
          maxSizeMB={5}
        />
      </div>

      {/* Video Count (Optional) */}
      {showVideoCount && selectedVideoCount > 0 && (
        <div className="flex items-center gap-2 border-t border-white/10 pt-4">
          <Typography variant="small" className="font-mono text-zinc-500">
            {selectedVideoCount} video {selectedVideoCount > 1 ? 'đã chọn' : 'đã chọn'}
          </Typography>
        </div>
      )}
    </div>
  );
}

export default PlaylistForm;
