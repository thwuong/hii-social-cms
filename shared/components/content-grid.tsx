import React from 'react';

interface ContentGridProps {
  children: React.ReactNode;
  isEmpty: boolean;
  loadMoreRef?: React.Ref<HTMLDivElement>;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
}

const ContentGrid: React.FC<ContentGridProps> = ({
  children,
  isEmpty,
  loadMoreRef,
  hasNextPage,
  isFetchingNextPage,
}) => {
  return (
    <>
      <div className="grid flex-1 auto-rows-max grid-cols-1 gap-[2px] overflow-y-auto border border-white/10 bg-white/10 p-[1px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {children}
        {isEmpty && <EmptyState />}
      </div>

      {/* Infinite Scroll Trigger */}
      {loadMoreRef && (
        <div ref={loadMoreRef} className="flex justify-center py-8">
          {isFetchingNextPage && <LoadingState />}
          {!isFetchingNextPage && hasNextPage && (
            <div className="font-mono text-xs text-zinc-600 uppercase">SCROLL_TO_LOAD_MORE</div>
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
  return (
    <div className="flex items-center gap-2 font-mono text-xs text-white uppercase">
      <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
      <span>ĐANG_TẢI...</span>
    </div>
  );
}

export default ContentGrid;
