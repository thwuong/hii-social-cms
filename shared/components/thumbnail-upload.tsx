import { Button, Typography } from '@/shared/ui';
import { Upload, X } from 'lucide-react';
import { useRef } from 'react';
import { toast } from 'sonner';

interface ThumbnailUploadProps {
  value?: string; // base64 string
  onChange: (value: string) => void;
  onRemove?: () => void;
  maxSizeMB?: number;
  className?: string;
  disabled?: boolean;
}

/**
 * Thumbnail Upload Component
 *
 * Reusable component for uploading and previewing image thumbnails
 * - File validation (type + size)
 * - Base64 conversion
 * - Preview with delete
 * - Toast notifications
 *
 * @example
 * <ThumbnailUpload
 *   value={thumbnail}
 *   onChange={(base64) => setValue('thumbnail', base64)}
 *   maxSizeMB={5}
 * />
 */
export function ThumbnailUpload({
  value,
  onChange,
  onRemove,
  maxSizeMB = 5,
  className = '',
  disabled = false,
}: ThumbnailUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh');
      return;
    }

    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error(`Kích thước file tối đa ${maxSizeMB}MB`);
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      onChange(result);
    };
    reader.onerror = () => {
      toast.error('Lỗi khi đọc file');
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onRemove) {
      onRemove();
    } else {
      onChange('');
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={className}>
      {!value ? (
        // Empty State - Upload Button
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled}
          className="group relative flex h-40 w-full cursor-pointer items-center justify-center border border-dashed border-white/20 bg-zinc-900 transition-all hover:border-white/40 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={disabled}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center border border-white/20 bg-zinc-800 transition-colors group-hover:border-white/40">
              <Upload className="h-6 w-6 text-zinc-400 transition-colors group-hover:text-white" />
            </div>
            <div className="text-center">
              <Typography variant="small" className="font-mono text-zinc-400">
                Click để upload thumbnail
              </Typography>
              <Typography variant="tiny" className="mt-1 font-mono text-zinc-600">
                PNG, JPG, GIF (Max {maxSizeMB}MB)
              </Typography>
            </div>
          </div>
        </button>
      ) : (
        // Filled State - Preview with Delete
        <div className="group relative h-40 overflow-hidden border border-white/20 bg-black">
          <img src={value} alt="Thumbnail preview" className="h-full w-full object-cover" />
          {!disabled && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={handleRemove}
                className="font-mono text-xs uppercase"
              >
                <X size={14} className="mr-1" />
                Xóa
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ThumbnailUpload;
