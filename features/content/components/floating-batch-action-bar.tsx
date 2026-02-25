import { ContentStatus, Permission, PermissionGate } from '@/shared';
import { Button } from '@/shared/ui';
import { useEffect, useRef, useState } from 'react';

export interface FloatingBatchActionBarProps {
  // Selection state
  selectedCount: number;
  approvingStatus: ContentStatus;

  // Loading states
  isApproving?: boolean;
  isRejecting?: boolean;
  isPublishing?: boolean;
  isScheduling?: boolean;

  // Actions
  onApprove: () => void;
  onReject: () => void;
  onPublish?: () => void;
  onSchedule?: () => void;
  onCancel: () => void;
  onAddToPlaylist?: () => void; // NEW: Add to playlist action

  // Customization
  approveLabel?: string;
  rejectLabel?: string;
  publishLabel?: string;
  scheduleLabel?: string;
  cancelLabel?: string;
  addToPlaylistLabel?: string;
}

/**
 * Floating Batch Action Bar Component
 *
 * Component dùng cho batch actions (approve, reject) với khả năng chọn categories
 * Style: Carbon Kinetic / Hii Social Theme
 *
 * @example
 * <FloatingBatchActionBar
 *   selectedCount={5}
 *   approveCount={3}
 *   rejectCount={2}
 *   onApprove={handleApprove}
 *   onReject={handleReject}
 *   onCancel={handleCancel}
 *   categories={['Category A', 'Category B']}
 *   showCategorySelector
 * />
 */
export function FloatingBatchActionBar({
  selectedCount,
  approvingStatus,
  isApproving = false,
  isRejecting = false,
  isPublishing = false,
  isScheduling = false,
  onApprove,
  onReject,
  onPublish,
  onSchedule,
  onCancel,
  onAddToPlaylist,
  approveLabel = 'DUYỆT',
  rejectLabel = 'TỪ CHỐI',
  publishLabel = 'ĐĂNG NGAY',
  scheduleLabel = 'CẬP NHẬT LỊCH',
  cancelLabel = 'HỦY',
  addToPlaylistLabel = 'THÊM VÀO PLAYLIST',
}: FloatingBatchActionBarProps) {
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    };

    if (isCategoryDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCategoryDropdownOpen]);

  if (selectedCount === 0) return null;

  return (
    <div className="animate-in slide-in-from-bottom-10 fade-in fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 transform items-center gap-3 border border-white/20 bg-zinc-900 p-2 pl-6 shadow-2xl backdrop-blur-md">
      {/* Selected Count */}
      <span className="font-mono text-xs text-white uppercase">{selectedCount} ĐÃ CHỌN</span>

      <div className="h-4 w-[1px] bg-white/20" />

      {/* Approve Button */}
      {(approvingStatus === ContentStatus.PENDING_REVIEW ||
        approvingStatus === ContentStatus.REJECTED) && (
        <PermissionGate permission={Permission.REELS_APPROVE}>
          <Button
            variant="default"
            onClick={onApprove}
            disabled={selectedCount === 0 || isApproving}
          >
            {isApproving ? `ĐANG ${approveLabel}...` : `${approveLabel} (${selectedCount || 0})`}
          </Button>
        </PermissionGate>
      )}

      {/* Reject Button */}
      {approvingStatus === ContentStatus.PENDING_REVIEW && (
        <PermissionGate permission={Permission.REELS_REJECT}>
          <Button
            variant="destructive"
            onClick={onReject}
            disabled={selectedCount === 0 || isRejecting}
          >
            {isRejecting ? `ĐANG ${rejectLabel}...` : `${rejectLabel} (${selectedCount || 0})`}
          </Button>
        </PermissionGate>
      )}

      {/* Publish Button */}
      {(approvingStatus === ContentStatus.APPROVED ||
        approvingStatus === ContentStatus.SCHEDULED) &&
        onPublish && (
          <PermissionGate permission={Permission.REELS_PUBLISH}>
            <Button
              variant="default"
              onClick={onPublish}
              disabled={selectedCount === 0 || isPublishing}
              className="border-green-500 bg-green-600 text-white hover:bg-green-700"
            >
              {isPublishing ? `ĐANG ${publishLabel}...` : `${publishLabel} (${selectedCount || 0})`}
            </Button>
          </PermissionGate>
        )}

      {/* Schedule Button */}
      {(approvingStatus === ContentStatus.APPROVED ||
        approvingStatus === ContentStatus.SCHEDULED) &&
        onSchedule && (
          <PermissionGate permission={Permission.REELS_SCHEDULE}>
            <Button
              variant="default"
              onClick={onSchedule}
              disabled={selectedCount === 0 || isScheduling}
              className="border-blue-500 bg-blue-600 text-white hover:bg-blue-700"
            >
              {isScheduling
                ? `ĐANG ${scheduleLabel}...`
                : `${scheduleLabel} (${selectedCount || 0})`}
            </Button>
          </PermissionGate>
        )}

      {/* Add to Playlist Button */}
      {onAddToPlaylist && (
        // <PermissionGate permission={Permission.REELS_ADD_TO_PLAYLIST}>
        <Button
          variant="default"
          onClick={onAddToPlaylist}
          className="border-white bg-white text-black hover:bg-zinc-200"
        >
          {addToPlaylistLabel}
        </Button>
        // </PermissionGate>
      )}

      <div className="h-4 w-[1px] bg-white/20" />
      <Button
        disabled={isApproving || isRejecting || isPublishing || isScheduling}
        variant="ghost"
        className="text-zinc-400 hover:text-white"
        onClick={() => {
          onCancel();
        }}
      >
        {cancelLabel}
      </Button>
    </div>
  );
}
