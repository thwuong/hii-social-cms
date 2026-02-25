/**
 * Playlist Form Skeleton
 *
 * Loading skeleton for playlist form
 * Used in modals and inline forms
 */
export function PlaylistFormSkeleton() {
  return (
    <div className="space-y-6">
      {/* Name Field Skeleton */}
      <div className="space-y-2">
        <div className="h-3 w-24 animate-pulse bg-zinc-800" />
        <div className="h-10 w-full animate-pulse bg-zinc-800" />
      </div>

      {/* Description Field Skeleton */}
      <div className="space-y-2">
        <div className="h-3 w-16 animate-pulse bg-zinc-800" />
        <div className="h-24 w-full animate-pulse bg-zinc-800" />
      </div>

      {/* Thumbnail Field Skeleton */}
      <div className="space-y-2">
        <div className="h-3 w-20 animate-pulse bg-zinc-800" />
        <div className="h-40 w-full animate-pulse bg-zinc-800" />
      </div>

      {/* Video Count Skeleton (Optional) */}
      <div className="flex items-center gap-2 border-t border-white/10 pt-4">
        <div className="h-3 w-32 animate-pulse bg-zinc-800" />
      </div>
    </div>
  );
}

export default PlaylistFormSkeleton;
