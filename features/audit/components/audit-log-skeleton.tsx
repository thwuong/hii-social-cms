/**
 * AuditLogSkeleton Component
 *
 * Loading skeleton for audit logs
 */

interface AuditLogSkeletonProps {
  count?: number;
  variant?: 'table' | 'grid';
}

export function AuditLogSkeleton({ count = 8, variant = 'table' }: AuditLogSkeletonProps) {
  if (variant === 'grid') {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={`audit-skeleton-${i + 1}`}
            className="h-48 animate-pulse border border-white/10 bg-zinc-900"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2 border border-white/10">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={`audit-skeleton-row-${i + 1}`}
          className="flex h-16 animate-pulse items-center justify-between gap-4 border-b border-white/10 bg-zinc-900 px-4"
        >
          <div className="h-4 w-32 rounded bg-zinc-800" />
          <div className="h-4 w-48 rounded bg-zinc-800" />
          <div className="h-4 w-24 rounded bg-zinc-800" />
          <div className="h-4 w-20 rounded bg-zinc-800" />
          <div className="h-4 w-32 rounded bg-zinc-800" />
        </div>
      ))}
    </div>
  );
}

export function AuditLogDetailSkeleton() {
  return (
    <div className="flex h-full flex-col space-y-6 p-4 sm:p-10">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 animate-pulse border border-white/10 bg-zinc-900" />
          <div className="space-y-2">
            <div className="h-8 w-48 animate-pulse bg-zinc-900" />
            <div className="h-4 w-64 animate-pulse bg-zinc-900" />
          </div>
        </div>
        <div className="h-6 w-6 animate-pulse rounded-full bg-zinc-900" />
      </div>

      {/* Main Info Card Skeleton */}
      <div className="animate-pulse border border-white/10 bg-zinc-900">
        <div className="space-y-6 p-6">
          {/* Action */}
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 rounded bg-zinc-800" />
            <div className="space-y-2">
              <div className="h-3 w-20 rounded bg-zinc-800" />
              <div className="h-5 w-40 rounded bg-zinc-800" />
            </div>
          </div>

          {/* Resource */}
          <div className="border-t border-white/10 pt-6">
            <div className="mb-2 h-3 w-20 rounded bg-zinc-800" />
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="h-5 w-full rounded bg-zinc-800" />
                <div className="h-4 w-1/2 rounded bg-zinc-800" />
              </div>
            </div>
          </div>

          {/* Actor */}
          <div className="border-t border-white/10 pt-6">
            <div className="mb-3 h-3 w-32 rounded bg-zinc-800" />
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-zinc-800" />
              <div className="space-y-2">
                <div className="h-5 w-40 rounded bg-zinc-800" />
                <div className="h-4 w-56 rounded bg-zinc-800" />
              </div>
            </div>
          </div>

          {/* Timestamp */}
          <div className="border-t border-white/10 pt-6">
            <div className="mb-2 h-3 w-20 rounded bg-zinc-800" />
            <div className="h-5 w-64 rounded bg-zinc-800" />
          </div>

          {/* IP & User Agent */}
          <div className="grid gap-6 border-t border-white/10 pt-6 md:grid-cols-2">
            <div className="space-y-2">
              <div className="h-3 w-20 rounded bg-zinc-800" />
              <div className="h-4 w-32 rounded bg-zinc-800" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-24 rounded bg-zinc-800" />
              <div className="h-4 w-full rounded bg-zinc-800" />
            </div>
          </div>
        </div>
      </div>

      {/* Changes Card Skeleton */}
      <div className="animate-pulse border border-white/10 bg-zinc-900">
        <div className="space-y-4 p-6">
          <div className="h-6 w-32 rounded bg-zinc-800" />
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <div className="h-4 w-16 rounded bg-zinc-800" />
              <div className="h-40 w-full rounded bg-black" />
            </div>
            <div className="space-y-3">
              <div className="h-4 w-16 rounded bg-zinc-800" />
              <div className="h-40 w-full rounded bg-black" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
