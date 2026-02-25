/**
 * Draggable Video List Skeleton
 *
 * Loading skeleton for draggable video list in playlist detail
 */
export function DraggableVideoListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={`video-item-${index + 1}`}
          className="flex items-center gap-3 border border-white/10 bg-zinc-900 p-3"
        >
          {/* Drag Handle Skeleton */}
          <div className="h-5 w-5 flex-shrink-0 animate-pulse bg-zinc-800" />

          {/* Thumbnail Skeleton */}
          <div className="h-16 w-28 flex-shrink-0 animate-pulse bg-zinc-800" />

          {/* Video Info Skeleton */}
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 animate-pulse bg-zinc-800" />
            <div className="h-3 w-1/2 animate-pulse bg-zinc-800" />
          </div>

          {/* Actions Skeleton */}
          <div className="flex gap-2">
            {/* Play button */}
            <div className="h-8 w-8 animate-pulse bg-zinc-800" />
            {/* Remove button */}
            <div className="h-8 w-8 animate-pulse bg-zinc-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default DraggableVideoListSkeleton;
