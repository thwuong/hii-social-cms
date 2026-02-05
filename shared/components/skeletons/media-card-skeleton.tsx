import { Skeleton } from './skeleton';

/**
 * Media Card Skeleton
 * Used in ContentGrid loading state
 */
export function MediaCardSkeleton() {
  return (
    <div className="group relative w-full overflow-hidden border border-white/10 bg-black/50 backdrop-blur-sm transition-all hover:border-white/20">
      {/* Thumbnail */}
      <Skeleton className="aspect-[16/9] w-full" />

      {/* Content */}
      <div className="space-y-2 p-3">
        {/* Title */}
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />

        {/* Metadata */}
        <div className="flex items-center gap-2 pt-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>

        {/* Tags */}
        <div className="flex gap-1 pt-2">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
    </div>
  );
}
