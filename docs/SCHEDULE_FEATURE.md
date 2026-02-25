# Schedule Content Feature

Tính năng lên lịch tự động đăng video vào thời gian cụ thể trong tương lai.

## 📦 Đã tạo

### 1. Components

- ✅ `features/content/components/schedule-modal.tsx` - Modal để chọn thời gian lên lịch
- Carbon Kinetic styling
- Date & Time pickers
- Validation thời gian tương lai
- Preview thời gian đã chọn

### 2. Hooks

- ✅ `features/content/hooks/useSchedule.ts` - Hook để handle scheduling logic
- React Query mutation
- Automatic query invalidation
- Error handling

### 3. Services

- ✅ `features/content/services/content-service.ts` - API service
- Endpoint: `POST /reels/dashboard/:id/schedule`
- Payload: `{ scheduled_at: ISO8601 timestamp }`

### 4. Integration

- ✅ `features/content/pages/content-detail-page.tsx` - Thêm button "LÊN LỊCH"
- Toast notifications (loading, success, error)
- Modal state management

## 🎨 UI Components

### Schedule Modal

```tsx
<ScheduleModal
  isOpen={isScheduleModalOpen}
  onClose={() => setIsScheduleModalOpen(false)}
  onConfirm={handleScheduleConfirm}
  item={contentItem}
/>
```

**Features:**

- ✅ Date picker với min date = today
- ✅ Time picker với min time validation
- ✅ Preview format: "Thứ Hai, 27 Tháng 1, 2026, 14:30"
- ✅ Validation: Thời gian phải ở tương lai
- ✅ Content info display (title, ID)
- ✅ Carbon Kinetic styling (dark theme, monospace font)

### Schedule Button

```tsx
<Button
  variant="outline"
  onClick={() => setIsScheduleModalOpen(true)}
  disabled={item.status === ContentStatus.PUBLISHED}
  className="border-white/20 text-white hover:bg-white/10"
>
  LÊN LỊCH
</Button>
```

**States:**

- Enabled: Khi content chưa được publish
- Disabled: Khi content đã PUBLISHED

## 🚀 Usage

### 1. Open Schedule Modal

Click button "LÊN LỊCH" trong detail page:

```tsx
const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

<Button onClick={() => setIsScheduleModalOpen(true)}>LÊN LỊCH</Button>;
```

### 2. Select Date & Time

```tsx
// Date input
<Input
  type="date"
  value={selectedDate}
  onChange={(e) => setSelectedDate(e.target.value)}
  min={minDate}  // Ngày hiện tại
/>

// Time input
<Input
  type="time"
  value={selectedTime}
  onChange={(e) => setSelectedTime(e.target.value)}
  min={minTime}  // Giờ hiện tại (nếu chọn ngày hôm nay)
/>
```

### 3. Confirm Schedule

```tsx
const handleScheduleConfirm = (scheduledTime: string) => {
  const toastId = toast.loading('ĐANG_LÊN_LỊCH...');

  scheduleContentMutation.mutate(
    { contentId: item.content_id, scheduledTime },
    {
      onSuccess: () => {
        toast.success('LÊN_LỊCH_THÀNH_CÔNG', {
          description: `Video sẽ được đăng vào ${new Date(scheduledTime).toLocaleString('vi-VN')}`,
        });
      },
      onError: () => {
        toast.error('LÊN_LỊCH_THẤT_BẠI');
      },
    }
  );
};
```

## 💡 Features

### 1. Date & Time Validation

**Min Date:**

```typescript
const minDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
```

**Min Time (nếu chọn ngày hôm nay):**

```typescript
const minTime = new Date().toTimeString().slice(0, 5); // HH:mm
```

**Future Time Check:**

```typescript
const scheduledDateTime = new Date(`${selectedDate}T${selectedTime}`);
const isValidSchedule = scheduledDateTime > new Date();
```

### 2. Time Preview

Format: Vietnamese locale

```typescript
new Date(`${selectedDate}T${selectedTime}`).toLocaleString('vi-VN', {
  weekday: 'long', // Thứ Hai
  year: 'numeric', // 2026
  month: 'long', // Tháng 1
  day: 'numeric', // 27
  hour: '2-digit', // 14
  minute: '2-digit', // 30
});

// Output: "Thứ Hai, 27 Tháng 1, 2026, 14:30"
```

### 3. Toast Notifications

**Loading:**

```typescript
const toastId = toast.loading('ĐANG_LÊN_LỊCH...');
```

**Success:**

```typescript
toast.success('LÊN_LỊCH_THÀNH_CÔNG', {
  description: 'Video sẽ được đăng vào [datetime]',
  duration: 4000,
});
```

**Error:**

```typescript
toast.error('LÊN_LỊCH_THẤT_BẠI', {
  description: 'Không thể lên lịch. Vui lòng thử lại.',
  duration: 4000,
});
```

## 🔧 API Integration

### Endpoint

```
POST /reels/dashboard/:contentId/schedule
```

### Request Body

```json
{
  "scheduled_at": "2026-01-27T14:30:00.000Z"
}
```

### Response

```json
{
  "success": true,
  "message": "Content scheduled successfully"
}
```

## 📊 Hook Usage

### useScheduleContent

```typescript
import { useScheduleContent } from '@/features/content/hooks/useSchedule';

function MyComponent() {
  const scheduleContentMutation = useScheduleContent();

  const handleSchedule = (contentId: string, scheduledTime: string) => {
    scheduleContentMutation.mutate(
      { contentId, scheduledTime },
      {
        onSuccess: () => {
          // Handle success
        },
        onError: (error) => {
          // Handle error
        },
      }
    );
  };

  return (
    <Button
      onClick={() => handleSchedule('123', '2026-01-27T14:30:00Z')}
      disabled={scheduleContentMutation.isPending}
    >
      {scheduleContentMutation.isPending ? 'Đang lên lịch...' : 'Lên lịch'}
    </Button>
  );
}
```

## 🎯 Carbon Kinetic Styling

### Modal

```css
.modal {
  background: black;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
}
```

### Inputs

```css
.date-input,
.time-input {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-family: monospace;
}
```

### Preview Box

```css
.preview {
  background: rgba(255, 255, 255, 0.05);
  border-left: 2px solid rgba(255, 255, 255, 0.2);
}
```

## 📝 Examples

### Example 1: Basic Schedule

```tsx
function ContentDetailPage() {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const scheduleContentMutation = useScheduleContent();

  const handleScheduleConfirm = (scheduledTime: string) => {
    scheduleContentMutation.mutate(
      { contentId: '123', scheduledTime },
      {
        onSuccess: () => {
          toast.success('LÊN_LỊCH_THÀNH_CÔNG');
          setIsScheduleModalOpen(false);
        },
      }
    );
  };

  return (
    <>
      <Button onClick={() => setIsScheduleModalOpen(true)}>LÊN LỊCH</Button>

      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onConfirm={handleScheduleConfirm}
        item={contentItem}
      />
    </>
  );
}
```

### Example 2: With Status Check

```tsx
<Button
  onClick={() => setIsScheduleModalOpen(true)}
  disabled={item.status === ContentStatus.PUBLISHED || item.status === ContentStatus.SCHEDULED}
>
  {item.status === ContentStatus.SCHEDULED ? 'ĐÃ LÊN LỊCH' : 'LÊN LỊCH'}
</Button>
```

### Example 3: Custom Validation

```tsx
const handleScheduleConfirm = (scheduledTime: string) => {
  const scheduledDate = new Date(scheduledTime);
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30); // Max 30 days

  if (scheduledDate > maxDate) {
    toast.error('Không thể lên lịch quá 30 ngày');
    return;
  }

  scheduleContentMutation.mutate({ contentId, scheduledTime });
};
```

## 🐛 Error Handling

### Common Errors

**1. Invalid Time (Past Time)**

```typescript
if (new Date(scheduledDateTime) <= new Date()) {
  toast.error('Thời gian phải ở tương lai');
  return;
}
```

**2. Network Error**

```typescript
onError: (error) => {
  if (error.message.includes('network')) {
    toast.error('LỖI_MẠNG', {
      description: 'Kiểm tra kết nối internet',
    });
  }
};
```

**3. Server Error**

```typescript
onError: (error: any) => {
  toast.error('LỖI_SERVER', {
    description: error.response?.data?.message || 'Lỗi không xác định',
  });
};
```

## ✨ Future Improvements

- ⏳ Recurring schedules (daily, weekly, monthly)
- ⏳ Bulk scheduling (multiple contents)
- ⏳ Edit/Cancel scheduled content
- ⏳ Scheduled content calendar view
- ⏳ Timezone support
- ⏳ Reminder notifications before publish
- ⏳ Auto-retry on failure

## 📚 Related Files

- [Schedule Modal](../features/content/components/schedule-modal.tsx)
- [useSchedule Hook](../features/content/hooks/useSchedule.ts)
- [Content Service](../features/content/services/content-service.ts)
- [Detail Page](../features/content/pages/content-detail-page.tsx)
