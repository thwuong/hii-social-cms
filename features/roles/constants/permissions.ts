// Available permissions in the system
export const PERMISSIONS = {
  // Content permissions
  CONTENT_VIEW: 'content:view',
  CONTENT_CREATE: 'content:create',
  CONTENT_EDIT: 'content:edit',
  CONTENT_DELETE: 'content:delete',
  CONTENT_APPROVE: 'content:approve',
  CONTENT_REJECT: 'content:reject',
  CONTENT_PUBLISH: 'content:publish',
  CONTENT_SCHEDULE: 'content:schedule',

  // Role permissions
  ROLE_VIEW: 'role:view',
  ROLE_CREATE: 'role:create',
  ROLE_EDIT: 'role:edit',
  ROLE_DELETE: 'role:delete',
  ROLE_ASSIGN: 'role:assign',

  // User permissions
  USER_VIEW: 'user:view',
  USER_CREATE: 'user:create',
  USER_EDIT: 'user:edit',
  USER_DELETE: 'user:delete',

  // Report permissions
  REPORT_VIEW: 'report:view',
  REPORT_HANDLE: 'report:handle',

  // Audit permissions
  AUDIT_VIEW: 'audit:view',

  // Dashboard permissions
  DASHBOARD_VIEW: 'dashboard:view',
  DASHBOARD_ANALYTICS: 'dashboard:analytics',
} as const;

export type PermissionSlug = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// Permission groups for UI display
export const PERMISSION_GROUPS = [
  {
    label: 'Quản lý nội dung',
    permissions: [
      { value: PERMISSIONS.CONTENT_VIEW, label: 'Xem nội dung' },
      { value: PERMISSIONS.CONTENT_CREATE, label: 'Tạo nội dung' },
      { value: PERMISSIONS.CONTENT_EDIT, label: 'Chỉnh sửa nội dung' },
      { value: PERMISSIONS.CONTENT_DELETE, label: 'Xóa nội dung' },
      { value: PERMISSIONS.CONTENT_APPROVE, label: 'Duyệt nội dung' },
      { value: PERMISSIONS.CONTENT_REJECT, label: 'Từ chối nội dung' },
      { value: PERMISSIONS.CONTENT_PUBLISH, label: 'Xuất bản nội dung' },
      { value: PERMISSIONS.CONTENT_SCHEDULE, label: 'Lên lịch nội dung' },
    ],
  },
  {
    label: 'Quản lý vai trò',
    permissions: [
      { value: PERMISSIONS.ROLE_VIEW, label: 'Xem vai trò' },
      { value: PERMISSIONS.ROLE_CREATE, label: 'Tạo vai trò' },
      { value: PERMISSIONS.ROLE_EDIT, label: 'Chỉnh sửa vai trò' },
      { value: PERMISSIONS.ROLE_DELETE, label: 'Xóa vai trò' },
      { value: PERMISSIONS.ROLE_ASSIGN, label: 'Gán vai trò' },
    ],
  },
  {
    label: 'Quản lý người dùng',
    permissions: [
      { value: PERMISSIONS.USER_VIEW, label: 'Xem người dùng' },
      { value: PERMISSIONS.USER_CREATE, label: 'Tạo người dùng' },
      { value: PERMISSIONS.USER_EDIT, label: 'Chỉnh sửa người dùng' },
      { value: PERMISSIONS.USER_DELETE, label: 'Xóa người dùng' },
    ],
  },
  {
    label: 'Quản lý báo cáo',
    permissions: [
      { value: PERMISSIONS.REPORT_VIEW, label: 'Xem báo cáo' },
      { value: PERMISSIONS.REPORT_HANDLE, label: 'Xử lý báo cáo' },
    ],
  },
  {
    label: 'Quản lý kiểm toán',
    permissions: [{ value: PERMISSIONS.AUDIT_VIEW, label: 'Xem lịch sử kiểm toán' }],
  },
  {
    label: 'Dashboard',
    permissions: [
      { value: PERMISSIONS.DASHBOARD_VIEW, label: 'Xem dashboard' },
      { value: PERMISSIONS.DASHBOARD_ANALYTICS, label: 'Xem phân tích' },
    ],
  },
];
