import { ContentStatus } from '@/shared/types';

export const STATUS_LABELS = {
  [ContentStatus.DRAFT]: 'Nháp',
  [ContentStatus.PENDING_REVIEW]: 'Chờ Duyệt',
  [ContentStatus.APPROVED]: 'Đã Duyệt',
  [ContentStatus.SCHEDULED]: 'Đã Lên Lịch',
  [ContentStatus.REJECTED]: 'Bị Từ Chối',
  [ContentStatus.PUBLISHED]: 'Đã Đăng',
  [ContentStatus.ARCHIVED]: 'Lưu Trữ',
};
