import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Textarea,
} from '@/shared/ui';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';

// Modal components từ App.tsx
function RejectConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError('Vui lòng nhập lý do từ chối.');
      return;
    }
    onConfirm(reason);
    setReason('');
    setError('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle size={20} /> Xác Nhận Từ Chối
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <p className="text-muted-foreground font-mono text-sm">
            Hành động này sẽ chuyển trạng thái bài viết về &ldquo;Từ Chối&rdquo; và yêu cầu chỉnh
            sửa.
          </p>
          <div className="flex flex-col gap-2">
            <label htmlFor="reject-reason" className="font-mono text-xs font-medium uppercase">
              Lý do từ chối
            </label>
            <Textarea
              id="reject-reason"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError('');
              }}
              placeholder="Nhập lý do chi tiết..."
              className="h-24 font-mono text-sm"
            />
            {error && <p className="text-destructive font-mono text-xs">{error}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy Bỏ
          </Button>
          <Button variant="destructive" onClick={handleSubmit}>
            Xác Nhận Từ Chối
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default RejectConfirmationModal;
