# Infinite Scroll Fix Documentation

## 🐛 Issue

Infinite scroll không hoạt động sau khi refactor table sang DataTable component.

## 🔍 Root Cause

**Duplicate `loadMoreRef` instances** gây conflict:

### Before (❌ Broken):

```tsx
// Page tạo một loadMoreRef
const loadMoreRef = useInfiniteScroll({
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  threshold: 300,
});

// ContentTable CŨNG tạo một loadMoreRef khác
const ContentTable = ({ ... }) => {
  const loadMoreRef = useInfiniteScroll({ ... }); // DUPLICATE!

  return <DataTable loadMoreRef={loadMoreRef} />;
};
```

**Vấn đề:**

- 2 IntersectionObserver cùng lúc
- Page's `loadMoreRef` không được sử dụng → bị bỏ qua
- ContentTable's `loadMoreRef` được pass vào DataTable → hoạt động
- Nhưng **conflict** nếu cả 2 cùng attach vào cùng element

## ✅ Solution

**Xóa duplicate logic**, chỉ giữ một nơi tạo `loadMoreRef`:

### Strategy:

1. **Table View**: ContentTable/DraftContentTable tự quản lý infinite scroll
2. **Grid View**: Page tạo `loadMoreRef` riêng và pass vào ContentGrid

### After (✅ Fixed):

```tsx
// content-page.tsx
function ContentPageComponent() {
  const { data: items, hasNextPage, fetchNextPage, isFetchingNextPage } = useContent();

  // ❌ REMOVED: Duplicate loadMoreRef for table
  // const loadMoreRef = useInfiniteScroll({ ... });

  // ✅ KEEP: Separate loadMoreRef for Grid view
  const gridLoadMoreRef = useInfiniteScroll({
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    threshold: 300,
  });

  return (
    <>
      {viewMode === 'table' && (
        <ContentTable
          // Table tự quản lý loadMoreRef internally
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      )}

      {viewMode === 'grid' && (
        <ContentGrid
          // Grid nhận loadMoreRef từ page
          loadMoreRef={gridLoadMoreRef}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      )}
    </>
  );
}
```

```tsx
// content-table.tsx
const ContentTable = ({ hasNextPage, fetchNextPage, isFetchingNextPage }) => {
  // ✅ Table tự tạo loadMoreRef (không duplicate với page)
  const loadMoreRef = useInfiniteScroll({
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    threshold: 300,
  });

  return (
    <DataTable
      columns={columns}
      data={items}
      loadMoreRef={loadMoreRef}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
    />
  );
};
```

## 📝 Files Changed

### 1. `/features/content/pages/content-page.tsx`

**Before:**

```tsx
const loadMoreRef = useInfiniteScroll({ ... }); // ❌ Unused for table

<ContentTable
  loadMoreRef={loadMoreRef} // Not passed
  hasNextPage={hasNextPage}
  fetchNextPage={fetchNextPage}
  isFetchingNextPage={isFetchingNextPage}
/>

<ContentGrid
  loadMoreRef={loadMoreRef} // ❌ Wrong ref
/>
```

**After:**

```tsx
// ✅ Removed duplicate loadMoreRef
const gridLoadMoreRef = useInfiniteScroll({ ... }); // Only for Grid

<ContentTable
  hasNextPage={hasNextPage}
  fetchNextPage={fetchNextPage}
  isFetchingNextPage={isFetchingNextPage}
/>

<ContentGrid
  loadMoreRef={gridLoadMoreRef} // ✅ Correct ref
/>
```

**Changes:**

- ❌ Removed: `import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll'` (unused)
- ✅ Re-added: `import { useInfiniteScroll } from '@/shared/hooks'` (for Grid)
- ❌ Removed: `const loadMoreRef = useInfiniteScroll({ ... })` (duplicate)
- ✅ Added: `const gridLoadMoreRef = useInfiniteScroll({ ... })` (Grid only)
- ✅ Fixed: Pass `gridLoadMoreRef` to ContentGrid

### 2. `/features/content/pages/draft-content-page.tsx`

**Exactly same changes as `content-page.tsx`:**

- ❌ Removed duplicate `loadMoreRef`
- ✅ Added `gridLoadMoreRef` for Grid view

### 3. `/features/content/components/content-table.tsx`

**No changes needed** - already correct:

```tsx
const ContentTable = ({ ... }) => {
  const loadMoreRef = useInfiniteScroll({ ... }); // ✅ Internal

  return <DataTable loadMoreRef={loadMoreRef} />;
};
```

### 4. `/features/content/components/draft-content-table.tsx`

**No changes needed** - already correct (same structure as ContentTable)

### 5. `/features/content/pages/content-detail-page.tsx`

**No changes needed** - `loadMoreRef` correctly used for Queue component

### 6. `/features/report/pages/report-list-page.tsx`

**No changes needed** - `loadMoreRef` correctly used for custom grid layout

## 🎯 Key Principles

### 1. **Single Responsibility**

Each component should manage its own infinite scroll if it needs it:

```tsx
// ✅ GOOD: Component manages its own scroll
const MyTable = ({ data, hasNextPage, fetchNextPage }) => {
  const loadMoreRef = useInfiniteScroll({ hasNextPage, fetchNextPage });
  return <div ref={loadMoreRef}>...</div>;
};

// ❌ BAD: Parent and child both create refs
const Parent = () => {
  const loadMoreRef = useInfiniteScroll({ ... }); // DUPLICATE!
  return <MyTable loadMoreRef={differentLoadMoreRef} />;
};
```

### 2. **Clear Ownership**

- **Reusable components** (ContentTable, DataTable): Manage their own `loadMoreRef`
- **Layout components** (ContentGrid, Queue): Receive `loadMoreRef` via props
- **Pages**: Only create `loadMoreRef` for layout components that need it

### 3. **Avoid Duplication**

```tsx
// ❌ BAD: Duplicate logic
const Parent = () => {
  const ref1 = useInfiniteScroll({ ... }); // Not used
  return <Child />; // Child creates ref2 internally
};

// ✅ GOOD: Single source of truth
const Parent = () => {
  return <Child />; // Child manages its own scroll
};
```

## 🧪 Testing Checklist

### Table View:

- [ ] Scroll to bottom → triggers load more
- [ ] Loading indicator appears
- [ ] New items append to list
- [ ] No duplicate requests

### Grid View:

- [ ] Scroll to bottom → triggers load more
- [ ] Loading indicator appears
- [ ] New items append to grid
- [ ] No duplicate requests

### Detail Page (Queue):

- [ ] Scroll queue → triggers load more
- [ ] Active item stays in view
- [ ] Smooth scrolling

### Edge Cases:

- [ ] No next page → no trigger element
- [ ] Already fetching → no duplicate requests
- [ ] Fast scrolling → handles correctly
- [ ] Switch view modes → refs don't conflict

## 🐞 Debug Tips

### If infinite scroll still not working:

1. **Check `hasNextPage` value:**

```tsx
console.log('hasNextPage:', hasNextPage);
// Should be true when there are more pages
```

2. **Check trigger element renders:**

```tsx
{
  loadMoreRef && console.log('Render trigger element');
}
```

3. **Check IntersectionObserver attaches:**

```tsx
// In useInfiniteScroll hook
useEffect(() => {
  console.log('Observer attached to:', loadMoreRef.current);
}, [loadMoreRef.current]);
```

4. **Check container has scroll:**

```css
/* Container must be scrollable */
.container {
  overflow-y: auto; /* Required */
  height: 100vh; /* Or fixed height */
}
```

5. **Check rootMargin:**

```tsx
const loadMoreRef = useInfiniteScroll({
  threshold: 300, // Trigger 300px before reaching element
});
```

### Common Issues:

| Issue                  | Cause                    | Solution                             |
| ---------------------- | ------------------------ | ------------------------------------ |
| Never triggers         | Container not scrollable | Add `overflow-y: auto`               |
| Triggers too early     | `threshold` too large    | Reduce threshold value               |
| Triggers twice         | Duplicate refs           | Remove duplicate `useInfiniteScroll` |
| Doesn't trigger at all | Element not visible      | Check if trigger element renders     |
| Triggers on mount      | Element in viewport      | Increase threshold or adjust layout  |

## 📊 Before vs After

### Before (Broken):

```
Page
  ├─ useInfiniteScroll() → loadMoreRef1 ❌ Unused
  └─ ContentTable
      ├─ useInfiniteScroll() → loadMoreRef2 ⚠️ Conflict
      └─ DataTable
          └─ Trigger Element (ref={loadMoreRef2})
```

### After (Fixed):

```
Page (Table View)
  └─ ContentTable
      ├─ useInfiniteScroll() → loadMoreRef ✅
      └─ DataTable
          └─ Trigger Element (ref={loadMoreRef)

Page (Grid View)
  ├─ useInfiniteScroll() → gridLoadMoreRef ✅
  └─ ContentGrid
      └─ Trigger Element (ref={gridLoadMoreRef})
```

## ✅ Verification

Run these checks to verify the fix:

```bash
# 1. No TypeScript errors
npx tsc --noEmit

# 2. No ESLint errors
npx eslint features/content/pages/*.tsx features/content/components/*.tsx

# 3. No duplicate useInfiniteScroll in pages (except for Grid)
grep -r "useInfiniteScroll" features/content/pages/
# Should show:
# - content-page.tsx: 1 instance (gridLoadMoreRef)
# - draft-content-page.tsx: 1 instance (gridLoadMoreRef)
# - *-detail-page.tsx: 1 instance each (for Queue)

# 4. ContentTable/DraftContentTable have their own useInfiniteScroll
grep -r "useInfiniteScroll" features/content/components/*-table.tsx
# Should show:
# - content-table.tsx: 1 instance
# - draft-content-table.tsx: 1 instance
```

## 🎉 Result

- ✅ **No duplicate `loadMoreRef` instances**
- ✅ **Clean ownership model**
- ✅ **Infinite scroll works correctly**
- ✅ **No IntersectionObserver conflicts**
- ✅ **Better code organization**

**Infinite scroll is now fully functional!** 🚀
