import { Button } from '@/shared/ui';
import { useEffect, useRef, useState } from 'react';

export interface FloatingBatchActionBarProps {
  // Selection state
  selectedCount: number;
  approveCount?: number;
  rejectCount?: number;

  // Loading states
  isApproving?: boolean;
  isRejecting?: boolean;

  // Actions
  onApprove: () => void;
  onReject: () => void;
  onCancel: () => void;

  // Customization
  approveLabel?: string;
  rejectLabel?: string;
  cancelLabel?: string;
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
  approveCount,
  rejectCount,
  isApproving = false,
  isRejecting = false,
  onApprove,
  onReject,
  onCancel,
  approveLabel = 'DUYỆT',
  rejectLabel = 'TỪ CHỐI',
  cancelLabel = 'HỦY',
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
      {approveCount !== undefined && (
        <Button variant="default" onClick={onApprove} disabled={approveCount === 0 || isApproving}>
          {isApproving ? `ĐANG ${approveLabel}...` : `${approveLabel} (${approveCount || 0})`}
        </Button>
      )}

      {/* Reject Button */}
      {rejectCount !== undefined && (
        <Button
          variant="destructive"
          onClick={onReject}
          disabled={rejectCount === 0 || isRejecting}
        >
          {isRejecting ? `ĐANG ${rejectLabel}...` : `${rejectLabel} (${rejectCount || 0})`}
        </Button>
      )}

      {/* Cancel Button */}
      <div className="h-4 w-[1px] bg-white/20" />
      <Button
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
