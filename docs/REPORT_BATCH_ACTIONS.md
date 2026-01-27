# Report Batch Actions Feature

Documentation cho tính năng accept/reject 1 hoặc nhiều reports.

## 📋 **Overview**

Feature cho phép xử lý:

- ✅ **Single Report**: Xử lý tất cả reports cùng lúc (nếu không select)
- ✅ **Multiple Reports**: Select và xử lý nhiều reports cụ thể
- ✅ **All Reports**: "Select All" để xử lý tất cả pending reports

## 🎯 **API Structure**

### **Payload:**

```typescript
export interface ReportPayload {
  is_hidden: boolean; // true = hide videos, false = keep visible
  video_ids: string[]; // Array of video IDs to process
}

export interface AcceptReportPayload extends ReportPayload {}
export interface RejectReportPayload extends ReportPayload {}
```

### **Endpoints:**

```typescript
// Accept (Hide Videos)
PUT /reels/dashboard/videos/hidden
Body: {
  is_hidden: true,
  video_ids: ["video1", "video2", "video3"]
}

// Reject (Keep Videos Visible)
PUT /reels/dashboard/videos/hidden
Body: {
  is_hidden: false,
  video_ids: ["video1", "video2", "video3"]
}
```

## 🎨 **UI Components**

### **1. Report Item with Checkbox**

Component `ReportItem` được cập nhật với checkbox selection:

```tsx
<ReportItem
  report={report}
  index={0}
  isSelected={selectedVideoIds.includes(report.video_id)}
  onToggleSelect={handleToggleSelect}
>
  {/* Checkbox - Only for PENDING reports */}
  {isPending && onToggleSelect && (
    <button onClick={handleCheckboxClick} className="checkbox absolute top-3 right-3">
      {isSelected && <Check size={14} />}
    </button>
  )}

  {/* Rest of report item content */}
</ReportItem>
```

**Features:**

- ✅ Checkbox chỉ hiển thị cho reports có `status === PENDING`
- ✅ Position: `absolute top-3 right-3`
- ✅ Checkbox với border `white/20` → hover `white`
- ✅ Check icon khi selected
- ✅ `stopPropagation` để không trigger item click

### **2. Select All Checkbox**

Header section với "Select All" functionality:

```tsx
<div className="flex items-center justify-between">
  <Typography>DANH SÁCH BÁO CÁO ({reportCount})</Typography>

  {hasPendingReports && (
    <button onClick={handleSelectAll}>
      <div className={`checkbox ${allSelected ? 'selected' : ''}`}>
        {allSelected && <Check size={12} />}
      </div>
      <span>{allSelected ? 'Bỏ Chọn Tất Cả' : 'Chọn Tất Cả'}</span>
    </button>
  )}
</div>
```

**Features:**

- ✅ Chỉ hiển thị khi có pending reports
- ✅ Toggle all pending reports
- ✅ Text thay đổi: "Chọn Tất Cả" / "Bỏ Chọn Tất Cả"
- ✅ Visual feedback khi all selected

### **3. Action Buttons with Count**

Buttons hiển thị số lượng reports được select:

```tsx
{
  hasPendingReports && (
    <div className="actions">
      <Button onClick={() => setIsAcceptModalOpen(true)}>
        <Check size={16} />
        CHẤP NHẬN - ẨN VIDEO
        {selectedVideoIds.length > 0 && ` (${selectedVideoIds.length})`}
      </Button>

      <Button onClick={() => setIsRejectModalOpen(true)}>
        <XCircle size={16} />
        TỪ CHỐI BÁO CÁO
        {selectedVideoIds.length > 0 && ` (${selectedVideoIds.length})`}
      </Button>
    </div>
  );
}
```

**Features:**

- ✅ Chỉ hiển thị khi có pending reports
- ✅ Hiển thị count nếu có selection: `(3)`
- ✅ Nếu không select gì → xử lý ALL pending reports
- ✅ Disabled state khi đang processing

### **4. Accept Confirmation Modal**

Modal được cập nhật để hiển thị count:

```tsx
<AcceptConfirmationModal
  isOpen={isAcceptModalOpen}
  onClose={() => setIsAcceptModalOpen(false)}
  onConfirm={handleAccept}
  count={selectedVideoIds.length > 0 ? selectedVideoIds.length : pendingReports.length}
>
  <p>
    Hành động này sẽ ẨN {count} VIDEO khỏi hệ thống.
    {count > 1 ? ' Các video' : ' Video'} sẽ không còn hiển thị.
  </p>

  {count > 1 && <div className="warning-banner">⚠️ Bạn đang xử lý {count} báo cáo cùng lúc</div>}

  <Button onClick={handleSubmit}>Xác Nhận Chấp Nhận {count > 1 && `(${count})`}</Button>
</AcceptConfirmationModal>
```

**Features:**

- ✅ Dynamic count display
- ✅ Singular/Plural text: "video" vs "các video"
- ✅ Warning banner nếu > 1 report
- ✅ Count trong button text

## 💡 **Implementation**

### **State Management:**

```typescript
function ReportDetailPage() {
  const [selectedVideoIds, setSelectedVideoIds] = useState<string[]>([]);

  // Get only pending reports (for selection)
  const pendingReports = report?.reports.filter((r) => r.status === ReportStatus.PENDING) || [];

  const hasPendingReports = pendingReports.length > 0;
}
```

### **Toggle Single Selection:**

```typescript
const handleToggleSelect = (videoId: string) => {
  setSelectedVideoIds((prev) =>
    prev.includes(videoId) ? prev.filter((id) => id !== videoId) : [...prev, videoId]
  );
};
```

### **Select All / Deselect All:**

```typescript
const handleSelectAll = () => {
  if (selectedVideoIds.length === pendingReports.length) {
    // All selected → Deselect all
    setSelectedVideoIds([]);
  } else {
    // Not all selected → Select all pending
    setSelectedVideoIds(pendingReports.map((r) => r.video_id));
  }
};

const allSelected = pendingReports.length > 0 && selectedVideoIds.length === pendingReports.length;
```

### **Accept Handler:**

```typescript
const handleAccept = () => {
  if (!report) return;

  // If no selection, process ALL pending reports
  const videoIds =
    selectedVideoIds.length > 0 ? selectedVideoIds : pendingReports.map((r) => r.video_id);

  if (videoIds.length === 0) {
    toast.error('Không có báo cáo nào để xử lý');
    return;
  }

  const toastId = toast.loading(`Đang xử lý ${videoIds.length} báo cáo...`);

  acceptReport(
    {
      is_hidden: true,
      video_ids: videoIds,
    },
    {
      onSuccess: () => {
        toast.dismiss(toastId);
        toast.success('CHẤP NHẬN THÀNH CÔNG', {
          description: `${videoIds.length} video đã được ẩn khỏi hệ thống`,
        });
        setIsAcceptModalOpen(false);
        setSelectedVideoIds([]); // Clear selection
        navigate({ to: '/report' });
      },
      onError: () => {
        toast.dismiss(toastId);
        toast.error('CHẤP NHẬN THẤT BẠI');
      },
    }
  );
};
```

### **Reject Handler:**

```typescript
const handleReject = (reason: string) => {
  if (!report) return;

  // If no selection, process ALL pending reports
  const videoIds =
    selectedVideoIds.length > 0 ? selectedVideoIds : pendingReports.map((r) => r.video_id);

  if (videoIds.length === 0) {
    toast.error('Không có báo cáo nào để xử lý');
    return;
  }

  const toastId = toast.loading(`Đang xử lý ${videoIds.length} báo cáo...`);

  rejectReport(
    {
      is_hidden: false,
      video_ids: videoIds,
    },
    {
      onSuccess: () => {
        toast.dismiss(toastId);
        toast.success('TỪ CHỐI THÀNH CÔNG', {
          description: `${videoIds.length} video vẫn hiển thị bình thường`,
        });
        setIsRejectModalOpen(false);
        setSelectedVideoIds([]); // Clear selection
        navigate({ to: '/report' });
      },
      onError: () => {
        toast.dismiss(toastId);
        toast.error('TỪ CHỐI THẤT BẠI');
      },
    }
  );
};
```

## 🔄 **User Flows**

### **Flow 1: Accept All Pending Reports (No Selection)**

```
1. User opens report detail page
   → Sees all reports listed
   → Some are PENDING, some are RESOLVED/REJECTED

2. User does NOT select any checkboxes

3. User clicks "CHẤP NHẬN - ẨN VIDEO" button
   → Modal opens: "Hành động này sẽ ẨN 3 VIDEO"
   → Warning: "⚠️ Bạn đang xử lý 3 báo cáo cùng lúc"

4. User confirms
   → Loading toast: "Đang xử lý 3 báo cáo..."
   → API call with all pending video_ids
   → Success toast: "3 video đã được ẩn khỏi hệ thống"
   → Navigate back to list
```

### **Flow 2: Accept Selected Reports**

```
1. User opens report detail page
   → Sees 5 pending reports

2. User selects 2 reports via checkboxes
   → Report #1: ✓ checked
   → Report #3: ✓ checked
   → Button shows: "CHẤP NHẬN - ẨN VIDEO (2)"

3. User clicks button
   → Modal: "Hành động này sẽ ẨN 2 VIDEO"
   → Warning: "⚠️ Bạn đang xử lý 2 báo cáo cùng lúc"

4. User confirms
   → Loading toast: "Đang xử lý 2 báo cáo..."
   → API call with only 2 selected video_ids
   → Success toast: "2 video đã được ẩn"
   → Selection cleared
   → Navigate back
```

### **Flow 3: Select All → Deselect Some → Accept**

```
1. User clicks "Chọn Tất Cả"
   → All 5 pending reports selected
   → Button: "CHẤP NHẬN - ẨN VIDEO (5)"

2. User unchecks 2 reports
   → Now 3 reports selected
   → Button: "CHẤP NHẬN - ẨN VIDEO (3)"

3. User clicks button
   → Modal: "Hành động này sẽ ẨN 3 VIDEO"

4. User confirms
   → Process only 3 selected videos
```

### **Flow 4: Select All → Deselect All**

```
1. User clicks "Chọn Tất Cả"
   → All pending reports selected
   → Button text: "Bỏ Chọn Tất Cả"

2. User clicks "Bỏ Chọn Tất Cả" again
   → All checkboxes unchecked
   → Button text back to: "Chọn Tất Cả"
   → Action button shows no count

3. If user clicks action button now
   → Will process ALL pending reports (default behavior)
```

## 🎨 **Styling**

### **Checkbox in Report Item:**

```css
.report-item-checkbox {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;

  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;

  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);

  cursor: pointer;
  transition: all 0.2s;
}

.report-item-checkbox:hover {
  border-color: white;
}

.report-item-checkbox.selected {
  background: white;
}

.report-item-checkbox.selected .check-icon {
  color: black;
}
```

### **Select All Button:**

```css
.select-all-button {
  display: flex;
  align-items: center;
  gap: 8px;

  font-family: monospace;
  font-size: 12px;
  text-transform: uppercase;
  color: rgb(161, 161, 170); /* zinc-400 */

  transition: color 0.2s;
  cursor: pointer;
}

.select-all-button:hover {
  color: white;
}

.select-all-checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;

  border: 1px solid rgba(255, 255, 255, 0.2);
  background: transparent;
  transition: all 0.2s;
}

.select-all-checkbox:hover {
  border-color: white;
}

.select-all-checkbox.selected {
  border-color: white;
  background: white;
}
```

### **Warning Banner in Modal:**

```css
.batch-warning-banner {
  border-left: 2px solid rgb(234, 179, 8); /* yellow-500 */
  background: rgba(234, 179, 8, 0.05);
  padding: 12px;

  font-family: monospace;
  font-size: 12px;
  color: rgb(234, 179, 8);
}
```

## 📊 **Logic Summary**

### **Selection Logic:**

```typescript
// Only PENDING reports can be selected
const pendingReports = reports.filter((r) => r.status === 'pending');

// User selection state
const [selectedVideoIds, setSelectedVideoIds] = useState<string[]>([]);

// Check if all selected
const allSelected = pendingReports.length > 0 && selectedVideoIds.length === pendingReports.length;
```

### **Processing Logic:**

```typescript
// Determine which videos to process
const videoIds =
  selectedVideoIds.length > 0
    ? selectedVideoIds // Use selection if any
    : pendingReports.map((r) => r.video_id); // Otherwise use ALL pending

// Validation
if (videoIds.length === 0) {
  toast.error('Không có báo cáo nào để xử lý');
  return;
}

// Process
acceptReport({ is_hidden: true, video_ids: videoIds });
```

### **Count Display:**

```typescript
// Button count
const displayCount = selectedVideoIds.length;

// Modal count
const modalCount = selectedVideoIds.length > 0 ? selectedVideoIds.length : pendingReports.length;
```

## ✅ **Features**

### **1. Checkbox Selection**

- ✅ Chỉ cho pending reports
- ✅ Individual toggle
- ✅ Visual feedback (check icon)
- ✅ Absolute positioning (top-right)

### **2. Select All**

- ✅ Toggle all pending reports
- ✅ Dynamic button text
- ✅ Visual state (checkbox + text)
- ✅ Only visible if has pending reports

### **3. Action Buttons**

- ✅ Count badge khi có selection
- ✅ Disabled state during processing
- ✅ Only visible if has pending reports

### **4. Accept Modal**

- ✅ Dynamic count display
- ✅ Singular/Plural text
- ✅ Warning banner for batch
- ✅ Count in confirm button

### **5. Toast Notifications**

- ✅ Loading with count
- ✅ Success with count
- ✅ Error handling
- ✅ Clear selection after success

### **6. API Integration**

- ✅ Single endpoint for both accept/reject
- ✅ `is_hidden` flag (true/false)
- ✅ `video_ids` array
- ✅ Supports 1 to N videos

## 🔧 **Technical Details**

### **Service Methods:**

```typescript
// Accept (Hide Videos)
acceptReport: async (payload: AcceptReportPayload) => {
  await api.put('reels/dashboard/videos/hidden', {
    is_hidden: true,
    video_ids: payload.video_ids,
  });
};

// Reject (Keep Visible)
rejectReport: async (payload: RejectReportPayload) => {
  await api.put('reels/dashboard/videos/hidden', {
    is_hidden: false,
    video_ids: payload.video_ids,
  });
};
```

### **Component Props:**

```typescript
// ReportItem
interface ReportItemProps {
  report: Report;
  index: number;
  isSelected?: boolean;
  onToggleSelect?: (videoId: string) => void;
}

// AcceptConfirmationModal
interface AcceptConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  count?: number; // Number of reports to process
}
```

## 📁 **Files Modified**

### **Updated:**

1. ✅ `/features/report/services/report-service.ts` - API methods
2. ✅ `/features/report/components/report-item.tsx` - Added checkbox
3. ✅ `/features/report/components/accept-confirmation-modal.tsx` - Added count display
4. ✅ `/features/report/pages/report-detail-page.tsx` - Selection logic & UI
5. ✅ `/features/report/types/index.ts` - Updated payload types

### **Created:**

6. ✅ `/docs/REPORT_BATCH_ACTIONS.md` - This documentation

## 🎉 **Summary**

Feature batch actions hoàn chỉnh:

- 📋 **Flexible**: Xử lý 1 hoặc nhiều reports
- ✅ **Smart Default**: Nếu không select → xử lý ALL pending
- 🎯 **Selective**: Checkbox cho từng report + Select All
- 📊 **Count Display**: Buttons, modals, toasts đều show count
- 🎨 **UI Feedback**: Visual states, warnings, confirmations
- 🔐 **Safe**: Chỉ pending reports, confirmation modals
- 🚀 **Efficient**: Single API call cho multiple videos

User có thể:

- ✅ Không select gì → Xử lý tất cả pending reports
- ✅ Select 1 report → Xử lý 1 video
- ✅ Select nhiều reports → Xử lý nhiều videos
- ✅ "Select All" → Xử lý tất cả pending
- ✅ Select All → Deselect một số → Xử lý phần còn lại
