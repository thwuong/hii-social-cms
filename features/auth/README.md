# Auth Feature

Module xác thực người dùng với React Hook Form + Zod validation.

## 📦 Cài đặt Dependencies

```bash
npm install react-hook-form zod @hookform/resolvers
```

## 🔑 Tính năng

- ✅ Đăng nhập (Login)
- ✅ Đăng ký (Register)
- ✅ Form validation với Zod schema
- ✅ Password strength indicator
- ✅ Persistent authentication với Zustand
- ✅ Carbon Kinetic UI theme

## 🛠️ Cấu trúc

```
features/auth/
├── pages/
│   ├── login-page.tsx       # Trang đăng nhập
│   └── register-page.tsx    # Trang đăng ký
├── schemas/
│   └── auth.schema.ts       # Zod validation schemas
├── stores/
│   └── useAuthStore.ts      # Zustand auth store
├── types/
│   └── index.ts             # TypeScript types
└── index.ts                 # Barrel exports
```

## 📝 Validation Rules

### Login Schema

- **Email**: Bắt buộc, format email hợp lệ
- **Password**: Bắt buộc, tối thiểu 6 ký tự

### Register Schema

- **Name**: 2-50 ký tự
- **Email**: Format email hợp lệ
- **Password**:
  - Tối thiểu 6 ký tự
  - Ít nhất 1 chữ hoa
  - Ít nhất 1 chữ thường
  - Ít nhất 1 số
- **Confirm Password**: Phải khớp với password

## 🚀 Sử dụng

### Navigation

```typescript
// Điều hướng đến trang đăng nhập
navigate({ to: '/login' });

// Điều hướng đến trang đăng ký
navigate({ to: '/register' });
```

### Auth Store

```typescript
import { useAuthStore } from '@/features/auth';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuthStore();

  // Đăng nhập
  login(
    { id: '1', name: 'John', email: 'john@example.com', role: 'ADMIN' },
    'token-123'
  );

  // Đăng xuất
  logout();

  return <div>{user?.name}</div>;
}
```

## 🎨 UI Components

### Login Page

- Email input với icon
- Password input
- Submit button với loading state
- Link đến trang register
- Error handling

### Register Page

- Name, email, password fields
- Password strength indicator (real-time)
- Confirm password field
- Submit button với loading state
- Link đến trang login

## 🔧 TODO

- [ ] Tích hợp API backend
- [ ] Forgot password flow
- [ ] Email verification
- [ ] Social login (Google, Facebook)
- [ ] Two-factor authentication (2FA)
- [ ] Protected routes middleware

## 💡 Examples

### Custom Submit Handler

```typescript
const onSubmit = async (data: LoginFormData) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    login(result.user, result.token);
    navigate({ to: '/dashboard' });
  } catch (error) {
    setServerError('Đăng nhập thất bại');
  }
};
```

### Protected Route

```typescript
export const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({ to: '/login' });
    }
  },
});
```
