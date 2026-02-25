# Toast Notification Guide

Hướng dẫn sử dụng Toast với Carbon Kinetic style.

## 📦 Cài đặt

```bash
# Fix npm permission nếu cần
sudo chown -R 501:20 "/Users/macos/.npm"

# Cài đặt Sonner
npm install sonner
```

## 🎨 Carbon Kinetic Style

Toast được thiết kế với Carbon Kinetic theme:

- **Background**: Đen trong suốt với backdrop blur
- **Border**:
  - Success: `#00ff66` (xanh neon)
  - Error: `#ff3e3e` (đỏ)
  - Warning: `#eab308` (vàng)
  - Info: `rgba(255,255,255,0.2)` (trắng mờ)
- **Font**: Monospace, uppercase
- **Animation**: Slide in/out từ phải

## 🚀 Sử dụng cơ bản

### 1. Setup Toaster (đã setup sẵn trong `_root.tsx`)

```typescript
import { Toaster } from '@/shared/ui';

function RootLayout() {
  return (
    <>
      <YourApp />
      <Toaster />
    </>
  );
}
```

### 2. Import toast utility

```typescript
import { toast } from '@/shared';
```

### 3. Hiển thị toast

```typescript
// Success toast
toast.success('THÀNH_CÔNG', {
  description: 'Thao tác đã được thực hiện',
  duration: 3000,
});

// Error toast
toast.error('LỖI_XẢY_RA', {
  description: 'Không thể hoàn thành thao tác',
  duration: 4000,
});

// Warning toast
toast.warning('CẢNH_BÁO', {
  description: 'Hành động này có thể gây ảnh hưởng',
});

// Info toast
toast.info('THÔNG_TIN', {
  description: 'Dữ liệu đã được cập nhật',
});
```

## 📝 API Reference

### Success Toast

```typescript
toast.success(message: string, options?: ToastOptions)
```

**Options:**

- `description?: string` - Mô tả chi tiết
- `duration?: number` - Thời gian hiển thị (ms), default: 4000
- `action?: { label: string; onClick: () => void }` - Action button

**Example:**

```typescript
toast.success('ĐÃ_LƯU', {
  description: 'Thay đổi đã được lưu thành công',
  duration: 3000,
  action: {
    label: 'XEM',
    onClick: () => navigate('/view'),
  },
});
```

### Error Toast

```typescript
toast.error(message: string, options?: ToastOptions)
```

**Example:**

```typescript
toast.error('KHÔNG_THỂ_KẾT_NỐI', {
  description: 'Không thể kết nối đến server',
  duration: 5000,
  action: {
    label: 'THỬ_LẠI',
    onClick: () => retryConnection(),
  },
});
```

### Warning Toast

```typescript
toast.warning(message: string, options?: ToastOptions)
```

**Example:**

```typescript
toast.warning('DỮ_LIỆU_CHƯA_LƯU', {
  description: 'Bạn có thay đổi chưa được lưu',
  action: {
    label: 'LƯU_NGAY',
    onClick: () => saveData(),
  },
});
```

### Info Toast

```typescript
toast.info(message: string, options?: ToastOptions)
```

### Loading Toast

```typescript
const toastId = toast.loading('ĐANG_XỬ_LÝ...', {
  description: 'Vui lòng đợi',
});

// Sau khi xong, dismiss
toast.dismiss(toastId);
```

### Promise Toast

Tự động xử lý loading/success/error states:

```typescript
toast.promise(apiCall(), {
  loading: 'ĐANG_TẢI...',
  success: 'HOÀN_THÀNH',
  error: 'THẤT_BẠI',
});

// Hoặc với dynamic messages
toast.promise(fetchUser(userId), {
  loading: 'ĐANG_TẢI_NGƯỜI_DÙNG...',
  success: (data) => `ĐÃ_TẢI_${data.name}`,
  error: (err) => `LỖI_${err.message}`,
});
```

### Dismiss Toast

```typescript
// Dismiss specific toast
const toastId = toast.success('MESSAGE');
toast.dismiss(toastId);

// Dismiss all toasts
toast.dismiss();
```

## 💡 Examples

### 1. Form Submission

```typescript
const onSubmit = async (data: FormData) => {
  try {
    await submitForm(data);
    toast.success('GỬI_THÀNH_CÔNG', {
      description: 'Dữ liệu đã được lưu',
    });
  } catch (error) {
    toast.error('GỬI_THẤT_BẠI', {
      description: error.message,
    });
  }
};
```

### 2. Login Flow

```typescript
const handleLogin = async (credentials) => {
  const loadingToast = toast.loading('ĐANG_XÁC_THỰC...');

  try {
    const user = await login(credentials);
    toast.dismiss(loadingToast);
    toast.success('ĐĂNG_NHẬP_THÀNH_CÔNG', {
      description: `Chào mừng ${user.name}`,
    });
    navigate('/dashboard');
  } catch (error) {
    toast.dismiss(loadingToast);
    toast.error('ĐĂNG_NHẬP_THẤT_BẠI', {
      description: 'Email hoặc mật khẩu không đúng',
    });
  }
};
```

### 3. Delete Confirmation

```typescript
const handleDelete = async (id: string) => {
  toast.warning('XÁC_NHẬN_XÓA', {
    description: 'Hành động này không thể hoàn tác',
    action: {
      label: 'XÓA',
      onClick: async () => {
        try {
          await deleteItem(id);
          toast.success('ĐÃ_XÓA', {
            description: 'Mục đã được xóa thành công',
          });
        } catch (error) {
          toast.error('XÓA_THẤT_BẠI', {
            description: 'Không thể xóa mục này',
          });
        }
      },
    },
  });
};
```

### 4. File Upload

```typescript
const uploadFile = async (file: File) => {
  toast.promise(uploadToServer(file), {
    loading: 'ĐANG_TẢI_LÊN...',
    success: (data) => {
      return `TẢI_LÊN_THÀNH_CÔNG // ${data.filename}`;
    },
    error: 'TẢI_LÊN_THẤT_BẠI',
  });
};
```

### 5. Network Status

```typescript
window.addEventListener('online', () => {
  toast.success('KẾT_NỐI_KHÔI_PHỤC', {
    description: 'Đã kết nối lại với internet',
  });
});

window.addEventListener('offline', () => {
  toast.warning('MẤT_KẾT_NỐI', {
    description: 'Không có kết nối internet',
  });
});
```

### 6. Copy to Clipboard

```typescript
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success('ĐÃ_SAO_CHÉP', {
      description: 'Nội dung đã được sao chép',
      duration: 2000,
    });
  } catch (error) {
    toast.error('SAO_CHÉP_THẤT_BẠI', {
      description: 'Không thể sao chép nội dung',
    });
  }
};
```

## 🎯 Best Practices

### 1. Message Format

- **Title**: VIẾT_HOA, dùng underscore thay space
- **Description**: Viết thường, mô tả ngắn gọn

```typescript
// ✅ Good
toast.success('TẢI_LÊN_THÀNH_CÔNG', {
  description: 'File đã được tải lên server',
});

// ❌ Bad
toast.success('Tải lên thành công', {
  description: 'FILE ĐÃ ĐƯỢC TẢI LÊN SERVER',
});
```

### 2. Duration

- Success: 3000ms (3s)
- Error: 4000-5000ms (4-5s)
- Warning: 4000ms (4s)
- Info: 3000-4000ms (3-4s)

### 3. Action Buttons

Chỉ dùng khi thực sự cần user interaction:

```typescript
// ✅ Good - có action hữu ích
toast.error('KHÔNG_TÌM_THẤY', {
  description: 'Trang không tồn tại',
  action: {
    label: 'VỀ_TRANG_CHỦ',
    onClick: () => navigate('/'),
  },
});

// ❌ Bad - action không cần thiết
toast.success('ĐÃ_LƯU', {
  action: {
    label: 'OK',
    onClick: () => {},
  },
});
```

### 4. Error Handling

Luôn catch errors và hiển thị toast:

```typescript
try {
  await riskyOperation();
  toast.success('THÀNH_CÔNG');
} catch (error) {
  toast.error('THẤT_BẠI', {
    description: error instanceof Error ? error.message : 'Lỗi không xác định',
  });
}
```

## 🎨 Customization

### Custom Toast

```typescript
toast.custom('MESSAGE_TÙY_CHỈNH', {
  description: 'Với style riêng',
  duration: 3000,
});
```

### Multiple Toasts

```typescript
// Sonner tự động stack và manage multiple toasts
toast.success('MESSAGE_1');
toast.info('MESSAGE_2');
toast.warning('MESSAGE_3');
```

## 🔧 Files Created

- `shared/ui/toaster.tsx` - Toaster component
- `shared/utils/toast.ts` - Toast utilities
- `styles/global.css` - Toast custom CSS

## 📚 Reference

- [Sonner Documentation](https://sonner.emilkowal.ski/)
- Carbon Kinetic Design System
