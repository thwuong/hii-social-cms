# Batch Operations Feature

Chức năng duyệt và từ chối hàng loạt (batch approve/reject) cho cả grid và table view modes.

## 📦 **Features**

### **1. Batch Approve** - Duyệt hàng loạt

- ✅ Duyệt nhiều content cùng lúc
- ✅ Chỉ áp dụng cho content ở trạng thái `PENDING_REVIEW`
- ✅ Toast notifications (loading, success, error)
- ✅ Auto clear selection sau khi hoàn thành

### **2. Batch Reject** - Từ chối hàng loạt

- ✅ Từ chối nhiều content cùng lúc
- ✅ Áp dụng cho content ở trạng thái `PENDING_REVIEW` hoặc `APPROVED`
- ✅ Toast notifications (loading, success, error)
- ✅ Auto clear selection sau khi hoàn thành

### **3. Selection Support**

- ✅ Checkbox selection trong **Grid mode** (chỉ PENDING items)
- ✅ Checkbox selection trong **Table mode** (chỉ PENDING items)
- ✅ Select All functionality (chỉ chọn PENDING items)
- ✅ Individual item selection

## 🎨 **UI Components**

### **1. Media Card Checkbox (Grid Mode)**

```tsx
const isPending = item.status === ContentStatus.PENDING_REVIEW;

<Media
  item={item}
  onView={() => handleNavigateToDetail(item)}
  isSelected={selectedIds.includes(item.id)}
  onToggleSelect={isPending ? handleToggleSelect : undefined}
/>;
```

**Features:**

- ✅ Checkbox **chỉ hiển thị ở items có status PENDING_REVIEW**
- ✅ Checkbox hiển thị ở góc trên phải
- ✅ Check icon khi selected
- ✅ Hover effect: border-white
- ✅ Stop propagation để không trigger onView
- ✅ Dark background với backdrop blur

**Style:**

```css
.checkbox {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 30;
  width: 24px;
  height: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  transition: all 0.2s;
}

.checkbox:hover {
  border-color: white;
}
```

### **2. Floating Action Bar**

```tsx
{
  selectedIds.length > 0 && (
    <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2">
      <span>{selectedIds.length} ĐÃ CHỌN</span>
      <Button onClick={handleBatchApprove}>DUYỆT ({batchApproveCount})</Button>
      <Button onClick={handleBatchReject}>TỪ CHỐI ({batchRejectCount})</Button>
      <Button onClick={() => setSelectedIds([])}>HỦY</Button>
    </div>
  );
}
```

**Features:**

- ✅ Hiển thị khi có items được chọn
- ✅ Fixed position ở bottom center
- ✅ Animate slide-in from bottom
- ✅ Show count của selected items
- ✅ Show eligible count cho approve/reject
- ✅ Disable buttons khi không có eligible items
- ✅ Loading states

**Style:**

```css
.action-bar {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: #18181b; /* zinc-900 */
  backdrop-filter: blur(8px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: slideInFromBottom 0.3s ease-out;
}
```

## 🔧 **Implementation**

### **Content Page (Approved Content)**

#### **Hooks:**

```tsx
import { useApproveContents, useRejectContents } from '../hooks/useContent';

const { mutate: approveContents, isPending: isApprovingBatch } = useApproveContents();
const { mutate: rejectContents, isPending: isRejectingBatch } = useRejectContents();
```

#### **Batch Approve:**

```tsx
const handleBatchApprove = () => {
  const eligibleApprovals = items?.filter(
    (item: ContentItem) =>
      selectedIds.includes(item.id) && item.status === ContentStatus.PENDING_REVIEW
  );

  if (!eligibleApprovals || eligibleApprovals.length === 0) {
    toast.error('KHÔNG CÓ NỘI DUNG HỢP LỆ', {
      description: 'Chỉ có thể duyệt nội dung ở trạng thái CHỜ DUYỆT',
    });
    return;
  }

  const toastId = toast.loading(`Đang duyệt ${eligibleApprovals.length} nội dung...`);

  approveContents(
    {
      reel_id: eligibleApprovals.map((item) => item.id),
      reason: 'Approved by admin',
    },
    {
      onSuccess: () => {
        toast.dismiss(toastId);
        toast.success('DUYỆT THÀNH CÔNG', {
          description: `Đã duyệt ${eligibleApprovals.length} nội dung`,
        });
        setSelectedIds([]);
      },
      onError: () => {
        toast.dismiss(toastId);
        toast.error('DUYỆT THẤT BẠI', {
          description: 'Không thể duyệt nội dung. Vui lòng thử lại.',
        });
      },
    }
  );
};
```

#### **Batch Reject:**

```tsx
const handleBatchReject = () => {
  const eligibleRejections = items?.filter(
    (item: ContentItem) =>
      selectedIds.includes(item.id) &&
      (item.status === ContentStatus.PENDING_REVIEW || item.status === ContentStatus.APPROVED)
  );

  if (!eligibleRejections || eligibleRejections.length === 0) {
    toast.error('KHÔNG CÓ NỘI DUNG HỢP LỆ', {
      description: 'Chỉ có thể từ chối nội dung ở trạng thái CHỜ DUYỆT hoặc ĐÃ DUYỆT',
    });
    return;
  }

  const toastId = toast.loading(`Đang từ chối ${eligibleRejections.length} nội dung...`);

  rejectContents(
    {
      reel_id: eligibleRejections.map((item) => item.id),
      reason: 'Rejected by admin',
    },
    {
      onSuccess: () => {
        toast.dismiss(toastId);
        toast.success('TỪ CHỐI THÀNH CÔNG', {
          description: `Đã từ chối ${eligibleRejections.length} nội dung`,
        });
        setSelectedIds([]);
      },
      onError: () => {
        toast.dismiss(toastId);
        toast.error('TỪ CHỐI THẤT BẠI', {
          description: 'Không thể từ chối nội dung. Vui lòng thử lại.',
        });
      },
    }
  );
};
```

### **Crawl Page (Crawler Videos)**

#### **Batch Approve (Crawl):**

```tsx
const handleBatchApprove = () => {
  const eligibleApprovals = crawlContent.filter((item: ContentItem) =>
    selectedIds.includes(item.id)
  );

  const promises = eligibleApprovals.map((item: ContentItem) =>
    makeVideoCrawler({
      payload: {
        is_previewed: true,
        message: 'Approved by admin',
        video_id: Number(item.id),
      },
      video_id: Number(item.id),
    })
  );

  Promise.all(promises)
    .then(() => {
      toast.success('DUYỆT THÀNH CÔNG');
      setSelectedIds([]);
      refreshData();
    })
    .catch(() => {
      toast.error('DUYỆT THẤT BẠI');
    });
};
```

## 📊 **API Integration**

### **1. Approve Batch**

**Endpoint:**

```
POST /reels/dashboard/approve-batch
```

**Request Body:**

```typescript
interface ApproveContentBatchPayload {
  reel_id: string[];
  reason: string;
}
```

**Example:**

```json
{
  "reel_id": ["123", "456", "789"],
  "reason": "Approved by admin"
}
```

### **2. Reject Batch**

**Endpoint:**

```
POST /reels/dashboard/reject-batch
```

**Request Body:**

```typescript
interface ApproveContentBatchPayload {
  reel_id: string[];
  reason: string;
}
```

**Example:**

```json
{
  "reel_id": ["123", "456", "789"],
  "reason": "Rejected by admin"
}
```

### **3. Query Invalidation**

After batch operations, React Query automatically invalidates:

```typescript
// Approve
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: [queryKeys.content.all, filters] });
};

// Reject
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: [queryKeys.content.all, filters] });
};
```

## 🎯 **State Management**

### **Selected IDs State**

```typescript
// Zustand store
const { selectedIds, setSelectedIds } = useContentStore((state) => state);
```

### **Toggle Single Selection:**

```typescript
const handleToggleSelect = (id: string) => {
  const isExists = selectedIds.includes(id);
  if (isExists) {
    setSelectedIds(selectedIds.filter((x) => x !== id));
  } else {
    setSelectedIds([...selectedIds, id]);
  }
};
```

### **Select All:**

```typescript
const handleSelectAll = (visibleItems: ContentItem[]) => {
  // Only select pending items
  const pendingItems = visibleItems.filter((item) => item.status === ContentStatus.PENDING_REVIEW);
  const visibleIds = pendingItems.map((i) => i.id);

  if (visibleIds.every((id) => selectedIds.includes(id.toString()))) {
    setSelectedIds(selectedIds.filter((id) => !visibleIds.includes(id.toString())));
  } else {
    const newSelection = new Set([...selectedIds, ...visibleIds]);
    setSelectedIds(Array.from(newSelection).map((id) => id.toString()));
  }
};
```

## 💡 **Validation Rules**

### **Approve:**

- ✅ Chỉ items với `status === PENDING_REVIEW`
- ✅ Hiển thị error nếu không có eligible items
- ✅ Show count trong button: `DUYỆT (5)`

### **Reject:**

- ✅ Items với `status === PENDING_REVIEW` hoặc `APPROVED`
- ✅ Hiển thị error nếu không có eligible items
- ✅ Show count trong button: `TỪ CHỐI (3)`

### **Count Logic:**

```typescript
// Approve count (PENDING_REVIEW only)
const batchApproveCount = items?.filter(
  (i: ContentItem) => selectedIds.includes(i.id) && i.status === ContentStatus.PENDING_REVIEW
).length;

// Reject count (PENDING_REVIEW or APPROVED)
const batchRejectCount = items?.filter(
  (i: ContentItem) =>
    selectedIds.includes(i.id) &&
    (i.status === ContentStatus.PENDING_REVIEW || i.status === ContentStatus.APPROVED)
).length;
```

## 📱 **User Flow**

### **Flow 1: Grid Mode Batch Approve**

1. User clicks checkboxes trên các media cards
2. Floating action bar xuất hiện với count
3. User clicks "DUYỆT (5)" button
4. Loading toast: "Đang duyệt 5 nội dung..."
5. API call to `/reels/dashboard/approve-batch`
6. Success toast: "DUYỆT THÀNH CÔNG - Đã duyệt 5 nội dung"
7. Selection cleared, list refreshed

### **Flow 2: Table Mode Batch Reject**

1. User checks checkbox trong table rows
2. Hoặc clicks "Select All" checkbox
3. Floating action bar xuất hiện
4. User clicks "TỪ CHỐI (3)" button
5. Loading toast: "Đang từ chối 3 nội dung..."
6. API call to `/reels/dashboard/reject-batch`
7. Success toast: "TỪ CHỐI THÀNH CÔNG - Đã từ chối 3 nội dung"
8. Selection cleared, list refreshed

### **Flow 3: No Eligible Items**

1. User selects items with status `PUBLISHED`
2. Clicks "DUYỆT" button
3. Error toast: "KHÔNG CÓ NỘI DUNG HỢP LỆ - Chỉ có thể duyệt nội dung ở trạng thái CHỜ DUYỆT"
4. Selection remains, user can adjust

## 🐛 **Error Handling**

### **1. Validation Errors**

```typescript
if (!eligibleApprovals || eligibleApprovals.length === 0) {
  toast.error('KHÔNG CÓ NỘI DUNG HỢP LỆ', {
    description: 'Chỉ có thể duyệt nội dung ở trạng thái CHỜ DUYỆT',
  });
  return;
}
```

### **2. API Errors**

```typescript
onError: () => {
  toast.dismiss(toastId);
  toast.error('DUYỆT THẤT BẠI', {
    description: 'Không thể duyệt nội dung. Vui lòng thử lại.',
  });
};
```

### **3. Network Errors**

Handled by React Query's error handling:

- Retry logic (default: 3 times)
- Error boundary support
- Toast notifications

## ✨ **Features Summary**

- ✅ **Grid Mode Selection** - Checkbox trên media cards
- ✅ **Table Mode Selection** - Checkbox trong table rows
- ✅ **Select All** - Chọn tất cả visible items
- ✅ **Batch Approve** - Duyệt hàng loạt (PENDING_REVIEW)
- ✅ **Batch Reject** - Từ chối hàng loạt (PENDING_REVIEW, APPROVED)
- ✅ **Smart Counting** - Chỉ đếm eligible items
- ✅ **Loading States** - Buttons disabled khi processing
- ✅ **Toast Notifications** - Loading, success, error messages
- ✅ **Auto Refresh** - Query invalidation after success
- ✅ **Auto Clear** - Selection cleared after success
- ✅ **Floating Action Bar** - Fixed bottom position, animated
- ✅ **Carbon Kinetic Theme** - Dark theme, monospace fonts

## 🎬 **Detail Page Batch Operations**

Tính năng batch operations cũng có sẵn trong trang detail với checkbox selection khi hover vào queue items.

### **Queue Item Checkbox**

```tsx
interface QueueItemProps {
  qItem: ContentItem;
  activeItem: boolean;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
}

function QueueItem({ qItem, activeItem, isSelected, onToggleSelect }: QueueItemProps) {
  const isPending = qItem.status === ContentStatus.PENDING_REVIEW;

  return (
    <div className="group relative">
      {/* Checkbox - Only for PENDING items, shown on hover or when selected */}
      {isPending && onToggleSelect && (
        <div
          onClick={handleCheckboxClick}
          className={cn(
            'absolute top-2 right-2 z-10 flex h-5 w-5 cursor-pointer items-center justify-center border border-white/20 bg-black/80 backdrop-blur transition-all hover:border-white',
            isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          )}
        >
          {isSelected && <Check size={12} className="text-white" />}
        </div>
      )}
      {/* ... rest of queue item ... */}
    </div>
  );
}
```

**Features:**

- ✅ **Checkbox hiển thị khi hover hoặc khi đã chọn** - Smart visibility
- ✅ **Chỉ cho PENDING items** - `status === PENDING_REVIEW`
- ✅ **Conditional opacity:**
  - Selected: `opacity-100` (luôn hiển thị)
  - Not selected: `opacity-0` → `group-hover:opacity-100` (hiện khi hover)
- ✅ **Smooth transition** - Fade in/out effect
- ✅ **Positioned absolute** - Góc trên phải của item
- ✅ **Backdrop blur** - Dark background với blur effect
- ✅ **Stop propagation** - Không trigger navigation khi click checkbox

### **Detail Page Implementation**

#### **content-detail-page.tsx:**

```tsx
import { useApproveContents, useRejectContents } from '../hooks/useContent';
import { useContentStore } from '../stores/useContentStore';

function DetailPageComponent() {
  // Batch operations
  const { mutate: approveContents, isPending: isApprovingBatch } = useApproveContents();
  const { mutate: rejectContents, isPending: isRejectingBatch } = useRejectContents();
  const { selectedIds, setSelectedIds } = useContentStore((state) => state);

  const handleToggleSelect = (id: string) => {
    const isExists = selectedIds.includes(id);
    if (isExists) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Batch handlers same as content-page.tsx
  const handleBatchApprove = () => {
    /* ... */
  };
  const handleBatchReject = () => {
    /* ... */
  };

  return (
    <div className="detail-layout">
      <Queue
        queueItems={realContent || []}
        item={item}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
      />

      {/* Floating Batch Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 z-50">{/* Same as content-page action bar */}</div>
      )}
    </div>
  );
}
```

#### **content-crawl-detail-page.tsx:**

```tsx
import { useMakeVideoCrawler } from '../hooks/useCrawlContent';
import { useCrawlStore } from '../stores/useCrawlStore';

function DetailPageComponent() {
  const { mutateAsync: makeVideoCrawler } = useMakeVideoCrawler();
  const { selectedIds, setSelectedIds } = useCrawlStore();

  const handleBatchApprove = () => {
    const promises = eligibleApprovals.map((item) =>
      makeVideoCrawler({
        payload: {
          is_previewed: true,
          message: 'Approved by admin',
          video_id: Number(item.id),
        },
        video_id: Number(item.id),
      })
    );

    Promise.all(promises).then(() => {
      toast.success('DUYỆT THÀNH CÔNG');
      setSelectedIds([]);
    });
  };

  return (
    <div className="detail-layout">
      <Queue
        queueItems={crawlContent}
        item={contentDetails}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
      />

      {/* Floating Batch Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 z-50">{/* Same action bar */}</div>
      )}
    </div>
  );
}
```

### **UI/UX in Detail Page**

**Queue Sidebar:**

```
┌──────────────────────────────────────┐
│ HÀNG ĐỢI // CHỜ DUYỆT          12   │
├──────────────────────────────────────┤
│ [Hover to see checkbox]              │
│ ┌─────────┐                      ☑   │ <- Checkbox appears on hover
│ │  thumb  │  Title...                │
│ └─────────┘  Description...          │
├──────────────────────────────────────┤
│ ┌─────────┐                          │ <- No hover, no checkbox
│ │  thumb  │  Title...                │
│ └─────────┘  Description...          │
├──────────────────────────────────────┤
│ [Active Item]                    ✓   │ <- Selected and hovered
│ ┌─────────┐                          │
│ │  thumb  │  Title...                │
│ └─────────┘  Description...          │
└──────────────────────────────────────┘
```

**Floating Action Bar (same as list pages):**

```
╔════════════════════════════════════════╗
║ 5 ĐÃ CHỌN | DUYỆT (3) | TỪ CHỐI (2) | HỦY ║
╚════════════════════════════════════════╝
```

### **CSS for Hover Effect**

```css
/* Queue Item */
.queue-item {
  position: relative;
  transition: all 0.3s;
}

/* Checkbox - Hidden by default, always visible when selected */
.queue-item-checkbox {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  opacity: 0;
  transition: all 0.2s;
  cursor: pointer;
}

/* Show on hover (for unselected items) */
.queue-item:hover .queue-item-checkbox:not(.selected) {
  opacity: 1;
}

/* Always show when selected */
.queue-item-checkbox.selected {
  opacity: 1;
}

/* Hover effect on checkbox */
.queue-item-checkbox:hover {
  border-color: white;
}
```

### **User Flow in Detail Page**

1. **User views detail page** with queue sidebar
2. **Hover over pending queue item** → Checkbox fades in (unselected items)
3. **Click checkbox** → Item selected, check icon appears
4. **Hover away** → **Checkbox stays visible** (because selected)
5. **Hover other unselected items** → Their checkboxes fade in temporarily
6. **Select multiple items** by hovering and clicking
7. **Floating action bar appears** at bottom center showing counts
8. **Click "DUYỆT" or "TỪ CHỐI"** → Batch operation executes
9. **Success** → Toast notification, selection cleared
10. **All checkboxes fade out** (back to hover-only state)

### **Advantages in Detail Page**

- ✅ **Non-intrusive** - Checkboxes only appear on hover (for unselected items)
- ✅ **Persistent visibility** - Selected items keep checkbox visible (no need to hover)
- ✅ **Context-aware** - Only for pending items
- ✅ **Smooth UX** - Fade in/out transitions
- ✅ **Clear visual feedback** - Easy to see which items are selected
- ✅ **Consistent** - Same action bar as list pages
- ✅ **Efficient** - Select multiple items while browsing queue
- ✅ **No confusion** - Selected state is always visible

## 📚 **Related Files**

- [Content Page](../features/content/pages/content-page.tsx)
- [Content Detail Page](../features/content/pages/content-detail-page.tsx)
- [Crawl Page](../features/content/pages/content-crawl-page.tsx)
- [Crawl Detail Page](../features/content/pages/content-crawl-detail-page.tsx)
- [Media Component](../features/content/components/media.tsx)
- [Queue Component](../features/content/components/queue.tsx)
- [Content Hooks](../features/content/hooks/useContent.ts)
- [Content Service](../features/content/services/content-service.ts)
- [Content Store](../features/content/stores/useContentStore.ts)
- [Crawl Store](../features/content/stores/useCrawlStore.ts)
