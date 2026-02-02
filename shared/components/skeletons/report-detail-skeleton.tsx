import { Skeleton } from './skeleton';

/**
 * Report Detail Page Skeleton
 * Matches the layout of ReportDetailPage
 */
export function ReportDetailSkeleton() {
  return (
    <div className="animate-in fade-in grid w-full grid-cols-1 gap-6 p-4 duration-300 sm:p-10 md:grid-cols-2">
      {/* Header */}
      <div className="col-span-2 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 border border-white/20" variant="square" />
          <div className="flex-1">
            <Skeleton className="h-8 w-64" />
          </div>
        </div>
      </div>

      {/* LEFT: Video Preview */}
      <aside className="queue-sidebar">
        <div className="flex h-full flex-col">
          <div className="mb-4 flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>

          {/* Video Player Placeholder */}
          <Skeleton className="mb-4 aspect-[9/16] w-full border border-white/10" variant="square" />
        </div>
      </aside>

      {/* CENTER: Report Details */}
      <section className="relative overflow-y-auto p-8">
        <div className="space-y-6">
          {/* Status Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-28" />
          </div>

          {/* Video Information */}
          <div className="space-y-3 border-t border-white/10 pt-6">
            <Skeleton className="h-3 w-32" />
            <div className="space-y-3 border border-white/10 bg-black/50 p-4">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <div className="space-y-2 pt-2">
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          </div>

          {/* Reports List Section */}
          <div className="space-y-4 border-t border-white/10 pt-6">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-48" />
            </div>

            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-white/10 bg-black/50 p-4">
                  <div className="flex items-start gap-3">
                    <Skeleton variant="circular" className="h-8 w-8 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="sticky bottom-0 mt-8 flex flex-col gap-3 border-t border-white/10 bg-black/95 pt-6 backdrop-blur">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </section>
    </div>
  );
}
