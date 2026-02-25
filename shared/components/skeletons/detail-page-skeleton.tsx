import { QueueSkeleton } from './queue-skeleton';
import { Skeleton } from './skeleton';

/**
 * Detail Page Skeleton
 * Full layout skeleton for content detail page
 * Includes: Queue sidebar + Video viewport + Inspector panel
 */
export function DetailPageSkeleton() {
  return (
    <div className="detail-layout animate-in fade-in p-4 duration-300 sm:p-10">
      {/* LEFT: QUEUE SIDEBAR */}
      <aside className="queue-sidebar">
        <QueueSkeleton count={12} />
      </aside>

      {/* CENTER: VIEWPORT SECTION */}
      <section className="viewport-container">
        <div className="shutter-frame">
          {/* Video Skeleton */}
          <Skeleton className="h-full w-full" />

          {/* UI Overlay Skeleton */}
          <div className="ui-overlay">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="text-right">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="mt-1 h-4 w-24" />
            </div>
          </div>
        </div>

        {/* Close Button Skeleton */}
        <div className="absolute top-4 right-4 z-40">
          <Skeleton className="h-8 w-8" />
        </div>
      </section>

      {/* RIGHT: INSPECTOR SECTION */}
      <aside className="inspector">
        {/* Description Section */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-32" />
          <div className="space-y-2 border border-transparent p-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>

        {/* Distribution Networks Section */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-40" />
          <div className="flex flex-wrap gap-1.5">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>

        {/* Tags Section */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-28" />
          <div className="flex flex-wrap gap-1.5">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-18" />
            <Skeleton className="h-5 w-22" />
          </div>
        </div>

        {/* Workflow Steps Section */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-36" />
          <div className="space-y-3">
            {/* Step 1 */}
            <div className="flex items-center gap-3">
              <Skeleton variant="circular" className="h-8 w-8" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-2 w-32" />
              </div>
            </div>
            {/* Step 2 */}
            <div className="flex items-center gap-3">
              <Skeleton variant="circular" className="h-8 w-8" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-2 w-28" />
              </div>
            </div>
            {/* Step 3 */}
            <div className="flex items-center gap-3">
              <Skeleton variant="circular" className="h-8 w-8" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-2 w-36" />
              </div>
            </div>
            {/* Step 4 */}
            <div className="flex items-center gap-3">
              <Skeleton variant="circular" className="h-8 w-8" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-2 w-24" />
              </div>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="actions">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </aside>
    </div>
  );
}
