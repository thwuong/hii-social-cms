import { QueueItemSkeleton } from './queue-item-skeleton';
import { Skeleton } from './skeleton';

interface QueueSkeletonProps {
  count?: number;
}

/**
 * Queue Skeleton
 * Shows multiple QueueItemSkeleton in vertical layout
 */
export function QueueSkeleton({ count = 5 }: QueueSkeletonProps) {
  return (
    <div className="flex w-full flex-col divide-y divide-white/10 border border-white/10 bg-black/50">
      <div className="flex items-center justify-between p-3">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/5" />
      </div>
      {Array.from({ length: count }).map((_, index) => (
        <QueueItemSkeleton key={`queue-item-skeleton-${index + 1}`} />
      ))}
    </div>
  );
}
