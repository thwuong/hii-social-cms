# Infinite Scroll Feature

Tính năng tự động load thêm data khi user scroll đến cuối danh sách.

## 📦 Đã tạo

### 1. Hook

- ✅ `shared/hooks/useInfiniteScroll.ts` - Hook để detect scroll và trigger load more
- ✅ `shared/hooks/index.ts` - Export hook

### 2. Components Updated

- ✅ `shared/components/content-grid.tsx` - Thêm infinite scroll support
- ✅ `features/content/components/content-table.tsx` - Thêm infinite scroll support

### 3. Pages Updated

- ✅ `features/content/pages/content-page.tsx` - Sử dụng infinite scroll
- ✅ `features/content/pages/content-crawl-page.tsx` - Sử dụng infinite scroll

## 🎨 Features

### useInfiniteScroll Hook

Hook sử dụng **Intersection Observer API** để detect khi user scroll gần đến cuối trang.

**Parameters:**

```typescript
interface UseInfiniteScrollOptions {
  hasNextPage?: boolean; // Có trang tiếp theo không?
  isFetchingNextPage?: boolean; // Đang fetch không?
  fetchNextPage: () => void; // Function để fetch trang tiếp
  threshold?: number; // Khoảng cách (px) để trigger (default: 500px)
}
```

**Returns:**

```typescript
React.RefObject<HTMLDivElement>; // Ref để attach vào trigger element
```

### ContentGrid Updates

**New Props:**

```typescript
interface ContentGridProps {
  children: React.ReactNode;
  isEmpty: boolean;
  loadMoreRef?: React.RefObject<HTMLDivElement>; // NEW
  hasNextPage?: boolean; // NEW
  isFetchingNextPage?: boolean; // NEW
}
```

**Features:**

- Loading indicator khi đang fetch
- "SCROLL_TO_LOAD_MORE" text khi có next page
- Tự động hide khi không còn data

### ContentTable Updates

**New Props:**

```typescript
interface ContentTableProps {
  // ... existing props
  loadMoreRef?: React.RefObject<HTMLDivElement>; // NEW
  hasNextPage?: boolean; // NEW
  isFetchingNextPage?: boolean; // NEW
}
```

## 🚀 Sử dụng

### Basic Usage

```tsx
import { useInfiniteScroll } from '@/shared/hooks';
import { useContent } from '@/features/content/hooks';

function MyPage() {
  // Get infinite query data
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useContent();

  // Setup infinite scroll
  const loadMoreRef = useInfiniteScroll({
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    threshold: 300, // Trigger 300px trước khi đến cuối
  });

  return (
    <ContentGrid
      isEmpty={data?.length === 0}
      loadMoreRef={loadMoreRef}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
    >
      {data?.map((item) => (
        <Media key={item.id} item={item} />
      ))}
    </ContentGrid>
  );
}
```

### With Table

```tsx
<ContentTable
  items={data || []}
  onView={handleNavigateToDetail}
  selectedIds={selectedIds}
  onToggleSelect={handleToggleSelect}
  onToggleAll={handleSelectAll}
  loadMoreRef={loadMoreRef}
  hasNextPage={hasNextPage}
  isFetchingNextPage={isFetchingNextPage}
/>
```

### Custom Threshold

```tsx
// Load khi còn 100px đến cuối
const loadMoreRef = useInfiniteScroll({
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  threshold: 100,
});

// Load sớm hơn (500px)
const loadMoreRef = useInfiniteScroll({
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  threshold: 500,
});
```

## 🔧 Technical Details

### Intersection Observer

Hook sử dụng **Intersection Observer API** để detect visibility:

```typescript
new IntersectionObserver(callback, {
  root: null, // Viewport
  rootMargin: '300px', // Trigger 300px trước
  threshold: 0, // Ngay khi visible
});
```

### React Query Integration

Hook hoạt động hoàn hảo với `useInfiniteQuery`:

```typescript
const {
  data,
  hasNextPage, // boolean
  fetchNextPage, // function
  isFetchingNextPage, // boolean
} = useInfiniteQuery({
  queryKey: ['content'],
  queryFn: ({ pageParam = 1 }) => fetchData(pageParam),
  getNextPageParam: (lastPage) => lastPage.nextPage,
  initialPageParam: 1,
});
```

### Loading States

**Grid Loading:**

```tsx
<div className="flex items-center gap-2">
  <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
  <span>ĐANG_TẢI...</span>
</div>
```

**Has More Indicator:**

```tsx
<div className="font-mono text-xs text-zinc-600 uppercase">SCROLL_TO_LOAD_MORE</div>
```

## 📊 Performance

### Optimizations

1. **Automatic Cleanup**: Observer tự động disconnect khi component unmount
2. **Single Observer**: Chỉ tạo 1 observer instance per component
3. **Threshold Control**: Có thể điều chỉnh khi nào trigger
4. **Dependency Tracking**: Chỉ re-create observer khi cần

### Best Practices

```typescript
// ✅ GOOD: Reasonable threshold
const loadMoreRef = useInfiniteScroll({
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  threshold: 300, // ~2-3 items trước khi hết
});

// ❌ BAD: Too small, triggers too late
const loadMoreRef = useInfiniteScroll({
  threshold: 10,
});

// ❌ BAD: Too large, triggers too early
const loadMoreRef = useInfiniteScroll({
  threshold: 2000,
});
```

## 🎯 Examples

### Example 1: Content Page

```tsx
function ContentPageComponent() {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useContent();

  const loadMoreRef = useInfiniteScroll({
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    threshold: 300,
  });

  return (
    <ContentGrid
      isEmpty={data?.length === 0}
      loadMoreRef={loadMoreRef}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
    >
      {data?.map((item) => (
        <Media key={item.id} item={item} onView={handleView} />
      ))}
    </ContentGrid>
  );
}
```

### Example 2: Crawl Page

```tsx
function ContentCrawlPageComponent() {
  const { data: crawlContent, hasNextPage, fetchNextPage, isFetchingNextPage } = useCrawlContent();

  const loadMoreRef = useInfiniteScroll({
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    threshold: 300,
  });

  return (
    <>
      {viewMode === 'table' ? (
        <ContentTable
          items={crawlContent}
          loadMoreRef={loadMoreRef}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          // ... other props
        />
      ) : (
        <ContentGrid
          isEmpty={crawlContent.length === 0}
          loadMoreRef={loadMoreRef}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        >
          {crawlContent.map((item) => (
            <Media key={item.id} item={item} />
          ))}
        </ContentGrid>
      )}
    </>
  );
}
```

### Example 3: Custom Trigger Element

```tsx
function CustomScrollComponent() {
  const { hasNextPage, fetchNextPage, isFetchingNextPage } = useMyData();

  const loadMoreRef = useInfiniteScroll({
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  });

  return (
    <div>
      {/* Your content */}
      <div className="grid">
        {items.map((item) => (
          <Card key={item.id} />
        ))}
      </div>

      {/* Custom trigger */}
      <div ref={loadMoreRef} className="flex h-20 items-center justify-center">
        {isFetchingNextPage ? (
          <Spinner />
        ) : hasNextPage ? (
          <p>Scroll for more</p>
        ) : (
          <p>End of list</p>
        )}
      </div>
    </div>
  );
}
```

## 🐛 Troubleshooting

### Issue: Infinite scroll không trigger

**Possible causes:**

- `hasNextPage` luôn `false`
- `loadMoreRef` không được attach vào element
- Element không visible (check CSS)

**Solution:**

```tsx
// Debug logging
const loadMoreRef = useInfiniteScroll({
  hasNextPage,
  fetchNextPage: () => {
    console.log('Fetching next page...');
    fetchNextPage();
  },
  isFetchingNextPage,
});

// Check if ref is attached
<div ref={loadMoreRef} style={{ background: 'red', height: '100px' }}>
  Debug Element
</div>;
```

### Issue: Load quá nhiều lần

**Cause:** Threshold quá lớn, trigger quá sớm

**Solution:**

```tsx
// Giảm threshold
const loadMoreRef = useInfiniteScroll({
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  threshold: 100, // Smaller threshold
});
```

### Issue: Loading indicator không hiện

**Cause:** Props không được pass đúng

**Solution:**

```tsx
// Make sure all props are passed
<ContentGrid
  loadMoreRef={loadMoreRef}        // ✅
  hasNextPage={hasNextPage}        // ✅
  isFetchingNextPage={isFetchingNextPage}  // ✅
>
```

## 📚 Reference

- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [React Query - Infinite Queries](https://tanstack.com/query/latest/docs/react/guides/infinite-queries)
- [Carbon Kinetic Design System](#)

## ✨ Next Steps

- ⏳ Add virtual scrolling for large lists (react-window)
- ⏳ Add pull-to-refresh for mobile
- ⏳ Add scroll-to-top button
- ⏳ Add smooth scroll animations
- ⏳ Add skeleton loading states
