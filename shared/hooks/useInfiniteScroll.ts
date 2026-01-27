import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage: () => void;
  threshold?: number; // Distance from bottom to trigger (in pixels)
}

/**
 * Hook để implement infinite scroll
 *
 * Tự động load thêm data khi user scroll gần đến cuối
 *
 * @example
 * ```tsx
 * const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(...);
 * const scrollRef = useInfiniteScroll({
 *   hasNextPage,
 *   isFetchingNextPage,
 *   fetchNextPage,
 *   threshold: 300
 * });
 *
 * return <div ref={scrollRef}>...</div>
 * ```
 */
export function useInfiniteScroll({
  hasNextPage = false,
  isFetchingNextPage = false,
  fetchNextPage,
  threshold = 500,
}: UseInfiniteScrollOptions) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | HTMLTableRowElement | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: `${threshold}px`,
      threshold: 0,
    });

    observerRef.current.observe(element);

    // eslint-disable-next-line consistent-return
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver, threshold]);

  return loadMoreRef;
}
