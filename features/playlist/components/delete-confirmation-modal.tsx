import { Button, Dialog, DialogContent, Typography } from '@/shared/ui';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  isDestructive?: boolean;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Xóa',
  isDestructive = true,
}: DeleteConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md border-white/20 bg-black p-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <div className="flex items-center gap-3">
            {isDestructive && <AlertTriangle className="h-5 w-5 text-red-500" />}
            <Typography variant="h4" className="font-mono uppercase">
              {title}
            </Typography>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <Typography className="text-zinc-300">{message}</Typography>
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
            onClick={handleConfirm}
            className={
              isDestructive
                ? 'border-red-900 bg-red-900 font-mono text-white uppercase hover:bg-red-800'
                : 'border-white bg-white font-mono text-black uppercase hover:bg-zinc-200'
            }
          >
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
