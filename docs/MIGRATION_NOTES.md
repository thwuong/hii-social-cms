# Migration to TanStack Router

## Tổng quan thay đổi

Ứng dụng đã được chuyển đổi từ việc sử dụng state-based tabs (`activeTab`) sang **TanStack Router** để quản lý navigation.

## Cấu trúc mới

### 1. Routes (Thư mục `/routes`)

Mỗi trang giờ đây là một route component riêng biệt:

- **`dashboard.tsx`** - Trang tổng quan (Dashboard)
- **`content.tsx`** - Danh sách tài nguyên với filters
- **`detail.$contentId.tsx`** - Chi tiết nội dung với dynamic parameter
- **`audit.tsx`** - Nhật ký hệ thống
- **`create.tsx`** - Tạo nội dung mới

### 2. Router Configuration (`/router/index.tsx`)

- Định nghĩa `RouterContext` với tất cả state và functions cần thiết
- Tạo `rootRoute` với context
- Export `createAppRouter` function để khởi tạo router với context

### 3. App Component (`App.tsx`)

Đã được đơn giản hóa:

- Quản lý state chính (service, content, user)
- Tạo router context
- Render `RouterProvider` với router instance

### 4. Layout Component (`components/Layout.tsx`)

- Sử dụng `Link` component từ TanStack Router thay vì onClick handlers
- Sử dụng `useRouterState()` để lấy current path và context
- Render `Outlet` để hiển thị child routes

## Lợi ích

✅ **URL-based navigation** - Mỗi trang có URL riêng, có thể bookmark và share
✅ **Browser history** - Nút back/forward hoạt động đúng
✅ **Type-safe routing** - TypeScript hỗ trợ đầy đủ cho params và search
✅ **Better separation of concerns** - Mỗi route là một component độc lập
✅ **Search params** - Có thể truyền filters qua URL (ví dụ: `/content?status=PENDING_REVIEW`)
✅ **Dynamic routes** - Route với params như `/detail/$contentId`

## Cách sử dụng

### Navigation trong code

```tsx
// Sử dụng navigate từ route
const navigate = dashboardRoute.useNavigate();

// Navigate đơn giản
navigate({ to: '/content' });

// Navigate với search params
navigate({
  to: '/content',
  search: { status: 'PENDING_REVIEW' },
});

// Navigate với params
navigate({
  to: '/detail/$contentId',
  params: { contentId: 'some-id' },
});
```

### Lấy data từ context

```tsx
const { items, service, currentUser, refreshData } = routeName.useRouteContext();
```

### Lấy params và search

```tsx
const { contentId } = detailRoute.useParams();
const { status, source } = contentRoute.useSearch();
```

## URLs

- `/` - Redirect về dashboard
- `/dashboard` - Trang tổng quan
- `/content` - Danh sách nội dung
- `/content?status=PENDING_REVIEW` - Lọc theo status
- `/detail/CONT-001` - Chi tiết nội dung
- `/audit` - Nhật ký hệ thống
- `/create` - Tạo nội dung mới

## Breaking Changes

❌ **Removed**: `activeTab` state và `setActiveTab` function
❌ **Removed**: Tab-based rendering logic trong App.tsx
✅ **Added**: Route-based navigation với TanStack Router
✅ **Added**: URL support cho tất cả các trang

## Dev Tools

TanStack Router DevTools được bật mặc định trong development mode. Bạn có thể:

- Xem route tree
- Debug navigation
- Inspect route context
- Monitor route transitions
