# Roles Feature - Quản lý Vai trò

## Tổng quan

Feature quản lý vai trò (Roles) được xây dựng dựa trên API từ Swagger documentation tại `https://be-messages.blocktrend.xyz/swagger/index.html#/Dashboard%20-%20Roles`.

## Cấu trúc thư mục

```
features/roles/
├── components/           # UI Components
│   ├── assign-roles-modal.tsx
│   ├── delete-role-modal.tsx
│   ├── role-form-modal.tsx
│   ├── user-roles-card.tsx
│   └── index.ts
├── constants/           # Constants và permissions
│   ├── permissions.ts
│   └── index.ts
├── hooks/              # React Query hooks
│   ├── use-roles.ts
│   └── index.ts
├── pages/              # Page components
│   ├── roles-page.tsx
│   └── index.ts
├── query-keys/         # React Query keys
│   ├── role-keys.ts
│   └── index.ts
├── schemas/            # Zod validation schemas
│   ├── role.schema.ts
│   └── index.ts
├── services/           # API service layer
│   ├── role-service.ts
│   └── index.ts
├── types/              # TypeScript types & DTOs
│   ├── role.types.ts
│   └── index.ts
└── index.ts            # Main export file
```

## API Endpoints

### Role Management

- **GET `/system/roles`** - Lấy danh sách roles (cursor-based pagination)
- **POST `/system/roles`** - Tạo role mới
- **PUT `/system/roles/{id}`** - Cập nhật role
- **DELETE `/system/roles/{id}`** - Xóa role

### User Role Assignment

- **GET `/system/users/{id}/roles`** - Lấy roles của user
- **POST `/system/users/{id}/roles`** - Gán roles cho user
- **DELETE `/system/users/{id}/roles/{role_id}`** - Thu hồi role từ user

## Types & DTOs

### Role Entity

```typescript
interface Role {
  id: string;
  name: string;
  slug: string;
  description: string;
  permissions: string[];
  created_at: string;
  updated_at: string;
}
```

### API Payloads

- `CreateRolePayload` - Tạo role mới
- `UpdateRolePayload` - Cập nhật role
- `AssignRolesToUserPayload` - Gán roles cho user
- `GetRolesParams` - Query params cho pagination

## Services

### RoleService

Class service cung cấp các methods để tương tác với API:

- `getRoles(params?)` - Lấy danh sách roles
- `createRole(payload)` - Tạo role mới
- `updateRole(id, payload)` - Cập nhật role
- `deleteRole(id)` - Xóa role
- `getUserRoles(userId)` - Lấy roles của user
- `assignRolesToUser(userId, payload)` - Gán roles
- `revokeRoleFromUser(userId, roleId)` - Thu hồi role

## React Query Hooks

### Queries

- `useGetRoles(params?)` - Fetch danh sách roles
- `useGetUserRoles(userId)` - Fetch roles của user

### Mutations

- `useCreateRole()` - Tạo role mới
- `useUpdateRole()` - Cập nhật role
- `useDeleteRole()` - Xóa role
- `useAssignRolesToUser()` - Gán roles cho user
- `useRevokeRoleFromUser()` - Thu hồi role từ user

Tất cả mutations đều có:

- Automatic cache invalidation
- Toast notifications (Vietnamese)
- Loading states

## Validation Schemas

Sử dụng Zod để validate forms:

- `createRoleSchema` - Validate khi tạo role
- `updateRoleSchema` - Validate khi cập nhật role
- `assignRolesSchema` - Validate khi gán roles

## Permissions

### Permission Groups

Permissions được tổ chức thành các nhóm:

1. **Quản lý nội dung** - Content management
2. **Quản lý vai trò** - Role management
3. **Quản lý người dùng** - User management
4. **Quản lý báo cáo** - Report management
5. **Quản lý kiểm toán** - Audit management
6. **Dashboard** - Dashboard access

### Available Permissions

```typescript
PERMISSIONS = {
  CONTENT_VIEW,
  CONTENT_CREATE,
  CONTENT_EDIT,
  CONTENT_DELETE,
  CONTENT_APPROVE,
  CONTENT_REJECT,
  CONTENT_PUBLISH,
  CONTENT_SCHEDULE,
  ROLE_VIEW,
  ROLE_CREATE,
  ROLE_EDIT,
  ROLE_DELETE,
  ROLE_ASSIGN,
  USER_VIEW,
  USER_CREATE,
  USER_EDIT,
  USER_DELETE,
  REPORT_VIEW,
  REPORT_HANDLE,
  AUDIT_VIEW,
  DASHBOARD_VIEW,
  DASHBOARD_ANALYTICS,
};
```

## Components

### RolesPage

Trang chính hiển thị danh sách roles với:

- Table view với pagination
- Create/Edit/Delete actions
- Search và filter (có thể mở rộng)

### RoleFormModal

Modal form để tạo/chỉnh sửa role:

- Form validation với react-hook-form + Zod
- Permission selection với group checkboxes
- Indeterminate checkboxes cho groups

### DeleteRoleModal

Modal xác nhận xóa role với loading state

### UserRolesCard

Card component hiển thị roles của user:

- Danh sách roles hiện tại
- Revoke role functionality
- Assign new roles button

### AssignRolesModal

Modal để gán roles cho user:

- Multi-select roles
- Filter out already assigned roles
- Display role details và permissions

## Usage Example

### Sử dụng trong page

```typescript
import { RolesPage } from '@/features/roles';

function RolesManagementPage() {
  return <RolesPage />;
}
```

### Sử dụng UserRolesCard trong user detail page

```typescript
import { UserRolesCard } from '@/features/roles';

function UserDetailPage({ userId }: { userId: string }) {
  return (
    <div>
      {/* Other user info */}
      <UserRolesCard userId={userId} />
    </div>
  );
}
```

## Styling

Components sử dụng:

- **shadcn/ui** - UI component library
- **Tailwind CSS** - Utility-first CSS
- **Lucide React** - Icons

## Features

✅ CRUD operations cho roles
✅ Cursor-based pagination
✅ User role assignment/revocation
✅ Permission management với groups
✅ Form validation
✅ Loading states
✅ Error handling
✅ Toast notifications (Vietnamese)
✅ TypeScript type safety
✅ React Query caching & invalidation

## Next Steps

Để tích hợp feature này vào ứng dụng:

1. **Thêm route** trong router configuration:

```typescript
{
  path: '/roles',
  component: RolesPage,
}
```

2. **Thêm navigation link** trong sidebar/menu

3. **Kiểm tra permissions** - Đảm bảo user có quyền truy cập

4. **Test API integration** - Verify API endpoints hoạt động đúng

5. **Customize permissions** - Cập nhật danh sách permissions theo nhu cầu thực tế của hệ thống
