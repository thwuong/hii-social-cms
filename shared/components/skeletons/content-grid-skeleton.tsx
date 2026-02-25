import { MediaCardSkeleton } from './media-card-skeleton';

interface ContentGridSkeletonProps {
  count?: number;
}

/**
 * Content Grid Skeleton
 * Shows multiple MediaCardSkeleton in grid layout
 */
export function ContentGridSkeleton({ count = 8 }: ContentGridSkeletonProps) {
  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <MediaCardSkeleton key={`media-card-skeleton-${index + 1}`} />
      ))}
    </div>
  );
}
