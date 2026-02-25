/**
 * Playlist Detail Skeleton
 *
 * Loading skeleton for playlist detail page
 * Shows form fields, video list, and player area
 */
export function PlaylistDetailSkeleton() {
  return (
    <div className="detail-layout animate-in fade-in grid-cols-[350px_1fr_350px]! overflow-hidden p-4 duration-300 max-lg:grid-cols-1 sm:p-10">
      {/* LEFT: FORM SECTION */}
      <div className="flex h-full flex-col overflow-hidden border-r border-white/10">
        <div className="scrollbar-hide flex-1 overflow-y-auto p-4">
          <div className="flex flex-col gap-4">
            {/* Title */}
            <div className="h-6 w-48 animate-pulse bg-zinc-800" />

            {/* Thumbnail Field */}
            <div className="space-y-2">
              <div className="h-3 w-20 animate-pulse bg-zinc-800" />
              <div className="aspect-video w-full animate-pulse border border-white/5 bg-zinc-900" />
            </div>

            {/* Name Field */}
            <div className="space-y-2">
              <div className="h-3 w-16 animate-pulse bg-zinc-800" />
              <div className="h-10 w-full animate-pulse border border-white/5 bg-zinc-900" />
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <div className="h-3 w-12 animate-pulse bg-zinc-800" />
              <div className="h-24 w-full animate-pulse border border-white/5 bg-zinc-900" />
            </div>

            {/* Video List Section */}
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-5 w-32 animate-pulse bg-zinc-800" />
                <div className="h-8 w-24 animate-pulse bg-zinc-800" />
              </div>
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={`list-skeleton-${i + 1}`}
                    className="flex h-16 items-center gap-3 border border-white/5 bg-zinc-900/50 p-2"
                  >
                    <div className="h-4 w-4 animate-pulse bg-zinc-800" />
                    <div className="aspect-video h-full animate-pulse bg-zinc-800" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-3/4 animate-pulse bg-zinc-800" />
                      <div className="h-2 w-1/4 animate-pulse bg-zinc-800" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions Footer */}
        <div className="mt-auto flex items-center gap-3 border-t border-white/10 bg-black/80 p-4 backdrop-blur-sm">
          <div className="h-10 flex-1 animate-pulse bg-zinc-800" />
          <div className="h-10 flex-1 animate-pulse bg-zinc-800" />
        </div>
      </div>

      {/* CENTER: VIEWPORT SECTION */}
      <section className="viewport-container">
        <div className="shutter-frame border-white/10">
          <div className="flex h-full flex-col">
            {/* Media Area */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full w-full animate-pulse bg-zinc-900" />
            </div>
            {/* Carousel Indicators */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
              <div className="h-1 w-8 animate-pulse bg-zinc-800" />
              <div className="h-1 w-8 animate-pulse bg-zinc-800" />
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT: INSPECTOR SECTION */}
      <div className="flex flex-col gap-6 px-4 py-4">
        {/* Description Readout */}
        <div className="space-y-3">
          <div className="h-3 w-32 animate-pulse bg-zinc-800" />
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse bg-zinc-800" />
            <div className="h-4 w-5/6 animate-pulse bg-zinc-800" />
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-3">
          <div className="h-3 w-24 animate-pulse bg-zinc-800" />
          <div className="flex flex-wrap gap-1.5">
            {[...Array(4)].map((_, i) => (
              <div
                key={`tag-skeleton-${i + 1}`}
                className="h-6 w-16 animate-pulse rounded-sm bg-zinc-800"
              />
            ))}
          </div>
        </div>

        {/* Platforms */}
        <div className="space-y-3">
          <div className="h-3 w-32 animate-pulse bg-zinc-800" />
          <div className="flex flex-wrap gap-1.5">
            {[...Array(3)].map((_, i) => (
              <div
                key={`platform-skeleton-${i + 1}`}
                className="h-6 w-20 animate-pulse rounded-sm bg-zinc-800"
              />
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <div className="h-3 w-24 animate-pulse bg-zinc-800" />
          <div className="flex flex-wrap gap-1.5">
            {[...Array(2)].map((_, i) => (
              <div
                key={`category-skeleton-${i + 1}`}
                className="h-6 w-24 animate-pulse rounded-sm bg-zinc-800"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaylistDetailSkeleton;
