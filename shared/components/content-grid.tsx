import { cn } from '@/lib';
import React from 'react';
import { ContentGridSkeleton } from './skeletons';

interface ContentGridProps {
  children: React.ReactNode;
  isEmpty: boolean;
  loadMoreRef?: React.Ref<HTMLDivElement>;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  isPlaceholderData?: boolean;
}

const ContentGrid: React.FC<ContentGridProps> = ({
  children,
  isEmpty,
  loadMoreRef,
  hasNextPage,
  isFetchingNextPage,
  isPlaceholderData,
}) => {
  return (
    <>
      <div
        className={cn(
          'relative grid flex-1 auto-rows-max grid-cols-1 gap-[2px] overflow-y-auto border border-white/10 bg-black/10 p-[1px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
          isPlaceholderData && 'pointer-events-none opacity-50'
        )}
      >
        {children}
        {isEmpty && <EmptyState />}
      </div>

      {/* Infinite Scroll Trigger */}
      {hasNextPage && (
        <div ref={loadMoreRef} className="flex w-full justify-center py-8">
          {isFetchingNextPage && <LoadingState />}
          {!isFetchingNextPage && hasNextPage && (
            <div className="font-mono text-xs text-zinc-600 uppercase">Cuộn để tải thêm</div>
          )}
        </div>
      )}
    </>
  );
};

function EmptyState() {
  return (
    <div className="col-span-full bg-black py-20 text-center">
      <p className="font-mono text-sm text-zinc-500 uppercase">KHÔNG TÌM THẤY TÍN HIỆU</p>
    </div>
  );
}

function LoadingState() {
  return <ContentGridSkeleton count={8} />;
}

export default ContentGrid;
