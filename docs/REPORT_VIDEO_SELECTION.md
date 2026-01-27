# Report Video Selection Logic

## 📋 Overview

Logic chọn reports để ẩn/hiện video trong report detail page.

## 🎯 Core Concept

**Key Point:** Action cuối cùng là **ẨN/HIỆN VIDEO**, không phải xóa report.

- 1 video có thể có nhiều reports từ nhiều users
- Khi chọn **bất kỳ report nào** của video → Select **toàn bộ video**
- Khi Accept/Reject → Ảnh hưởng **tất cả reports** của video đó

## 🔄 Data Flow

### **1. State Management:**

```typescript
const [selectedVideoIds, setSelectedVideoIds] = useState<string[]>([]);
```

**Important:** State lưu **video_ids**, KHÔNG phải report IDs!

### **2. Selection Logic:**

```typescript
const handleToggleSelect = (reportId: string) => {
  // Find report to get its video_id
  const selectedReport = report?.reports.find((r) => r.id === reportId);
  if (!selectedReport) return;

  const videoId = selectedReport.video_id;

  // Toggle video_id in selectedVideoIds
  setSelectedVideoIds((prev) =>
    prev.includes(videoId) ? prev.filter((id) => id !== videoId) : [...prev, videoId]
  );
};
```

**Flow:**

1. User clicks checkbox on Report #1 (report.id = "r1", video_id = "v1")
2. `handleToggleSelect("r1")` called
3. Find report "r1" → Extract video_id "v1"
4. Toggle "v1" in `selectedVideoIds`
5. All reports with video_id "v1" now show as selected

### **3. Rendering:**

```typescript
<ReportItem
  report={reportItem}
  isSelected={selectedVideoIds.includes(reportItem.video_id)} // ✅ Check by video_id
  onToggleSelect={handleToggleSelect} // Pass report.id
/>
```

**Why this works:**

- Multiple reports can share same `video_id`
- When `selectedVideoIds` contains "v1"
- ALL reports with `video_id === "v1"` show as selected

## 📊 Example Scenario

### **Data:**

```typescript
const report = {
  video_info: { id: 'video-123', title: 'Bad Content' },
  reports: [
    { id: 'report-1', video_id: 'video-123', user_reporter: 'user_a', status: 'pending' },
    { id: 'report-2', video_id: 'video-123', user_reporter: 'user_b', status: 'pending' },
    { id: 'report-3', video_id: 'video-123', user_reporter: 'user_c', status: 'pending' },
  ],
};
```

### **User Actions:**

#### **Action 1: Select Report #1**

```typescript
// User clicks checkbox on Report #1
handleToggleSelect('report-1');

// Result:
selectedVideoIds = ['video-123'];

// UI Effect:
// - Report #1: ✅ Selected (video_id === "video-123")
// - Report #2: ✅ Selected (video_id === "video-123")
// - Report #3: ✅ Selected (video_id === "video-123")
```

**Why all 3 selected?** Because they all share `video_id: "video-123"`

#### **Action 2: Accept**

```typescript
acceptReport({
  is_hidden: true,
  video_ids: ['video-123'], // ✅ Only 1 video, but affects all 3 reports
});

// API Result:
// - Video "video-123" is hidden
// - All 3 reports are marked as "resolved"
```

## 🔀 Select All Logic

```typescript
const handleSelectAll = () => {
  // Get UNIQUE video_ids from pending reports
  const uniqueVideoIds = [...new Set(pendingReports.map((r) => r.video_id))];

  if (selectedVideoIds.length === uniqueVideoIds.length) {
    setSelectedVideoIds([]);
  } else {
    setSelectedVideoIds(uniqueVideoIds);
  }
};
```

**Why unique?**

- Same video can have multiple reports
- We only want to count video ONCE

**Example:**

```typescript
// 5 reports, but only 2 unique videos
pendingReports = [
  { id: 'r1', video_id: 'v1' },
  { id: 'r2', video_id: 'v1' }, // Same video
  { id: 'r3', video_id: 'v2' },
  { id: 'r4', video_id: 'v2' }, // Same video
  { id: 'r5', video_id: 'v2' }, // Same video
];

// Select All → selectedVideoIds = ['v1', 'v2']
// UI shows ALL 5 checkboxes as selected
```

## ✅ Accept/Reject Logic

### **Accept (Hide Videos):**

```typescript
const handleAccept = () => {
  // If no selection, get all unique video_ids from pending reports
  const videoIds =
    selectedVideoIds.length > 0
      ? selectedVideoIds
      : [...new Set(pendingReports.map((r) => r.video_id))];

  acceptReport({
    is_hidden: true,
    video_ids: videoIds, // ✅ Array of unique video_ids
  });
};
```

### **Reject (Keep Videos Visible):**

```typescript
const handleReject = () => {
  // Same logic as Accept
  const videoIds =
    selectedVideoIds.length > 0
      ? selectedVideoIds
      : [...new Set(pendingReports.map((r) => r.video_id))];

  rejectReport({
    is_hidden: false,
    video_ids: videoIds, // ✅ Array of unique video_ids
  });
};
```

## 🎨 UI/UX

### **Checkbox Behavior:**

1. **Hover:** Border changes color
2. **Selected:** Checkmark (✓) appears
3. **Disabled:** Only pending reports show checkbox
4. **Group Effect:** All reports of same video highlight together

### **Count Display:**

```tsx
<Button>
  CHẤP NHẬN - ẨN VIDEO
  {selectedVideoIds.length > 0 && ` (${selectedVideoIds.length})`}
</Button>
```

**Shows:**

- No selection: `CHẤP NHẬN - ẨN VIDEO`
- 3 videos selected: `CHẤP NHẬN - ẨN VIDEO (3)`

### **Modal Confirmation:**

```tsx
<AcceptConfirmationModal
  count={selectedVideoIds.length > 0 ? selectedVideoIds.length : uniquePendingVideoIds.length}
/>
```

**Message:**

- 1 video: "Hành động này sẽ ẨN 1 VIDEO"
- 5 videos: "Hành động này sẽ ẨN 5 VIDEO"

## 🐛 Common Mistakes (Fixed)

### **❌ Wrong: Store report IDs**

```typescript
// BAD
const [selectedReportIds, setSelectedReportIds] = useState<string[]>([]);
handleToggleSelect(report.id);
isSelected = selectedReportIds.includes(report.id);
```

**Why wrong?** API expects `video_ids`, not report IDs

### **✅ Correct: Store video IDs**

```typescript
// GOOD
const [selectedVideoIds, setSelectedVideoIds] = useState<string[]>([]);
handleToggleSelect(reportId) {
  const videoId = findReport(reportId).video_id;
  toggleVideoId(videoId);
}
isSelected = selectedVideoIds.includes(report.video_id);
```

## 📈 Benefits

1. **Clear Intent:** Action is on videos, not reports
2. **Consistent UX:** All reports of same video behave together
3. **Efficient API:** Send unique video_ids only
4. **No Duplicates:** `[...new Set()]` ensures uniqueness
5. **Scalable:** Works with any number of reports per video

## 🔍 Testing

### **Test Case 1: Single Report Per Video**

```typescript
// 3 reports, 3 different videos
reports = [
  { id: 'r1', video_id: 'v1' },
  { id: 'r2', video_id: 'v2' },
  { id: 'r3', video_id: 'v3' },
];

// Select report r1 → selectedVideoIds = ['v1']
// Accept → Hide video v1 only
```

### **Test Case 2: Multiple Reports Per Video**

```typescript
// 3 reports, 1 video
reports = [
  { id: 'r1', video_id: 'v1' },
  { id: 'r2', video_id: 'v1' },
  { id: 'r3', video_id: 'v1' },
];

// Select report r1 → selectedVideoIds = ['v1']
// UI shows ALL 3 reports as selected
// Accept → Hide video v1 (affects all 3 reports)
```

### **Test Case 3: Mixed**

```typescript
// 5 reports, 2 videos
reports = [
  { id: 'r1', video_id: 'v1' },
  { id: 'r2', video_id: 'v1' }, // Same video
  { id: 'r3', video_id: 'v2' },
  { id: 'r4', video_id: 'v2' }, // Same video
  { id: 'r5', video_id: 'v2' }, // Same video
];

// Select report r1 → selectedVideoIds = ['v1']
// UI: r1, r2 selected (both video v1)
// Select report r3 → selectedVideoIds = ['v1', 'v2']
// UI: ALL 5 reports selected
// Accept → Hide 2 videos (v1, v2)
```

## 📝 Summary

**Key Points:**

- ✅ State stores **video_ids**, not report IDs
- ✅ Multiple reports can share same video_id
- ✅ Selecting 1 report → Selects entire video
- ✅ UI highlights ALL reports of selected video
- ✅ API receives unique video_ids only
- ✅ Action affects video, not individual reports
