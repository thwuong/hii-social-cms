# Multiple Reports Feature

Documentation cho tính năng hiển thị nhiều báo cáo cho 1 video.

## 📋 **Overview**

Một video có thể bị nhiều người dùng báo cáo. Feature này hiển thị:

- Tổng số báo cáo trong **Report Card**
- Chi tiết từng báo cáo trong **Report Detail Page**

## 🎯 **Data Structure**

### **Report List Response (Video with Reports):**

```typescript
export interface Video {
  latest_report: string; // Timestamp của report mới nhất
  report_count: number; // Tổng số report
  reports: Report[]; // Array tất cả reports
  video_id: string;
  video_info: VideoInfo; // Thông tin video
}

export interface Report {
  id: string; // Report ID
  video_id: string;
  user_reporter: string; // Username người report
  reason_id: string; // ID lý do report
  description: string; // Mô tả chi tiết
  status: string; // pending | resolved | rejected | reviewed
  created_at: string;
  updated_at: string;
}
```

### **Report Detail Response:**

```typescript
export interface ReportDetailResponse {
  reports: Report[]; // Array tất cả reports cho video này
  video: VideoInfo; // Thông tin video bị report
}
```

## 🎨 **UI Components**

### **1. Report Card (List Page)**

Hiển thị overview của video bị báo cáo:

```tsx
<ReportCard report={video}>
  {/* Video Thumbnail */}
  <img src={video.video_info.thumbnail.url} />

  {/* Report Count Badge */}
  <Badge variant="destructive">{video.report_count} BÁO CÁO</Badge>

  {/* Latest Reporter */}
  <div>
    {video.reports[0].user_reporter}
    {video.report_count > 1 && <span>+{video.report_count - 1} người khác</span>}
  </div>

  {/* Latest Report Time */}
  <div>Báo cáo mới nhất: {formatDate(video.latest_report)}</div>
</ReportCard>
```

**Features:**

- ✅ Badge hiển thị số lượng báo cáo: `{count} BÁO CÁO`
- ✅ Tên người báo cáo đầu tiên
- ✅ Text `+{n} người khác` nếu có > 1 report
- ✅ Timestamp của báo cáo mới nhất
- ✅ Preview mô tả của report đầu tiên

### **2. Report Item Component**

Component riêng để hiển thị từng report trong detail page:

```tsx
<ReportItem report={report} index={0}>
  {/* Report Number */}
  <div className="badge">#{index + 1}</div>

  {/* Report ID */}
  <div>Báo Cáo #{report.id.slice(0, 8)}</div>

  {/* Status Badge */}
  <Badge className={statusColor}>{report.status}</Badge>

  {/* Reporter Info */}
  <div>
    <User /> {report.user_reporter}
  </div>

  {/* Reason Badge */}
  <div>
    <AlertTriangle /> Lý do:
    <Badge variant="destructive">{report.reason_id}</Badge>
  </div>

  {/* Description */}
  <div className="description">{report.description}</div>

  {/* Timestamps */}
  <div>
    Tạo: {formatDate(report.created_at)}
    Cập nhật: {formatDate(report.updated_at)}
  </div>
</ReportItem>
```

**Style:**

- Border với hover effect
- Top line animation
- Numbered badge (#1, #2, #3...)
- Color-coded status
- Monospace font cho metadata
- Dark theme với white/10 borders

### **3. Report Detail Page Layout**

```
┌──────────────────┬─────────────────────────────────────────┐
│                  │  🚨 CHI TIẾT VIDEO BỊ BÁO CÁO      [X]  │
│  VIDEO PREVIEW   │                                          │
│                  │  Status: [PENDING]  [5 BÁO CÁO]         │
│  ┌────────────┐  │                                          │
│  │  Video     │  │  📹 THÔNG TIN VIDEO                     │
│  │  Player    │  │  Title: Video title here...              │
│  │   ▶️       │  │  Description: ...                        │
│  └────────────┘  │  Owner: user123                          │
│                  │                                          │
│  Video Title     │  💬 DANH SÁCH BÁO CÁO (5)              │
│  ID: xyz123      │                                          │
│  [5 BÁO CÁO]     │  ┌─────────────────────────────────┐   │
│                  │  │ #1 Báo Cáo #a1b2c3d4             │   │
│                  │  │ [PENDING]                        │   │
│                  │  │ 👤 john_doe                      │   │
│                  │  │ ⚠️  Lý do: [SPAM]                │   │
│                  │  │ 💬 "Video này có nội dung spam" │   │
│                  │  │ 📅 Tạo: 23/01/2026 14:30        │   │
│                  │  └─────────────────────────────────┘   │
│                  │                                          │
│                  │  ┌─────────────────────────────────┐   │
│                  │  │ #2 Báo Cáo #e5f6g7h8             │   │
│                  │  │ [PENDING]                        │   │
│                  │  │ 👤 jane_smith                    │   │
│                  │  │ ⚠️  Lý do: [INAPPROPRIATE]       │   │
│                  │  │ 💬 "Nội dung không phù hợp..."   │   │
│                  │  │ 📅 Tạo: 23/01/2026 15:45        │   │
│                  │  └─────────────────────────────────┘   │
│                  │                                          │
│                  │  [... more reports ...]                 │
│                  │                                          │
│                  │  [CHẤP NHẬN - ẨN VIDEO] [TỪ CHỐI]       │
└──────────────────┴─────────────────────────────────────────┘
```

## 💡 **Implementation**

### **Report Card Component:**

```tsx
function ReportCard({ report, onView }: ReportCardProps) {
  const statusColor = getReportStatusColor(report.video_info.status);

  return (
    <button onClick={onView} className="report-card">
      {/* Video Thumbnail */}
      <img src={report.video_info.thumbnail.url} alt={report.video_info.title} />

      {/* Title */}
      <Typography variant="h4">{report.video_info.title}</Typography>

      {/* Report Count & Status */}
      <div className="flex gap-2">
        <Badge variant="destructive">{report.report_count} BÁO CÁO</Badge>
        <Badge variant="outline" className={statusColor}>
          {report.video_info.status}
        </Badge>
      </div>

      {/* Latest Reporter */}
      <div className="flex items-center gap-2">
        <User size={12} />
        <span>{report.reports[0].user_reporter}</span>
        {report.report_count > 1 && (
          <span className="text-zinc-600">+{report.report_count - 1} người khác</span>
        )}
      </div>

      {/* Latest Report Time */}
      <div className="flex items-center gap-2">
        <Clock size={12} />
        <span>Báo cáo mới nhất: {formatDate(report.latest_report)}</span>
      </div>

      {/* Description Preview (first report only) */}
      {report.reports[0].description && (
        <Typography className="line-clamp-2">{report.reports[0].description}</Typography>
      )}
    </button>
  );
}
```

### **Report Item Component:**

```tsx
function ReportItem({ report, index }: ReportItemProps) {
  const statusColor = getReportStatusColor(report.status);

  return (
    <div className="report-item">
      {/* Header */}
      <div className="flex justify-between">
        <div className="flex gap-3">
          {/* Number Badge */}
          <div className="h-8 w-8 border font-mono">#{index + 1}</div>

          {/* Report ID */}
          <Typography>Báo Cáo #{report.id.slice(0, 8)}</Typography>
        </div>

        {/* Status Badge */}
        <Badge className={statusColor}>{report.status}</Badge>
      </div>

      {/* Reporter Info */}
      <div className="border-l-2 pl-4">
        <div className="flex items-center gap-2">
          <User size={12} />
          <span>{report.user_reporter}</span>
        </div>

        {/* Reason */}
        <div className="flex items-center gap-2">
          <AlertTriangle size={12} />
          <span>Lý do: </span>
          <Badge variant="destructive">{report.reason_id}</Badge>
        </div>
      </div>

      {/* Description */}
      {report.description && (
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare size={10} />
            <span>MÔ TẢ</span>
          </div>
          <div className="border-l-2 pl-4">
            <Typography>{report.description}</Typography>
          </div>
        </div>
      )}

      {/* Timestamps */}
      <div className="border-t pt-4">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <Calendar size={10} />
            <span>Tạo: {formatDate(report.created_at)}</span>
          </div>
          {report.updated_at !== report.created_at && (
            <div className="flex items-center gap-1.5">
              <Clock size={10} />
              <span>Cập nhật: {formatDate(report.updated_at)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

### **Report Detail Page:**

```tsx
function ReportDetailPage() {
  const { reportId } = useParams();
  const { data: report } = useReportDetail(reportId);

  const reportCount = report.reports?.length || 0;

  return (
    <div className="detail-layout">
      {/* LEFT: Video Sidebar */}
      <aside className="queue-sidebar">
        <Typography>VIDEO BỊ BÁO CÁO</Typography>

        {/* Video Player */}
        <video src={report.video.media[0]?.url} poster={report.video.thumbnail?.url} controls />

        {/* Video Info */}
        <Typography variant="h4">{report.video.title}</Typography>
        <div>ID: {report.video.id}</div>

        {/* Report Count Badge */}
        <Badge variant="destructive">
          <MessageSquare size={12} />
          {reportCount} BÁO CÁO
        </Badge>
      </aside>

      {/* CENTER: Report Details */}
      <section className="viewport-container">
        {/* Header */}
        <Typography variant="h2">CHI TIẾT VIDEO BỊ BÁO CÁO</Typography>
        <Typography>Video ID: {report.video.id}</Typography>

        {/* Video Status */}
        <div className="flex gap-2">
          <Badge className={statusColor}>{report.video.status}</Badge>
          <Badge variant="destructive">
            <MessageSquare size={12} />
            {reportCount} Báo Cáo
          </Badge>
        </div>

        {/* Video Information */}
        <div className="border p-4">
          <Typography>{report.video.title}</Typography>
          <Typography>{report.video.description}</Typography>
          <div className="flex gap-4">
            <span>Tạo: {formatDate(report.video.created_at)}</span>
            <span>Owner: {report.video.owner_id}</span>
          </div>
        </div>

        {/* All Reports Section */}
        <div>
          <Typography>
            <MessageSquare size={12} />
            DANH SÁCH BÁO CÁO ({reportCount})
          </Typography>

          <div className="space-y-3">
            {report.reports && report.reports.length > 0 ? (
              report.reports.map((reportItem, index) => (
                <ReportItem key={reportItem.id} report={reportItem} index={index} />
              ))
            ) : (
              <div className="text-center">
                <Typography>Không có báo cáo</Typography>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        {isPending && (
          <div className="sticky bottom-0">
            <Button onClick={() => setIsAcceptModalOpen(true)}>CHẤP NHẬN - ẨN VIDEO</Button>
            <Button onClick={() => setIsRejectModalOpen(true)}>TỪ CHỐI BÁO CÁO</Button>
          </div>
        )}
      </section>
    </div>
  );
}
```

## 🎨 **Styling**

### **Report Item Card:**

```css
.report-item {
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.5);
  padding: 24px;
  transition: all 0.3s;
}

.report-item:hover {
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.7);
}

/* Top line animation */
.report-item::before {
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

.report-item:hover::before {
  transform: scaleX(1);
}

/* Numbered Badge */
.report-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: black;
  font-family: monospace;
  font-size: 12px;
  color: white;
}

/* Left Border for Reporter Section */
.reporter-section {
  border-left: 2px solid rgba(255, 255, 255, 0.1);
  padding-left: 16px;
}

/* Description Section */
.description-section {
  border-left: 2px solid rgba(255, 255, 255, 0.05);
  padding-left: 16px;
}

/* Timestamps Footer */
.timestamps {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 16px;
  font-family: monospace;
  font-size: 10px;
  color: rgb(82, 82, 91); /* zinc-600 */
}
```

### **Report Count Badge:**

```tsx
<Badge variant="destructive" className="font-mono text-xs">
  <MessageSquare size={12} className="mr-1" />
  {count} BÁO CÁO
</Badge>
```

## 🔄 **User Flow**

### **Viewing Multiple Reports:**

```
1. User views Report List Page
   → Sees video cards with report count badge
   → "5 BÁO CÁO" badge visible

2. User clicks on report card
   → Navigate to /report/:videoId

3. Report Detail Page loads
   → Video player in left sidebar
   → Report count badge: "5 BÁO CÁO"

4. Scroll down to "DANH SÁCH BÁO CÁO (5)"
   → See all 5 reports listed
   → Each report shows:
     - #1, #2, #3... numbering
     - Reporter username
     - Reason badge
     - Description
     - Timestamps

5. Review all reports
   → Decide to Accept or Reject

6. Click action button
   → Modal confirmation
   → Process ALL reports together
```

## 📊 **Key Features**

### **1. Report Count Visibility:**

- ✅ Badge trong list page: `{count} BÁO CÁO`
- ✅ Badge trong detail page sidebar
- ✅ Section header: `DANH SÁCH BÁO CÁO ({count})`

### **2. Multiple Reporter Display:**

- ✅ List page: `john_doe +4 người khác`
- ✅ Detail page: Full list với từng reporter

### **3. Latest Report Indicator:**

- ✅ List page: `Báo cáo mới nhất: {timestamp}`
- ✅ Detail page: Reports được sort theo created_at

### **4. Individual Report Details:**

- ✅ Numbered (#1, #2, #3...)
- ✅ Report ID (truncated)
- ✅ Status badge
- ✅ Reporter info
- ✅ Reason badge
- ✅ Description
- ✅ Timestamps (created & updated)

### **5. Bulk Actions:**

- ✅ Accept: Ẩn video → Ảnh hưởng TẤT CẢ reports
- ✅ Reject: Giữ video → Ảnh hưởng TẤT CẢ reports

## 🛠️ **Technical Notes**

### **Data Fetching:**

```typescript
// List page - Gets videos with aggregated reports
const { data: videos } = useReports(filters);
// videos = Video[] với report_count và reports[]

// Detail page - Gets all reports for specific video
const { data: detail } = useReportDetail(videoId);
// detail = { reports: Report[], video: VideoInfo }
```

### **Sorting Reports:**

```typescript
// Sort by created_at descending (newest first)
const sortedReports = [...report.reports].sort(
  (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
);
```

### **Report Count Logic:**

```typescript
// List page
const reportCount = video.report_count; // From API

// Detail page
const reportCount = report.reports?.length || 0; // Count array
```

## ✅ **Checklist**

- ✅ `ReportItem` component created
- ✅ Report count badge in list cards
- ✅ Multiple reporter display (`+{n} người khác`)
- ✅ Latest report timestamp in list
- ✅ Full reports list in detail page
- ✅ Numbered report items (#1, #2, #3...)
- ✅ Individual report metadata
- ✅ Responsive layout
- ✅ Hover effects
- ✅ Color-coded status badges
- ✅ Carbon Kinetic theme consistency
- ✅ Empty state handling
- ✅ Loading states

## 📚 **Related Files**

- [ReportItem Component](../features/report/components/report-item.tsx)
- [ReportCard Component](../features/report/components/report-card.tsx)
- [Report Detail Page](../features/report/pages/report-detail-page.tsx)
- [Report Types](../features/report/types/index.ts)

## 🎉 **Summary**

Feature hiển thị nhiều reports cho 1 video:

- 📊 **List**: Badge số lượng + text `+{n} người khác`
- 📋 **Detail**: Full list với component `ReportItem` riêng
- 🎨 **UI**: Numbered, color-coded, Carbon Kinetic theme
- 🔄 **Actions**: Bulk accept/reject cho tất cả reports
