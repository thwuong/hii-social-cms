# Toast Notification Setup ✅

Toast notification đã được setup hoàn chỉnh với Carbon Kinetic style!

## 📦 Cài đặt

Chạy lệnh sau để cài đặt dependencies:

```bash
# Fix npm permission
sudo chown -R 501:20 "/Users/macos/.npm"

# Cài đặt Sonner
npm install sonner
```

## ✅ Đã hoàn thành

### 1. Components

- ✅ `shared/ui/toaster.tsx` - Toaster component với Carbon Kinetic style
- ✅ `shared/utils/toast.ts` - Toast utility functions
- ✅ `shared/utils/index.ts` - Utils barrel export

### 2. Styling

- ✅ `styles/global.css` - Custom CSS cho toast:
  - Background đen trong suốt với backdrop blur
  - Border colors: Success (#00ff66), Error (#ff3e3e), Warning (#eab308)
  - Monospace font, uppercase text
  - Smooth slide animations

### 3. Integration

- ✅ `app/routes/_root.tsx` - Toaster đã được thêm vào root layout
- ✅ `features/auth/pages/login-page.tsx` - Toast trong login flow
- ✅ `features/auth/pages/register-page.tsx` - Toast trong register flow

### 4. Documentation

- ✅ `docs/TOAST_GUIDE.md` - Hướng dẫn chi tiết
- ✅ `shared/examples/toast-demo.tsx` - Demo component

## 🎨 Carbon Kinetic Style

### Success Toast

```typescript
toast.success('ĐĂNG_NHẬP_THÀNH_CÔNG', {
  description: 'Chào mừng quay trở lại hệ thống',
  duration: 3000,
});
```

- Border: `#00ff66` (xanh neon)
- Icon: CheckCircle2

### Error Toast

```typescript
toast.error('ĐĂNG_NHẬP_THẤT_BẠI', {
  description: 'Email hoặc mật khẩu không đúng',
  duration: 4000,
});
```

- Border: `#ff3e3e` (đỏ)
- Icon: AlertCircle

### Warning Toast

```typescript
toast.warning('DỮ_LIỆU_CHƯA_LƯU', {
  description: 'Bạn có thay đổi chưa được lưu',
});
```

- Border: `#eab308` (vàng)
- Icon: AlertTriangle

### Info Toast

```typescript
toast.info('THÔNG_TIN', {
  description: 'Dữ liệu đã được cập nhật',
});
```

- Border: `rgba(255,255,255,0.2)` (trắng mờ)
- Icon: Info

## 🚀 Sử dụng

### Import

```typescript
import { toast } from '@/shared';
```

### Basic Usage

```typescript
// Success
toast.success('THÀNH_CÔNG', {
  description: 'Thao tác đã hoàn thành',
});

// Error
toast.error('LỖI', {
  description: 'Có lỗi xảy ra',
});

// Warning
toast.warning('CẢNH_BÁO', {
  description: 'Hãy cẩn thận',
});

// Info
toast.info('THÔNG_TIN', {
  description: 'Đây là thông tin',
});
```

### With Action Button

```typescript
toast.error('XÓA_THẤT_BẠI', {
  description: 'Không thể xóa mục này',
  action: {
    label: 'THỬ_LẠI',
    onClick: () => retryDelete(),
  },
});
```

### Promise Toast

```typescript
toast.promise(saveData(), {
  loading: 'ĐANG_LƯU...',
  success: 'ĐÃ_LƯU',
  error: 'LƯU_THẤT_BẠI',
});
```

## 📝 Examples trong Code

### Login Page

```typescript
// features/auth/pages/login-page.tsx
const onSubmit = async (data: LoginFormData) => {
  try {
    await loginMutation.mutate(data);
    toast.success('ĐĂNG_NHẬP_THÀNH_CÔNG', {
      description: 'Chào mừng quay trở lại hệ thống',
    });
    navigate({ to: '/dashboard' });
  } catch (error) {
    toast.error('ĐĂNG_NHẬP_THẤT_BẠI', {
      description: 'Email hoặc mật khẩu không đúng',
    });
  }
};
```

### Register Page

```typescript
// features/auth/pages/register-page.tsx
const onSubmit = async (data: RegisterFormData) => {
  try {
    await registerUser(data);
    toast.success('TÀI_KHOẢN_ĐÃ_TẠO', {
      description: `Chào mừng ${data.name} đến với hệ thống`,
    });
    navigate({ to: '/dashboard' });
  } catch (error) {
    toast.error('ĐĂNG_KÝ_THẤT_BẠI', {
      description: 'Không thể tạo tài khoản. Vui lòng thử lại.',
    });
  }
};
```

## 🧪 Testing Toast

Sử dụng Toast Demo component để test:

```typescript
import { ToastDemo } from '@/shared/examples/toast-demo';

// Tạm thời thêm vào một page
function TestPage() {
  return <ToastDemo />;
}
```

## 🎯 Features

- ✅ **4 loại toast**: Success, Error, Warning, Info
- ✅ **Loading state**: Toast loading với auto-dismiss
- ✅ **Promise handling**: Tự động handle loading/success/error
- ✅ **Action buttons**: Thêm action buttons vào toast
- ✅ **Custom duration**: Tùy chỉnh thời gian hiển thị
- ✅ **Stack management**: Auto stack multiple toasts
- ✅ **Animations**: Smooth slide in/out animations
- ✅ **Close button**: Có thể đóng thủ công
- ✅ **Responsive**: Hoạt động tốt trên mobile
- ✅ **Accessible**: Screen reader friendly

## 📱 Position

Toast hiển thị ở **top-right** của màn hình (có thể thay đổi trong `toaster.tsx`):

```typescript
<Toaster
  position="top-right"  // top-left, top-center, bottom-left, etc.
  ...
/>
```

## 🎨 Customization

### Change Position

```typescript
// shared/ui/toaster.tsx
<Toaster
  position="bottom-right"  // Đổi vị trí
  ...
/>
```

### Change Default Duration

```typescript
// shared/utils/toast.ts
success: (message, options) => {
  return sonnerToast.success(message, {
    duration: options?.duration || 5000,  // Đổi duration mặc định
    ...
  });
}
```

### Custom Styling

Chỉnh sửa CSS trong `styles/global.css`:

```css
[data-sonner-toast] {
  /* Thay đổi style ở đây */
}
```

## 📚 Documentation

Chi tiết đầy đủ: `docs/TOAST_GUIDE.md`

## 🔥 Next Steps

1. ✅ Cài đặt `sonner`: `npm install sonner`
2. ✅ Test toast trong login/register
3. ⏳ Thêm toast vào các operations khác:
   - Content create/edit/delete
   - File upload
   - Form submissions
   - Network errors
   - Copy to clipboard
   - etc.

## 🐛 Troubleshooting

### Toast không hiển thị

- Kiểm tra đã cài `sonner`: `npm list sonner`
- Kiểm tra `<Toaster />` đã được thêm vào root layout
- Check console cho errors

### Style không đúng

- Kiểm tra CSS trong `styles/global.css` đã được apply
- Clear cache và restart dev server

### TypeScript errors

- Run `npm install` để update types
- Restart TypeScript server

## ✨ Enjoy!

Toast notification đã sẵn sàng sử dụng với Carbon Kinetic style! 🎉
