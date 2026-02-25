import { Skeleton } from './skeleton';

// Predefined heights for chart bars (avoid Math.random in render)
const CHART_BAR_HEIGHTS = [65, 85, 70, 90, 55, 75, 95, 60, 80, 50, 70, 85];

/**
 * Dashboard Page Skeleton Component
 *
 * Loading skeleton cho Dashboard page với layout phức tạp:
 * - Header section (title + stats)
 * - Chart card (2 columns)
 * - Alert card (1 column)
 * - KPI cards (5 cards)
 * - Create action card (1 card)
 *
 * Style: Carbon Kinetic / Hii Social Theme
 */
export function DashboardSkeleton() {
  return (
    <div className="animate-in fade-in p-4 duration-700 sm:p-10">
      {/* Header Section Skeleton */}
      <div className="mb-20 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-48" />

          <div className="flex flex-col gap-2">
            <Skeleton className="h-14 w-64" />
            <Skeleton className="h-14 w-56" />
          </div>
        </div>

        <div className="flex gap-12 border-b border-transparent pb-2 lg:border-none">
          {/* Stat Items */}
          {['reach', 'speed', 'token'].map((key) => (
            <div key={key} className="flex flex-col gap-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 gap-[2px] border border-white/10 bg-white/10 p-[1px] md:grid-cols-2 lg:grid-cols-3">
        {/* Chart Card Skeleton (Span 2) */}
        <div className="group relative min-h-[300px] overflow-hidden bg-black p-8 md:col-span-2">
          <div className="absolute top-0 left-0 h-[1px] w-full bg-white/10" />

          <div className="mb-6 flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>

          {/* Chart Skeleton */}
          <div className="h-[200px] w-full">
            <div className="flex h-full items-end justify-between gap-2">
              {/* Animated bars simulating chart */}
              {CHART_BAR_HEIGHTS.map((height) => (
                <div
                  key={`chart-bar-${height}-${Math.floor(height * 100)}`}
                  className="flex-1 animate-pulse rounded-t bg-white/10"
                  style={{
                    height: `${height}%`,
                    animationDelay: `${CHART_BAR_HEIGHTS.indexOf(height) * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Alert Card Skeleton */}
        <div className="group relative overflow-hidden bg-black p-8">
          <div className="absolute top-0 left-0 h-[1px] w-full bg-white/10" />

          <div className="mb-12 flex items-start justify-between">
            <Skeleton className="h-3 w-20" />
            <div className="h-2 w-2 animate-pulse rounded-full bg-red-500/50" />
          </div>

          <Skeleton className="mb-4 h-16 w-24" />
          <div className="mb-8 flex flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>

          <Skeleton className="h-10 w-full" />
        </div>

        {/* KPI Cards Skeleton (5 cards) */}
        {['draft', 'approved', 'published', 'rejected', 'scheduled'].map((key) => (
          <div key={key} className="group relative overflow-hidden bg-black p-8">
            <div className="absolute top-0 left-0 h-[1px] w-full bg-white/10" />

            <div className="flex flex-col justify-between gap-8">
              <Skeleton className="h-3 w-20" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-12 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        ))}

        {/* Create Action Card Skeleton */}
        <div className="group relative flex flex-col justify-between overflow-hidden bg-white p-8">
          <div className="flex items-start justify-between">
            <Skeleton className="h-3 w-16 bg-black/10" />
            <Skeleton className="h-4 w-4 rounded bg-black/10" />
          </div>
          <div className="flex flex-col gap-1">
            <Skeleton className="h-8 w-24 bg-black/10" />
            <Skeleton className="h-3 w-20 bg-black/10" />
          </div>
        </div>
      </div>

      {/* Pulsing Indicator */}
      <div className="mt-8 flex items-center justify-center">
        <div className="flex items-center gap-2 font-mono text-xs text-zinc-500">
          <div className="h-2 w-2 animate-pulse rounded-full bg-white/50" />
          <span>ĐANG TẢI DỮ LIỆU...</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact Dashboard Skeleton (for faster loading state)
 */
export function DashboardSkeletonCompact() {
  return (
    <div className="animate-in fade-in duration-300">
      {/* Header */}
      <div className="mb-8">
        <Skeleton className="mb-2 h-3 w-48" />
        <Skeleton className="h-12 w-64" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Chart */}
        <div className="md:col-span-2">
          <Skeleton className="h-[300px] w-full" />
        </div>

        {/* Cards */}
        {['alert', 'draft', 'approved', 'published', 'rejected', 'scheduled', 'create'].map(
          (key) => (
            <Skeleton key={key} className="h-[200px] w-full" />
          )
        )}
      </div>
    </div>
  );
}
