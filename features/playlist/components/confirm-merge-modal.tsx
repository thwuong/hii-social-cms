import { Button, Dialog, DialogContent, Typography } from '@/shared/ui';
import { AlertTriangle } from 'lucide-react';

interface ConfirmMergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function ConfirmMergeModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: ConfirmMergeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md border-white/20 bg-black p-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <Typography variant="h4" className="font-mono uppercase">
              Xác nhận gộp nền tảng
            </Typography>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <Typography className="text-zinc-300">
            Các video trong danh sách phát thuộc nhiều nền tảng khác nhau. Bạn có muốn gộp chúng lại
            không?
          </Typography>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-white/10 p-6">
          <Button
            variant="ghost"
            onClick={onClose}
            className="font-mono uppercase hover:bg-white/10"
          >
            Hủy
          </Button>
          <Button
            isLoading={isLoading}
            onClick={onConfirm}
            className="border-white bg-white font-mono text-black uppercase hover:bg-zinc-200"
          >
            Xác nhận
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
