import { AlertTriangle } from 'lucide-react';

import { Button, Dialog, DialogContent, Typography } from '@/shared/ui';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'destructive' | 'primary';
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  variant = 'destructive',
  isLoading = false,
}: ConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md border-white/20 bg-black p-0 sm:rounded-none">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <div className="flex items-center gap-3">
            {variant === 'destructive' && <AlertTriangle className="h-5 w-5 text-red-500" />}
            <Typography variant="h4" className="font-mono text-white uppercase">
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
            className="font-mono text-xs uppercase hover:bg-white/10"
          >
            {cancelText}
          </Button>
          <Button isLoading={isLoading} onClick={onConfirm} variant={variant as any}>
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
