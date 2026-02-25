'use client';

import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui';

interface DeleteRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  roleName: string;
  isLoading?: boolean;
}

export const DeleteRoleModal = ({
  isOpen,
  onClose,
  onConfirm,
  roleName,
  isLoading = false,
}: DeleteRoleModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isLoading && !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận xóa vai trò</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-gray-600">
            Bạn có chắc chắn muốn xóa vai trò <strong>{roleName}</strong>? Hành động này không thể
            hoàn tác.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
            {isLoading && (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            Xóa vai trò
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
