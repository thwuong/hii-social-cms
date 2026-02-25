# Queue Component - Infinite Scroll Refactoring

Refactor Queue component để thêm tính năng infinite scroll, loại bỏ manual scroll handling.

## 🔄 Changes

### **Before**

- Manual scroll event handler (`onScroll` prop)
- Debounce logic trong parent component
- Phức tạp và khó maintain

### **After**

- Sử dụng `useInfiniteScroll` hook
- Automatic intersection observer
- Clean và reusable

## ✅ Đã refactor

### 1. Queue Component

**Props Changes:**

```typescript
// BEFORE
type QueueProps = {
  queueItems: ContentItem[];
  item: ContentItem;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void; // ❌ Manual
};

// AFTER
type QueueProps = {
  queueItems: ContentItem[];
  item: ContentItem;
  loadMoreRef?: React.RefObject<HTMLDivElement>; // ✅ Intersection Observer
  hasNextPage?: boolean; // ✅ React Query state
  isFetchingNextPage?: boolean; // ✅ React Query state
};
```

**New Features:**

- ✅ Loading indicator khi fetch
- ✅ "SCROLL_FOR_MORE" text
- ✅ Automatic trigger khi scroll gần cuối
- ✅ Keyboard accessible (role, tabIndex, onKeyDown)

### 2. Detail Page Refactoring

**Removed:**

```typescript
// ❌ Manual debounce logic
const debounceFetchNextPage = useMemo(() => debounce(() => fetchNextPage(), 300), [fetchNextPage]);

// ❌ Manual scroll handler
const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
  const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
  const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50;
  if (isAtBottom && hasNextPage) {
    debounceFetchNextPage();
  }
};
```

**Added:**

```typescript
// ✅ Simple hook usage
const loadMoreRef = useInfiniteScroll({
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  threshold: 200,
});
```

**Removed imports:**

- ❌ `debounce` from lodash
- ❌ `useMemo`

**Added imports:**

- ✅ `useInfiniteScroll` from shared hooks

## 🎨 UI Updates

### Loading State

```tsx
function LoadingState() {
  return (
    <div className="flex items-center gap-2 font-mono text-[10px] text-white uppercase">
      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
      <span>LOADING...</span>
    </div>
  );
}
```

### Has More Indicator

```tsx
{
  !isFetchingNextPage && hasNextPage && (
    <div className="font-mono text-[10px] text-zinc-600 uppercase">SCROLL_FOR_MORE</div>
  );
}
```

## 🚀 Usage

### Queue Component

```tsx
<Queue
  queueItems={crawlContent}
  item={contentDetails}
  loadMoreRef={loadMoreRef} // NEW
  hasNextPage={hasNextPage} // NEW
  isFetchingNextPage={isFetchingNextPage} // NEW
/>
```

### Detail Page

```tsx
function DetailPageComponent() {
  // Get infinite query data
  const { data: crawlContent, fetchNextPage, hasNextPage, isFetchingNextPage } = useCrawlContent();

  // Setup infinite scroll (replaces manual scroll handler)
  const loadMoreRef = useInfiniteScroll({
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    threshold: 200, // Trigger 200px before end
  });

  return (
    <Queue
      queueItems={crawlContent}
      item={contentDetails}
      loadMoreRef={loadMoreRef}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
    />
  );
}
```

## 💡 Benefits

### 1. **Simpler Code**

- ❌ No manual scroll calculations
- ❌ No debounce logic
- ❌ No scroll event handlers
- ✅ Just pass refs and flags

### 2. **Better Performance**

- Uses Intersection Observer API (more efficient)
- Automatic cleanup
- No scroll event listeners

### 3. **Reusable**

- Same pattern across all infinite scroll components
- Consistent behavior
- Easy to maintain

### 4. **Accessibility**

- Added `role="button"` for queue items
- Added `tabIndex={0}` for keyboard navigation
- Added `onKeyDown` for Enter/Space key support

## 🔧 Technical Details

### Intersection Observer

```typescript
new IntersectionObserver(callback, {
  root: null, // Use viewport
  rootMargin: '200px', // Trigger 200px before end
  threshold: 0, // Trigger as soon as visible
});
```

### Automatic Cleanup

Hook tự động cleanup observer khi component unmount:

```typescript
useEffect(() => {
  // ... setup observer

  return () => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
  };
}, [handleObserver, threshold]);
```

## 📊 Comparison

### Lines of Code

**Before:**

```typescript
// Parent component
const debounceFetchNextPage = useMemo(
  () => debounce(() => fetchNextPage(), 300),
  [fetchNextPage]
);

const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
  const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
  const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50;
  if (isAtBottom && hasNextPage) {
    debounceFetchNextPage();
  }
};

// Component
<Queue onScroll={handleScroll} />

// Inside Queue
<div onScroll={onScroll}>...</div>
```

**~15 lines** of boilerplate

**After:**

```typescript
// Parent component
const loadMoreRef = useInfiniteScroll({
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  threshold: 200,
});

// Component
<Queue
  loadMoreRef={loadMoreRef}
  hasNextPage={hasNextPage}
  isFetchingNextPage={isFetchingNextPage}
/>
```

**~5 lines** of clean code

### Dependencies

**Before:**

- `lodash` (for debounce)
- `useMemo` (for memoization)
- Manual scroll event handling

**After:**

- `useInfiniteScroll` hook (shared)
- Native Intersection Observer API

## ✨ Future Improvements

- ⏳ Add scroll position restoration
- ⏳ Add pull-to-refresh for mobile
- ⏳ Add virtualization for very long lists
- ⏳ Add smooth scroll to selected item

## 📚 Related

- [Infinite Scroll Documentation](./INFINITE_SCROLL.md)
- [useInfiniteScroll Hook](../shared/hooks/useInfiniteScroll.ts)
- [Queue Component](../features/content/components/queue.tsx)
