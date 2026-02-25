import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui';
import { AlertTriangle } from 'lucide-react';

interface AcceptConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  count?: number;
}

function AcceptConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  count = 1,
}: AcceptConfirmationModalProps) {
  const handleSubmit = () => {
    onConfirm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-yellow-500">
            <AlertTriangle size={20} /> Xác Nhận Chấp Nhận Report
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <p className="text-muted-foreground font-mono text-sm">
            Hành động này sẽ <span className="font-bold text-red-500">ẨN {count} VIDEO</span> khỏi
            hệ thống.
            {count > 1 ? ' Các video' : ' Video'} sẽ không còn hiển thị với người dùng.
          </p>
          {count > 1 && (
            <div className="border-l-2 border-yellow-500 bg-yellow-500/5 p-3">
              <p className="font-mono text-xs text-yellow-500">
                ⚠️ Bạn đang xử lý {count} báo cáo cùng lúc
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy Bỏ
          </Button>
          <Button
            variant="default"
            onClick={handleSubmit}
            className="bg-yellow-600 hover:bg-yellow-700"
          >
            Xác Nhận Chấp Nhận {count > 1 && `(${count})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AcceptConfirmationModal;
