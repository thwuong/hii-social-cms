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
