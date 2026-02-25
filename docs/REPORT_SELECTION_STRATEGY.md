# Report Selection Strategy

## 📋 Overview

Chiến lược chọn videos khác nhau giữa List Page và Detail Page.

## 🎯 Strategy

### **List Page: Batch Selection (Nhiều Videos)**

✅ **Cho phép** chọn và ẩn **NHIỀU videos** cùng lúc  
✅ **Use case:** Admin cần xử lý nhiều reports nhanh chóng  
✅ **UI:** Checkboxes, Select All, Floating Action Bar

### **Detail Page: Single Video (1 Video)**

✅ **Chỉ ẩn** video hiện tại đang xem  
✅ **Use case:** Admin xem chi tiết 1 video cụ thể  
✅ **UI:** No checkboxes, Simple Accept/Reject buttons

---

## 📄 List Page (Multiple Selection)

### **Features:**

```typescript
// State
const [selectedVideoIds, setSelectedVideoIds] = useState<string[]>([]);

// Can select multiple videos
selectedVideoIds = ['video-1', 'video-2', 'video-3', ...];

// Batch actions
acceptReport({
  is_hidden: true,
  video_ids: selectedVideoIds, // Multiple videos
});
```

### **UI Components:**

#### **1. Select All Button (Header)**

```tsx
<button onClick={handleSelectAll}>
  <Checkbox checked={allSelected} />
  <span>{allSelected ? 'Bỏ Chọn Tất Cả' : 'Chọn Tất Cả'}</span>
</button>
```

**Behavior:**

- ✅ Only appears if there are pending reports
- ✅ Selects ALL pending videos in current view
- ✅ Toggle all on/off

#### **2. Report Card Checkbox (Top-right)**

```tsx
<ReportCard
  report={report}
  isSelected={selectedVideoIds.includes(report.video_id)}
  onToggleSelect={handleToggleSelect}
/>
```

**Checkbox Rules:**

- ✅ Only visible for **pending reports**
- ✅ Shows checkmark when selected
- ✅ Click stops propagation (doesn't trigger onView)

#### **3. Floating Action Bar (Bottom-center)**

```tsx
{
  selectedVideoIds.length > 0 && (
    <FloatingBar>
      <span>{selectedVideoIds.length} ĐÃ CHỌN</span>
      <Button onClick={acceptBatch}>ẨN VIDEO ({count})</Button>
      <Button onClick={rejectBatch}>TỪ CHỐI ({count})</Button>
      <Button onClick={clear}>HỦY</Button>
    </FloatingBar>
  );
}
```

**Features:**

- ✅ Slides in from bottom with animation
- ✅ Shows count of selected videos
- ✅ Fixed position (always visible)
- ✅ Cancel button clears selection

### **User Flow:**

```
1. User views report list
   ↓
2. Click "Chọn Tất Cả" (or individual checkboxes)
   ↓
3. Floating action bar appears
   → "5 ĐÃ CHỌN"
   ↓
4. Click "ẨN VIDEO (5)"
   ↓
5. Confirmation modal
   → "Hành động này sẽ ẨN 5 VIDEO"
   ↓
6. Confirm
   ↓
7. API call with 5 video_ids
   ↓
8. Toast: "5 video đã được ẩn"
   ↓
9. Selection cleared
```

### **Code Example:**

```typescript
// List Page - Batch Accept
const handleBatchAccept = () => {
  if (selectedVideoIds.length === 0) {
    toast.error('Chưa chọn video nào');
    return;
  }

  const toastId = toast.loading(`Đang ẩn ${selectedVideoIds.length} video...`);

  acceptReport(
    {
      is_hidden: true,
      video_ids: selectedVideoIds, // ✅ Multiple videos
    },
    {
      onSuccess: () => {
        toast.success('CHẤP NHẬN THÀNH CÔNG', {
          description: `${selectedVideoIds.length} video đã được ẩn`,
        });
        setSelectedVideoIds([]); // Clear selection
      },
    }
  );
};
```

---

## 📑 Detail Page (Single Video)

### **Features:**

```typescript
// NO selection state needed
// const [selectedVideoIds, setSelectedVideoIds] = useState<string[]>([]); // ❌ Removed

// Always action on current video
const videoId = report.video_info.id;

acceptReport({
  is_hidden: true,
  video_ids: [videoId], // ✅ Only 1 video
});
```

### **UI Components:**

#### **1. No Checkboxes**

```tsx
<ReportItem report={reportItem} index={index} />
// ❌ No isSelected prop
// ❌ No onToggleSelect prop
```

**Reason:**

- Only 1 video in detail view
- No need to "select" - it's already the focus

#### **2. Simple Action Buttons**

```tsx
<Button onClick={() => setIsAcceptModalOpen(true)}>
  CHẤP NHẬN - ẨN VIDEO
</Button>
<Button onClick={() => setIsRejectModalOpen(true)}>
  TỪ CHỐI BÁO CÁO
</Button>
```

**Features:**

- ✅ No count display `(5)` - always 1 video
- ✅ Direct action on current video
- ✅ Sticky positioned at bottom

#### **3. Modal Always Shows Count = 1**

```tsx
<AcceptConfirmationModal
  isOpen={isAcceptModalOpen}
  onClose={() => setIsAcceptModalOpen(false)}
  onConfirm={handleAccept}
  count={1} // ✅ Always 1
/>
```

### **User Flow:**

```
1. User views report detail (specific video)
   ↓
2. Reviews all reports for this video
   → Report #1, #2, #3 (all for same video)
   ↓
3. Click "CHẤP NHẬN - ẨN VIDEO"
   ↓
4. Confirmation modal
   → "Hành động này sẽ ẨN 1 VIDEO"
   ↓
5. Confirm
   ↓
6. API call with 1 video_id
   ↓
7. Toast: "Video đã được ẩn"
   ↓
8. Navigate back to list
```

### **Code Example:**

```typescript
// Detail Page - Single Accept
const handleAccept = () => {
  if (!report) return;

  // ✅ Only THIS video
  const videoId = report.video_info.id;

  const toastId = toast.loading('Đang xử lý báo cáo...');

  acceptReport(
    {
      is_hidden: true,
      video_ids: [videoId], // ✅ Only 1 video
    },
    {
      onSuccess: () => {
        toast.success('CHẤP NHẬN THÀNH CÔNG', {
          description: 'Video đã được ẩn khỏi hệ thống',
        });
        navigate({ to: '/report' });
      },
    }
  );
};
```

---

## 📊 Comparison Table

| Feature           | List Page                   | Detail Page                |
| ----------------- | --------------------------- | -------------------------- |
| **Selection**     | ✅ Multiple videos          | ❌ Single video (implicit) |
| **Checkboxes**    | ✅ Yes (top-right of cards) | ❌ No                      |
| **Select All**    | ✅ Yes (header button)      | ❌ No                      |
| **Floating Bar**  | ✅ Yes (with count)         | ❌ No                      |
| **Count Display** | ✅ `(5)`                    | ❌ Always 1                |
| **State**         | `selectedVideoIds[]`        | No selection state         |
| **API Call**      | `video_ids: [1,2,3,4,5]`    | `video_ids: [1]`           |
| **Use Case**      | Batch processing            | Deep inspection            |

---

## 🎨 UI/UX Differences

### **List Page:**

```
┌────────────────────────────────────┐
│ BÁO CÁO VI PHẠM  [✓ Chọn Tất Cả] │
├────────────────────────────────────┤
│                                    │
│  ┌──────┐  ┌──────┐  ┌──────┐    │
│  │[✓]   │  │[ ]   │  │[✓]   │    │
│  │Video1│  │Video2│  │Video3│    │
│  └──────┘  └──────┘  └──────┘    │
│                                    │
└────────────────────────────────────┘
         ▲
         │
  ┌──────────────────────┐
  │ 2 ĐÃ CHỌN           │
  │ [ẨN] [TỪ CHỐI] [HỦY]│
  └──────────────────────┘
```

### **Detail Page:**

```
┌──────────────────────────────────┐
│ CHI TIẾT VIDEO BỊ BÁO CÁO       │
├──────────────────────────────────┤
│                                  │
│ Report #1                        │
│ Report #2                        │
│ Report #3                        │
│ (All for same video)             │
│                                  │
│ ┌──────────────────────────────┐│
│ │ [CHẤP NHẬN] [TỪ CHỐI]       ││
│ └──────────────────────────────┘│
└──────────────────────────────────┘
```

---

## ✅ Benefits

### **List Page (Batch):**

1. **Efficiency:** Process multiple reports at once
2. **Bulk Actions:** Handle similar cases together
3. **Time Saving:** Select → Action → Done
4. **Clear Feedback:** Count display

### **Detail Page (Single):**

1. **Simplicity:** No selection complexity
2. **Focus:** Deep dive into one video
3. **Context:** See all reports for same video
4. **Clarity:** Action is obvious (this video)

---

## 🐛 Common Patterns Avoided

### **❌ Wrong: Detail page with multiple selection**

```typescript
// BAD - Detail page with checkboxes
const [selectedVideoIds, setSelectedVideoIds] = useState<string[]>([]);
// → Confusing! Only 1 video visible
```

**Why wrong?**

- Only 1 video in detail view
- Selection is redundant
- Adds unnecessary complexity

### **✅ Correct: Implicit selection in detail**

```typescript
// GOOD - Direct action on current video
const videoId = report.video_info.id; // ✅ This video
acceptReport({ video_ids: [videoId] });
```

---

## 📝 Summary

**Key Points:**

### **List Page:**

- ✅ **Batch selection** for multiple videos
- ✅ Checkboxes, Select All, Floating bar
- ✅ `video_ids: [1, 2, 3, ...]`

### **Detail Page:**

- ✅ **Single video** (implicit)
- ✅ No checkboxes, simple buttons
- ✅ `video_ids: [1]`

**Design Philosophy:**

- **List = Batch:** Efficient bulk processing
- **Detail = Single:** Deep inspection of one item

**User Experience:**

- Clear distinction between modes
- No confusion about what will be affected
- Appropriate UI for each context
