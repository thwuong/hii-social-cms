import { Skeleton } from './skeleton';

/**
 * Queue Item Skeleton
 * Used in Queue component loading state
 */
export function QueueItemSkeleton() {
  return (
    <div className="flex w-full gap-3 border-l-2 border-transparent p-3 transition-all">
      {/* Thumbnail */}
      <Skeleton className="h-16 w-28 flex-shrink-0" />

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2">
        {/* Title */}
        <Skeleton className="h-4 w-full" />

        {/* Description */}
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}
