# Report Feature Documentation

Feature quản lý báo cáo vi phạm video từ người dùng.

## 📦 **Features**

### **1. Report List Page**

- ✅ Hiển thị danh sách video bị báo cáo
- ✅ Filter theo trạng thái (Pending, Accepted, Rejected)
- ✅ Filter theo lý do báo cáo
- ✅ Search báo cáo
- ✅ Infinite scroll
- ✅ Grid layout với thumbnail preview

### **2. Report Detail Page**

- ✅ Xem chi tiết video bị báo cáo
- ✅ Thông tin người báo cáo
- ✅ Lý do và mô tả báo cáo
- ✅ Video player để review
- ✅ Actions: Accept (ẩn video) hoặc Reject (giữ video)

### **3. Accept Report**

- ✅ Modal confirmation trước khi chấp nhận
- ✅ Ghi chú tùy chọn
- ✅ Ẩn video khỏi hệ thống
- ✅ Toast notifications

### **4. Reject Report**

- ✅ Modal confirmation với **bắt buộc nhập lý do**
- ✅ Validation lý do không được empty
- ✅ Giữ video hiển thị bình thường
- ✅ Toast notifications

## 🎨 **Components**

### **1. ReportCard**

```tsx
<ReportCard report={report} onView={() => handleViewDetail(report.id)} />
```

**Features:**

- ✅ Video thumbnail với alert icon overlay
- ✅ Video title
- ✅ Report reason badge
- ✅ Status badge với color coding
- ✅ Reporter info (username)
- ✅ Timestamp
- ✅ Description preview
- ✅ Hover effects (border, scale)

**Style:**

- Dark background: `bg-black`
- Border: `border-white/10` → `hover:border-white/30`
- Hover line animation
- Carbon Kinetic theme

### **2. AcceptConfirmationModal**

```tsx
<AcceptConfirmationModal
  isOpen={isAcceptModalOpen}
  onClose={() => setIsAcceptModalOpen(false)}
  onConfirm={(note) => handleAccept(note)}
/>
```

**Features:**

- ✅ Warning message về ẩn video
- ✅ Optional note textarea
- ✅ Yellow/warning color scheme
- ✅ Confirm/Cancel buttons

### **3. RejectConfirmationModal (Reused)**

```tsx
<RejectConfirmationModal
  isOpen={isRejectModalOpen}
  onClose={() => setIsRejectModalOpen(false)}
  onConfirm={(reason) => handleReject(reason)}
/>
```

**Features:**

- ✅ **Required reason field**
- ✅ Validation: không cho submit empty
- ✅ Error message hiển thị
- ✅ Red/destructive color scheme

## 📊 **API Integration**

### **Endpoints:**

```typescript
// Get reports list
GET /reports?page=1&limit=20&status=pending&reason=spam&search=keyword

// Get report detail
GET /reports/:reportId

// Accept report - Hide video
POST /reports/:reportId/accept
Body: { note?: string }

// Reject report - Keep video
POST /reports/:reportId/reject
Body: { reason: string }
```

### **Types:**

```typescript
interface Report {
  id: string;
  video_id: string;
  video: ReportedVideo;
  reporter: Reporter;
  reason: ReportReason;
  description: string;
  status: ReportStatus;
  created_at: string;
  updated_at: string;
  reviewed_by?: string;
  review_note?: string;
}

enum ReportStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

enum ReportReason {
  SPAM = 'spam',
  INAPPROPRIATE = 'inappropriate',
  COPYRIGHT = 'copyright',
  VIOLENCE = 'violence',
  HARASSMENT = 'harassment',
  MISLEADING = 'misleading',
  OTHER = 'other',
}
```

## 🔄 **User Flows**

### **Flow 1: Accept Report (Ẩn Video)**

```
1. User views report list
2. Click vào report card
3. → Navigate to report detail page
4. Review video player + report info
5. Click "CHẤP NHẬN - ẨN VIDEO" button
6. → AcceptConfirmationModal xuất hiện
7. Modal warning: "Hành động này sẽ ẨN VIDEO"
8. User nhập ghi chú (optional)
9. Click "Xác Nhận Chấp Nhận"
10. → Loading toast
11. → API call: POST /reports/:id/accept
12. → Success toast: "Video đã được ẩn"
13. → Navigate back to report list
```

### **Flow 2: Reject Report (Giữ Video)**

```
1. User views report list
2. Click vào report card
3. → Navigate to report detail page
4. Review video + report info
5. Click "TỪ CHỐI BÁO CÁO" button
6. → RejectConfirmationModal xuất hiện
7. User PHẢI nhập lý do từ chối
8. Validation: reason không được empty
9. Click "Xác Nhận Từ Chối"
10. → Loading toast
11. → API call: POST /reports/:id/reject { reason }
12. → Success toast: "Video vẫn hiển thị"
13. → Navigate back to report list
```

## 🎯 **Page Structure**

### **Report List Page**

```
┌────────────────────────────────────────────────────────┐
│  🚨 BÁO CÁO VI PHẠM                                    │
│  Quản lý các báo cáo vi phạm từ người dùng             │
├────────────────────────────────────────────────────────┤
│  [Filters]                                             │
│  Status: [ CHỜ XỬ LÝ ] [ ĐÃ CHẤP NHẬN ] [ ĐÃ TỪ CHỐI ]│
│  Reason: [ SPAM ] [ BẠO LỰC ] [ VI PHẠM BẢN QUYỀN ]   │
│  Search: [_____________________]                       │
├────────────────────────────────────────────────────────┤
│  [Report Card Grid]                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │ Video 1  │  │ Video 2  │  │ Video 3  │            │
│  │ 🚨       │  │ 🚨       │  │ 🚨       │            │
│  │ SPAM     │  │ BẠO LỰC  │  │ COPYRIGHT│            │
│  │ PENDING  │  │ ACCEPTED │  │ PENDING  │            │
│  └──────────┘  └──────────┘  └──────────┘            │
└────────────────────────────────────────────────────────┘
```

### **Report Detail Page**

```
┌──────────────┬─────────────────────────────────────────┐
│              │  🚨 CHI TIẾT BÁO CÁO                [X]  │
│  VIDEO BỊ    │                                          │
│  BÁO CÁO     │  Status: [ CHỜ XỬ LÝ ]                  │
│              │  Reason: [ SPAM ]                        │
│  ┌─────────┐ │                                          │
│  │ Video   │ │  👤 NGƯỜI BÁO CÁO                       │
│  │ Player  │ │  Username: john_doe                      │
│  │  ▶️     │ │  Email: john@example.com                │
│  └─────────┘ │                                          │
│              │  📝 MÔ TẢ BÁO CÁO                       │
│  Video Title │  "Video này có nội dung spam..."         │
│  ID: 12345   │                                          │
│  1.2M views  │  ⏰ Báo cáo lúc: 23/01/2026 14:30       │
│              │                                          │
│              │  [CHẤP NHẬN - ẨN VIDEO] [TỪ CHỐI BÁO CÁO]│
└──────────────┴─────────────────────────────────────────┘
```

## 🎨 **Styling**

### **Report Card Hover Effect:**

```css
.report-card {
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: black;
  padding: 24px;
  transition: all 0.3s;
}

.report-card:hover {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.05);
}

/* Top line animation */
.report-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: white;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.5s;
}

.report-card:hover::before {
  transform: scaleX(1);
}
```

### **Status Colors:**

```typescript
const colors = {
  pending: 'border-yellow-500 text-yellow-500',
  accepted: 'border-green-500 text-green-500',
  rejected: 'border-red-500 text-red-500',
};
```

### **Alert Icon Overlay:**

```tsx
<div className="absolute inset-0 flex items-center justify-center">
  <AlertTriangle className="h-12 w-12 text-red-500 opacity-75" />
</div>
```

## 🔧 **State Management**

### **Report Store (Zustand)**

```typescript
interface ReportStore {
  filters: {
    status: ReportStatus | '';
    reason: ReportReason | '';
    search: string;
  };
  setFilters: (key, value) => void;
  resetFilters: () => void;
}

const { filters, setFilters } = useReportStore();
```

### **React Query Hooks**

```typescript
// List with infinite scroll
const {
  data: reports,
  isLoading,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
} = useReports(filters);

// Detail
const { data: report, isLoading } = useReportDetail(reportId);

// Mutations
const { mutate: acceptReport, isPending } = useAcceptReport();
const { mutate: rejectReport, isPending } = useRejectReport();
```

## 📁 **File Structure**

```
features/report/
├── types/
│   └── index.ts                    # Report types & enums
├── services/
│   └── report-service.ts          # API calls
├── hooks/
│   └── useReport.ts               # React Query hooks
├── stores/
│   └── useReportStore.ts          # Zustand store
├── utils/
│   └── index.ts                   # Labels, colors, formatters
├── components/
│   ├── report-card.tsx            # Report card component
│   ├── accept-confirmation-modal.tsx  # Accept modal
│   └── index.ts                   # Barrel export
├── pages/
│   ├── report-list-page.tsx       # List page
│   ├── report-detail-page.tsx     # Detail page
│   └── index.ts                   # Barrel export
└── index.ts                       # Feature barrel export
```

## 🛣️ **Routes**

```typescript
// Routes
/report                    → Report List Page
/report/:reportId          → Report Detail Page

// Route files
app/routes/report.tsx
app/routes/report.detail.$reportId.tsx
```

## 🎯 **Key Differences from Content Feature**

### **Accept vs Approve:**

- **Accept Report** → Ẩn video (action on video)
- **Approve Content** → Duyệt content (normal workflow)

### **Reject Report:**

- **Reject Report** → Giữ video, từ chối báo cáo sai
- **Reject Content** → Từ chối content

### **Two Actions:**

```typescript
// Accept - Hide video
{
  report_id: '123',
  note: 'Video vi phạm chính sách' // Optional
}

// Reject - Keep video
{
  report_id: '123',
  reason: 'Báo cáo không hợp lệ' // Required
}
```

## 💡 **Business Logic**

### **Accept Report:**

- ✅ Video bị ẩn (`visibility: 'hidden'`)
- ✅ Report status → `ACCEPTED`
- ✅ Ghi nhận reviewer
- ✅ Optional note

### **Reject Report:**

- ✅ Video vẫn hiển thị
- ✅ Report status → `REJECTED`
- ✅ Ghi nhận reviewer
- ✅ **Required reason** (giải thích tại sao reject)

## 🚀 **Usage**

### **Navigate to Report List:**

```tsx
import { useNavigate } from '@tanstack/react-router';

const navigate = useNavigate();
navigate({ to: '/report' });
```

### **View Report Detail:**

```tsx
navigate({
  to: '/report/$reportId',
  params: { reportId: '123' },
});
```

### **Filter Reports:**

```typescript
const { filters, setFilters } = useReportStore();

// Filter by status
setFilters('status', ReportStatus.PENDING);

// Filter by reason
setFilters('reason', ReportReason.SPAM);

// Search
setFilters('search', 'keyword');
```

### **Process Report:**

```typescript
// Accept
const { mutate: acceptReport } = useAcceptReport();
acceptReport({
  report_id: '123',
  note: 'Video vi phạm',
});

// Reject
const { mutate: rejectReport } = useRejectReport();
rejectReport({
  report_id: '123',
  reason: 'Báo cáo không chính xác',
});
```

## ✨ **Labels & Constants**

### **Status Labels:**

```typescript
const REPORT_STATUS_LABELS = {
  all: 'TẤT CẢ',
  pending: 'CHỜ XỬ LÝ',
  accepted: 'ĐÃ CHẤP NHẬN',
  rejected: 'ĐÃ TỪ CHỐI',
};
```

### **Reason Labels:**

```typescript
const REPORT_REASON_LABELS = {
  spam: 'SPAM',
  inappropriate: 'NỘI DUNG KHÔNG PHIM HỢP',
  copyright: 'VI PHẠM BẢN QUYỀN',
  violence: 'BẠO LỰC',
  harassment: 'QUẤY RỐI',
  misleading: 'SAI SỰ THẬT',
  other: 'KHÁC',
};
```

### **Status Colors:**

```typescript
const getReportStatusColor = (status: ReportStatus) => {
  switch (status) {
    case ReportStatus.PENDING:
      return 'border-yellow-500 text-yellow-500';
    case ReportStatus.ACCEPTED:
      return 'border-green-500 text-green-500';
    case ReportStatus.REJECTED:
      return 'border-red-500 text-red-500';
  }
};
```

## 🎬 **Modals**

### **Accept Confirmation Modal:**

```
╔════════════════════════════════════════╗
║ ⚠️  Xác Nhận Chấp Nhận Report          ║
╠════════════════════════════════════════╣
║ Hành động này sẽ ẨN VIDEO khỏi hệ      ║
║ thống. Video sẽ không còn hiển thị.    ║
║                                         ║
║ Ghi chú (tùy chọn):                    ║
║ [________________________]             ║
║                                         ║
║        [Hủy Bỏ]  [Xác Nhận Chấp Nhận] ║
╚════════════════════════════════════════╝
```

### **Reject Confirmation Modal:**

```
╔════════════════════════════════════════╗
║ ⚠️  Xác Nhận Từ Chối                   ║
╠════════════════════════════════════════╣
║ Báo cáo sẽ bị từ chối và video vẫn     ║
║ hiển thị bình thường.                  ║
║                                         ║
║ Lý do từ chối (bắt buộc):              ║
║ [________________________]             ║
║ ❌ Vui lòng nhập lý do                 ║
║                                         ║
║        [Hủy Bỏ]  [Xác Nhận Từ Chối]   ║
╚════════════════════════════════════════╝
```

## 📱 **Responsive Design**

### **Grid Layout:**

- Mobile: 1 column
- Tablet (md): 2 columns
- Desktop (lg): 3 columns
- Large (xl): 4 columns

```tsx
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {reports.map((report) => (
    <ReportCard />
  ))}
</div>
```

### **Detail Layout:**

- Desktop: 2-column (video sidebar + details)
- Mobile: Stack vertically

## 🔐 **Permissions**

Reports typically require moderator/admin role:

```typescript
// In beforeLoad or middleware
if (currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.REVIEWER) {
  throw redirect({ to: '/dashboard' });
}
```

## 📚 **Related Files**

- [Report List Page](../features/report/pages/report-list-page.tsx)
- [Report Detail Page](../features/report/pages/report-detail-page.tsx)
- [Report Card Component](../features/report/components/report-card.tsx)
- [Accept Modal](../features/report/components/accept-confirmation-modal.tsx)
- [Report Service](../features/report/services/report-service.ts)
- [Report Hooks](../features/report/hooks/useReport.ts)
- [Report Store](../features/report/stores/useReportStore.ts)
- [Report Utils](../features/report/utils/index.ts)
- [Report Routes](../app/routes/report.tsx)

## ✅ **Checklist**

- ✅ Types & enums defined
- ✅ API service with 4 endpoints
- ✅ React Query hooks (list, detail, accept, reject)
- ✅ Zustand store for filters
- ✅ Report card component
- ✅ Accept confirmation modal
- ✅ Reject confirmation modal (reused)
- ✅ List page with filters
- ✅ Detail page with video player
- ✅ Routes registered
- ✅ Sidebar menu item added
- ✅ Toast notifications
- ✅ Loading states
- ✅ Error handling
- ✅ Carbon Kinetic theme
- ✅ Infinite scroll
- ✅ Responsive design

## 🎉 **Summary**

Feature report hoàn chỉnh với:

- 📋 List page: Filter, search, infinite scroll
- 🔍 Detail page: Video preview, report info, actions
- ✅ Accept report: Modal với optional note → Ẩn video
- ❌ Reject report: Modal với **required reason** → Giữ video
- 🎨 Carbon Kinetic theme consistency
- 📱 Responsive grid layout
- 🔄 Real-time toast notifications
