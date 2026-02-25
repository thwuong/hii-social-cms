/**
 * Playlist Card Skeleton
 *
 * Loading skeleton for playlist cards in grid view
 * Matches PlaylistCard component structure
 */
export function PlaylistCardSkeleton() {
  return (
    <div className="group relative flex flex-col border border-white/10 bg-zinc-900 transition-all">
      {/* Thumbnail Skeleton */}
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        <div className="h-full w-full animate-pulse bg-zinc-800" />
      </div>

      {/* Content Skeleton */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Title */}
        <div className="h-4 w-3/4 animate-pulse bg-zinc-800" />

        {/* Meta Info */}
        <div className="flex items-center gap-4">
          {/* Video count */}
          <div className="h-3 w-16 animate-pulse bg-zinc-800" />
          {/* Date */}
          <div className="h-3 w-20 animate-pulse bg-zinc-800" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-3 w-full animate-pulse bg-zinc-800" />
          <div className="h-3 w-4/5 animate-pulse bg-zinc-800" />
        </div>
      </div>

      {/* Action Button Skeleton */}
      <div className="border-t border-white/10 p-3">
        <div className="h-8 w-full animate-pulse bg-zinc-800" />
      </div>
    </div>
  );
}

/**
 * Playlist Grid Skeleton
 *
 * Grid of playlist card skeletons
 */
export function PlaylistGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <PlaylistCardSkeleton key={`playlist-card-skeleton-${index + 1}`} />
      ))}
    </div>
  );
}

export default PlaylistCardSkeleton;
