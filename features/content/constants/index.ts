import { ContentStatus, SortOrder } from '@/shared/types';

export const STATUS_LABELS = {
  [ContentStatus.DRAFT]: 'Nháp',
  [ContentStatus.PENDING_REVIEW]: 'Chờ Duyệt',
  [ContentStatus.APPROVED]: 'Đã Duyệt',
  [ContentStatus.SCHEDULED]: 'Đã Lên Lịch',
  [ContentStatus.REJECTED]: 'Bị Từ Chối',
  [ContentStatus.PUBLISHED]: 'Đã Đăng',
  [ContentStatus.ARCHIVED]: 'Lưu Trữ',
};

export const DRAFT_CONTENT_SEARCH_SORT_OPTIONS = [
  { id: SortOrder.ASC, label: 'Cũ nhất' },
  { id: SortOrder.DESC, label: 'Mới nhất' },
];

export const DRAFT_CONTENT_SEARCH_IS_PREVIEWED_OPTIONS = [
  { id: undefined, label: 'Tất cả' },
  { id: 'true', label: 'Đã xem trước' },
];
