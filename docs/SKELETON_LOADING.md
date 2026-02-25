# Skeleton Loading Components

Loading skeleton components với shimmer animation cho Carbon Kinetic theme.

## 📦 **Structure**

```
shared/components/skeletons/
├── skeleton.tsx                  # Base skeleton component
├── media-card-skeleton.tsx       # Grid item skeleton
├── table-row-skeleton.tsx        # Table row skeleton
├── queue-item-skeleton.tsx       # Queue item skeleton
├── content-grid-skeleton.tsx     # Grid layout skeleton
├── content-table-skeleton.tsx    # Table layout skeleton
├── queue-skeleton.tsx            # Queue list skeleton
└── index.ts                      # Barrel exports
```

## 🎨 **Base Skeleton Component**

### **skeleton.tsx**

```typescript
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
}

<Skeleton className="h-4 w-full" />
<Skeleton variant="circular" className="h-12 w-12" />
<Skeleton variant="text" className="h-3 w-24" />
```

**Features:**

- ✅ 3 variants: `text`, `circular`, `rectangular`
- ✅ Shimmer animation (2s infinite)
- ✅ Dark theme gradient: `zinc-900 → zinc-800 → zinc-900`
- ✅ Customizable with className

**Shimmer Animation:**

```css
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite linear;
}
```

## 🧩 **Individual Skeleton Components**

### **1. MediaCardSkeleton**

Used for grid item loading state.

```tsx
<MediaCardSkeleton />
```

**Structure:**

- Thumbnail (aspect-ratio 9:16)
- Title (2 lines)
- Metadata (2 items)
- Tags (2 badges)

### **2. TableRowSkeleton**

Used for table row loading state.

```tsx
<TableRowSkeleton />
```

**Structure:**

- Checkbox
- Thumbnail (16 x 28)
- Content (title + description)
- Category badge
- Platform badge
- Status badge
- Date
- Actions button

### **3. QueueItemSkeleton**

Used for queue item loading state.

```tsx
<QueueItemSkeleton />
```

**Structure:**

- Thumbnail (16 x 28)
- Title
- Description (2 lines)
- Metadata (2 items)

## 📊 **Layout Skeleton Components**

### **1. ContentGridSkeleton**

Shows multiple MediaCardSkeleton in grid layout.

```tsx
<ContentGridSkeleton count={12} />
```

**Props:**

- `count?: number` - Number of skeleton cards (default: 8)

**Grid Layout:**

- 1 column on mobile
- 2 columns on sm
- 3 columns on md
- 4 columns on lg
- 5 columns on xl

### **2. ContentTableSkeleton**

Shows multiple TableRowSkeleton in table layout.

```tsx
<ContentTableSkeleton rows={10} />
```

**Props:**

- `rows?: number` - Number of skeleton rows (default: 10)

**Features:**

- ✅ Table header with column names
- ✅ Border styling
- ✅ Dark background

### **3. QueueSkeleton**

Shows multiple QueueItemSkeleton in vertical layout.

```tsx
<QueueSkeleton count={5} />
```

**Props:**

- `count?: number` - Number of skeleton items (default: 5)

**Features:**

- ✅ Dividers between items
- ✅ Border container
- ✅ Dark background

## 🚀 **Usage Examples**

### **Example 1: Content Page**

```tsx
import { ContentGridSkeleton, ContentTableSkeleton } from '@/shared/components';

function ContentPageComponent() {
  const { data: items, isLoading } = useContent();
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');

  if (isLoading) {
    return viewMode === 'table' ? (
      <ContentTableSkeleton rows={10} />
    ) : (
      <ContentGridSkeleton count={12} />
    );
  }

  return <ContentGrid items={items} />;
}
```

### **Example 2: Content Crawl Page**

```tsx
import { ContentGridSkeleton, ContentTableSkeleton } from '@/shared/components';

function ContentCrawlPageComponent() {
  const { data: crawlContent, isLoading } = useCrawlContent();
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');

  return (
    <>
      {isLoading ? (
        viewMode === 'table' ? (
          <ContentTableSkeleton rows={10} />
        ) : (
          <ContentGridSkeleton count={12} />
        )
      ) : (
        <ContentGrid items={crawlContent} />
      )}
    </>
  );
}
```

### **Example 3: Detail Page Queue**

```tsx
import { QueueSkeleton } from '@/shared/components';

function DetailPageComponent() {
  const { data: realContent, isLoading } = useContent();

  return (
    <aside className="queue-sidebar">
      {isLoading ? <QueueSkeleton count={8} /> : <Queue queueItems={realContent} item={item} />}
    </aside>
  );
}
```

### **Example 4: Custom Skeleton**

```tsx
import { Skeleton } from '@/shared/components';

function CustomComponent() {
  return (
    <div className="space-y-4">
      {/* Avatar + Name */}
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" className="h-12 w-12" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>

      {/* Content Lines */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  );
}
```

## 🎨 **Styling Details**

### **Carbon Kinetic Theme**

```css
/* Base Skeleton */
.skeleton {
  background: linear-gradient(
    90deg,
    #18181b 0%,
    /* zinc-900 */ #27272a 50%,
    /* zinc-800 */ #18181b 100% /* zinc-900 */
  );
  background-size: 200% 100%;
}

/* Shimmer Effect */
animation: shimmer 2s infinite linear;
```

### **Border Styling**

```css
border: 1px solid rgba(255, 255, 255, 0.1);
```

### **Background Opacity**

```css
background: rgba(0, 0, 0, 0.5);
backdrop-filter: blur(2px);
```

## 📐 **Size Guidelines**

### **Typography Skeletons**

- `h1`: `h-8 w-48`
- `h2`: `h-6 w-40`
- `h3`: `h-5 w-32`
- `p`: `h-4 w-full`
- `small`: `h-3 w-24`
- `tiny`: `h-3 w-16`

### **Image Skeletons**

- Square: `h-24 w-24`
- Thumbnail: `h-16 w-28`
- Banner: `h-48 w-full`
- Avatar: `h-12 w-12` (circular)

### **Component Skeletons**

- Button: `h-8 w-20`
- Badge: `h-5 w-16`
- Input: `h-10 w-full`
- Card: `h-auto w-full` (aspect-ratio varies)

## 🔄 **Loading States**

### **Initial Load**

```tsx
{
  isLoading && <ContentGridSkeleton count={12} />;
}
```

### **Pagination Load**

```tsx
{
  isFetchingNextPage && (
    <div className="mt-4">
      <ContentGridSkeleton count={4} />
    </div>
  );
}
```

### **Conditional Load**

```tsx
{
  isLoading ? (
    <ContentGridSkeleton count={12} />
  ) : items?.length === 0 ? (
    <EmptyState />
  ) : (
    <ContentGrid items={items} />
  );
}
```

## 🎯 **Best Practices**

### **1. Match Layout**

Skeleton should mirror actual content layout:

```tsx
// ✅ Good: Matches actual card structure
<div className="grid grid-cols-4 gap-4">
  <MediaCardSkeleton /> {/* Has thumbnail + title + metadata */}
</div>

// ❌ Bad: Generic skeleton doesn't match
<div className="grid grid-cols-4 gap-4">
  <Skeleton className="h-48 w-full" />
</div>
```

### **2. Appropriate Count**

Show realistic number of items:

```tsx
// ✅ Good: Shows typical page size
<ContentGridSkeleton count={12} />

// ❌ Bad: Too many skeletons
<ContentGridSkeleton count={100} />
```

### **3. Performance**

Limit skeleton count for better performance:

```tsx
// ✅ Good: Reasonable limit
const SKELETON_COUNT = Math.min(expectedItemCount, 20);
<ContentGridSkeleton count={SKELETON_COUNT} />;
```

### **4. Transitions**

Add fade transition when content loads:

```tsx
<div className="animate-in fade-in duration-300">
  {isLoading ? <ContentGridSkeleton /> : <ContentGrid />}
</div>
```

## 🐛 **Troubleshooting**

### **Issue 1: Shimmer not animating**

**Cause:** Missing CSS animation definition

**Fix:**

```css
/* Add to global.css */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite linear;
}
```

### **Issue 2: Skeleton layout doesn't match content**

**Cause:** Skeleton structure differs from actual component

**Fix:** Update skeleton to mirror exact component structure

```tsx
// Match Media component structure
<MediaCardSkeleton>
  <Skeleton className="aspect-[9/16]" /> {/* Thumbnail */}
  <Skeleton className="h-4 w-3/4" /> {/* Title */}
  <Skeleton className="h-3 w-16" /> {/* Badge */}
</MediaCardSkeleton>
```

### **Issue 3: Performance issues with many skeletons**

**Cause:** Too many skeleton components rendering

**Fix:** Limit skeleton count and use CSS-only animations

```tsx
// Limit count
const MAX_SKELETONS = 20;
<ContentGridSkeleton count={Math.min(itemCount, MAX_SKELETONS)} />;
```

## 📚 **Related Files**

- [Base Skeleton](../shared/components/skeletons/skeleton.tsx)
- [Content Grid Skeleton](../shared/components/skeletons/content-grid-skeleton.tsx)
- [Content Table Skeleton](../shared/components/skeletons/content-table-skeleton.tsx)
- [Queue Skeleton](../shared/components/skeletons/queue-skeleton.tsx)
- [Global CSS](../styles/global.css)

## ✨ **Features Summary**

- ✅ **8 skeleton components** (base + 7 specialized)
- ✅ **Shimmer animation** (2s infinite linear)
- ✅ **Carbon Kinetic styling** (dark theme, zinc gradients)
- ✅ **Responsive layouts** (grid, table, queue)
- ✅ **Customizable** (count, className, variants)
- ✅ **Performance optimized** (CSS animations, limited counts)
- ✅ **Type-safe** (TypeScript interfaces)
- ✅ **Accessible** (proper semantic HTML)
