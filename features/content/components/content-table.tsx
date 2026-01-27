import { ContentItem } from '@/shared/types';
import React from 'react';
import { useInfiniteScroll } from '@/shared';
import ContentColumn from './content-column';
import TableRow from './content-row';

interface ContentTableProps {
  items: ContentItem[];
  onView: (id: ContentItem) => void;
  selectedIds: string[];
  onToggleSelect?: (id: string) => void;
  onToggleAll?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage: () => void;
}

const ContentTable: React.FC<ContentTableProps> = ({
  items,
  onView,
  selectedIds,
  onToggleSelect,
  onToggleAll,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}) => {
  // Infinite scroll
  const loadMoreRef = useInfiniteScroll({
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    threshold: 300,
  });
  // Only count pending items for select all
  const pendingItems = items.filter((item) => item.status);
  const allSelected = selectedIds.every((id) => pendingItems.some((item) => item.id === id));

  // Calculate colspan based on whether checkbox column is shown
  const colSpan = onToggleSelect ? 6 : 5;

  return (
    <div className="w-full border border-white/10 bg-black">
      <div className="w-full overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <ContentColumn allSelected={allSelected} onToggleAll={onToggleAll} />
          </thead>
          <tbody className="divide-y divide-white/5">
            {items.map((item) => (
              <TableRow
                item={item}
                key={item.content_id}
                selectedIds={selectedIds}
                onView={() => onView(item)}
                onToggleSelect={onToggleSelect}
              />
            ))}
            {items.length === 0 && <EmptyState colSpan={colSpan} />}

            {/* Infinite Scroll Trigger - Inside tbody */}
            {loadMoreRef && items.length > 0 && (
              <tr ref={loadMoreRef as React.RefObject<HTMLTableRowElement>}>
                <td colSpan={colSpan} className="border-t border-white/10 py-8 text-center">
                  {isFetchingNextPage && <LoadingState />}
                  {!isFetchingNextPage && hasNextPage && (
                    <div className="font-mono text-xs text-zinc-600 uppercase">
                      SCROLL_TO_LOAD_MORE
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function EmptyState({ colSpan = 6 }: { colSpan?: number }) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="p-8 text-center align-middle font-mono text-xs text-zinc-600 uppercase"
      >
        Không có dữ liệu hiển thị.
      </td>
    </tr>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center gap-2 font-mono text-xs text-white uppercase">
      <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
      <span>ĐANG_TẢI...</span>
    </div>
  );
}

export default ContentTable;
