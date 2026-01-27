import { Skeleton } from './skeleton';

interface FilterSkeletonProps {
  count?: number;
  label?: string;
}

function FilterSkeleton({ count = 5, label = 'Đang tải...' }: FilterSkeletonProps) {
  return (
    <div className="space-y-3">
      {/* Label Skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton variant="rectangular" className="h-3 w-3" />
        <Skeleton variant="text" className="h-3 w-24" />
      </div>

      {/* Filter Buttons Skeleton */}
      <div className="flex flex-wrap gap-1">
        {Array.from({ length: count }).map((_, index) => (
          <Skeleton
            key={`filter-skeleton-${index + 1}`}
            variant="square"
            className="h-7 w-20 border border-white/10"
          />
        ))}
      </div>
    </div>
  );
}

export default FilterSkeleton;
