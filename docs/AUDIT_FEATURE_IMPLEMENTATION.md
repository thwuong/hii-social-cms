# 🔍 Audit Feature - Implementation Plan

> **Phiên bản:** 1.0.0  
> **Ngày tạo:** 2026-02-03  
> **Mục đích:** Hướng dẫn triển khai đầy đủ tính năng Audit Log cho Hii Social CMS

---

## 📋 Mục Lục

1. [Tổng Quan](#-tổng-quan)
2. [Phân Tích Hiện Trạng](#-phân-tích-hiện-trạng)
3. [Yêu Cầu Chức Năng](#-yêu-cầu-chức-năng)
4. [Kiến Trúc Feature](#-kiến-trúc-feature)
5. [Cấu Trúc Thư Mục](#-cấu-trúc-thư-mục)
6. [Implementation Steps](#-implementation-steps)
7. [API Endpoints](#-api-endpoints)
8. [UI/UX Design](#-uiux-design)
9. [Testing Checklist](#-testing-checklist)
10. [Best Practices](#-best-practices)

---

## 🎯 Tổng Quan

### Mục đích

Audit Feature là một module quan trọng để theo dõi và ghi lại tất cả các hoạt động quan trọng trong hệ thống CMS, bao gồm:

- Thao tác của người dùng (CRUD operations)
- Thay đổi trạng thái nội dung
- Hành động quản trị (approve, reject, delete)
- Đăng nhập/đăng xuất
- Thay đổi cấu hình hệ thống

### Lợi ích

- ✅ **Truy vết**: Theo dõi ai đã làm gì, khi nào
- ✅ **Bảo mật**: Phát hiện hành vi bất thường
- ✅ **Tuân thủ**: Đáp ứng yêu cầu audit compliance
- ✅ **Debug**: Hỗ trợ troubleshooting
- ✅ **Phân tích**: Insights về user behavior

---

## 📊 Phân Tích Hiện Trạng

### ✅ Đã Có

```
features/audit/
├── index.ts                    # Export module
└── pages/
    └── audit-page.tsx          # Basic page với header only
```

### ❌ Thiếu

- **Types & Interfaces**: Chưa định nghĩa data models
- **Services**: Chưa có API integration
- **Components**: Chưa có UI components (table, filters, cards)
- **Hooks**: Chưa có custom hooks cho data fetching
- **Query Keys**: Chưa có React Query setup
- **Schemas**: Chưa có validation schemas
- **Utils**: Chưa có helper functions
- **Constants**: Chưa có constants cho status, actions, etc.

---

## 🎯 Yêu Cầu Chức Năng

### Core Features

#### 1. **Danh Sách Audit Logs**

- [ ] Hiển thị danh sách logs dạng table/cards
- [ ] Infinite scroll hoặc pagination
- [ ] Real-time updates (optional)
- [ ] Export logs (CSV/JSON)

#### 2. **Filtering & Search**

- [ ] Filter theo:
  - Action type (CREATE, UPDATE, DELETE, LOGIN, etc.)
  - User/Actor
  - Resource type (Content, User, Report, etc.)
  - Date range
  - Status (Success/Failed)
- [ ] Search theo keywords
- [ ] Advanced filters (multiple conditions)

#### 3. **Detail View**

- [ ] Xem chi tiết một audit log
- [ ] Hiển thị:
  - Thông tin user
  - Action performed
  - Resource affected
  - Changes (before/after)
  - Timestamp
  - IP address
  - User agent
  - Metadata

#### 4. **Analytics Dashboard** (Optional)

- [ ] Biểu đồ hoạt động theo thời gian
- [ ] Top actions
- [ ] Most active users
- [ ] Failed operations

---

## 🏗 Kiến Trúc Feature

### Feature Module Pattern

Tuân theo pattern của `features/content` và `features/report`:

```
features/audit/
├── components/          # UI Components
├── constants/           # Constants & Enums
├── hooks/              # Custom Hooks
├── pages/              # Page Components
├── query-keys/         # React Query Keys
├── schemas/            # Zod Validation
├── services/           # API Services
├── stores/             # Zustand Stores (if needed)
├── types/              # TypeScript Types
├── utils/              # Utility Functions
└── index.ts            # Public Exports
```

---

## 📁 Cấu Trúc Thư Mục Chi Tiết

### 1. Types (`types/`)

```typescript
// types/audit-log.types.ts
export enum AuditAction {
  // Content Actions
  CONTENT_CREATE = 'CONTENT_CREATE',
  CONTENT_UPDATE = 'CONTENT_UPDATE',
  CONTENT_DELETE = 'CONTENT_DELETE',
  CONTENT_APPROVE = 'CONTENT_APPROVE',
  CONTENT_REJECT = 'CONTENT_REJECT',
  CONTENT_PUBLISH = 'CONTENT_PUBLISH',
  CONTENT_ARCHIVE = 'CONTENT_ARCHIVE',

  // Report Actions
  REPORT_CREATE = 'REPORT_CREATE',
  REPORT_RESOLVE = 'REPORT_RESOLVE',
  REPORT_REJECT = 'REPORT_REJECT',

  // User Actions
  USER_LOGIN = 'USER_LOGIN',
  USER_LOGOUT = 'USER_LOGOUT',
  USER_CREATE = 'USER_CREATE',
  USER_UPDATE = 'USER_UPDATE',
  USER_DELETE = 'USER_DELETE',

  // System Actions
  SYSTEM_CONFIG_UPDATE = 'SYSTEM_CONFIG_UPDATE',
}

export enum ResourceType {
  CONTENT = 'CONTENT',
  REPORT = 'REPORT',
  USER = 'USER',
  PLAYLIST = 'PLAYLIST',
  SYSTEM = 'SYSTEM',
}

export enum AuditStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
}

export interface AuditLog {
  id: string;
  action: AuditAction;
  resource_type: ResourceType;
  resource_id: string;
  actor_id: string;
  actor_name: string;
  actor_email: string;
  status: AuditStatus;
  ip_address: string;
  user_agent: string;
  metadata: Record<string, any>;
  changes?: {
    before: Record<string, any>;
    after: Record<string, any>;
  };
  created_at: string;
  error_message?: string;
}

export interface GetAuditLogsPayload {
  limit?: number;
  cursor?: string;
  action?: AuditAction;
  resource_type?: ResourceType;
  actor_id?: string;
  status?: AuditStatus;
  from_date?: string;
  to_date?: string;
  search?: string;
}

export interface GetAuditLogsResponse {
  has_next: boolean;
  next_cursor: string;
  number_of_items: number;
  total: number;
  logs: AuditLog[];
}

export interface AuditLogDetail extends AuditLog {
  resource_details?: Record<string, any>;
  actor_details?: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
}
```

```typescript
// types/index.ts
export * from './audit-log.types';
```

### 2. Services (`services/`)

```typescript
// services/audit-service.ts
import { api } from '@/services';
import queryString from 'query-string';
import type { GetAuditLogsPayload, GetAuditLogsResponse, AuditLogDetail } from '../types';

export const auditService = {
  // Get audit logs with filters
  getAuditLogs: async (payload: GetAuditLogsPayload): Promise<GetAuditLogsResponse> => {
    const searchParams = queryString.stringify(payload);
    const response = await api.get<GetAuditLogsResponse>(`logs?${searchParams}`);
    return response;
  },

  // Get audit log detail
  getAuditLogDetail: async (logId: string): Promise<AuditLogDetail> => {
    const response = await api.get<AuditLogDetail>(`logs/${logId}`);
    return response;
  },

  // Export audit logs
  exportAuditLogs: async (
    payload: GetAuditLogsPayload,
    format: 'csv' | 'json' = 'csv'
  ): Promise<Blob> => {
    const searchParams = queryString.stringify({ ...payload, format });
    const response = await api.get(`logs/export?${searchParams}`, {
      responseType: 'blob',
    });
    return response;
  },
};
```

### 3. Query Keys (`query-keys/`)

```typescript
// query-keys/auditKeys.ts
import type { GetAuditLogsPayload } from '../types';

export const auditKeys = {
  all: ['audit'] as const,
  lists: () => [...auditKeys.all, 'list'] as const,
  list: (filters: GetAuditLogsPayload) => [...auditKeys.lists(), filters] as const,
  details: () => [...auditKeys.all, 'detail'] as const,
  detail: (id: string) => [...auditKeys.details(), id] as const,
};
```

### 4. Hooks (`hooks/`)

```typescript
// hooks/useAuditLogs.ts
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import { auditKeys } from '../query-keys/auditKeys';
import { auditService } from '../services/audit-service';
import type { GetAuditLogsPayload } from '../types';

export const useAuditLogs = () => {
  const filters: GetAuditLogsPayload = useSearch({ strict: false });

  return useInfiniteQuery({
    queryKey: auditKeys.list(filters),
    queryFn: ({ pageParam }) =>
      auditService.getAuditLogs({
        ...filters,
        cursor: pageParam,
        limit: filters.limit || 20,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => (lastPage.has_next ? lastPage.next_cursor : undefined),
    select: (data) => data.pages.flatMap((page) => page.logs),
  });
};

export const useAuditLogDetail = (logId: string) => {
  return useQuery({
    queryKey: auditKeys.detail(logId),
    queryFn: () => auditService.getAuditLogDetail(logId),
    enabled: !!logId,
  });
};
```

### 5. Constants (`constants/`)

```typescript
// constants/index.ts
import { AuditAction, AuditStatus, ResourceType } from '../types';

export const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  [AuditAction.CONTENT_CREATE]: 'Tạo Nội Dung',
  [AuditAction.CONTENT_UPDATE]: 'Cập Nhật Nội Dung',
  [AuditAction.CONTENT_DELETE]: 'Xóa Nội Dung',
  [AuditAction.CONTENT_APPROVE]: 'Duyệt Nội Dung',
  [AuditAction.CONTENT_REJECT]: 'Từ Chối Nội Dung',
  [AuditAction.CONTENT_PUBLISH]: 'Đăng Nội Dung',
  [AuditAction.CONTENT_ARCHIVE]: 'Lưu Trữ Nội Dung',
  [AuditAction.REPORT_CREATE]: 'Tạo Báo Cáo',
  [AuditAction.REPORT_RESOLVE]: 'Giải Quyết Báo Cáo',
  [AuditAction.REPORT_REJECT]: 'Từ Chối Báo Cáo',
  [AuditAction.USER_LOGIN]: 'Đăng Nhập',
  [AuditAction.USER_LOGOUT]: 'Đăng Xuất',
  [AuditAction.USER_CREATE]: 'Tạo Người Dùng',
  [AuditAction.USER_UPDATE]: 'Cập Nhật Người Dùng',
  [AuditAction.USER_DELETE]: 'Xóa Người Dùng',
  [AuditAction.SYSTEM_CONFIG_UPDATE]: 'Cập Nhật Cấu Hình',
};

export const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  [ResourceType.CONTENT]: 'Nội Dung',
  [ResourceType.REPORT]: 'Báo Cáo',
  [ResourceType.USER]: 'Người Dùng',
  [ResourceType.PLAYLIST]: 'Playlist',
  [ResourceType.SYSTEM]: 'Hệ Thống',
};

export const AUDIT_STATUS_LABELS: Record<AuditStatus, string> = {
  [AuditStatus.SUCCESS]: 'Thành Công',
  [AuditStatus.FAILED]: 'Thất Bại',
  [AuditStatus.PENDING]: 'Đang Xử Lý',
};

export const AUDIT_ACTION_COLORS: Record<AuditAction, string> = {
  [AuditAction.CONTENT_CREATE]: 'text-green-500',
  [AuditAction.CONTENT_UPDATE]: 'text-blue-500',
  [AuditAction.CONTENT_DELETE]: 'text-red-500',
  [AuditAction.CONTENT_APPROVE]: 'text-green-500',
  [AuditAction.CONTENT_REJECT]: 'text-yellow-500',
  [AuditAction.CONTENT_PUBLISH]: 'text-purple-500',
  [AuditAction.CONTENT_ARCHIVE]: 'text-gray-500',
  [AuditAction.REPORT_CREATE]: 'text-orange-500',
  [AuditAction.REPORT_RESOLVE]: 'text-green-500',
  [AuditAction.REPORT_REJECT]: 'text-red-500',
  [AuditAction.USER_LOGIN]: 'text-blue-500',
  [AuditAction.USER_LOGOUT]: 'text-gray-500',
  [AuditAction.USER_CREATE]: 'text-green-500',
  [AuditAction.USER_UPDATE]: 'text-blue-500',
  [AuditAction.USER_DELETE]: 'text-red-500',
  [AuditAction.SYSTEM_CONFIG_UPDATE]: 'text-purple-500',
};
```

### 6. Schemas (`schemas/`)

```typescript
// schemas/audit-search.schema.ts
import { z } from 'zod';
import { AuditAction, AuditStatus, ResourceType } from '../types';

export const auditSearchSchema = z.object({
  limit: z.number().optional(),
  cursor: z.string().optional(),
  action: z.nativeEnum(AuditAction).optional(),
  resource_type: z.nativeEnum(ResourceType).optional(),
  actor_id: z.string().optional(),
  status: z.nativeEnum(AuditStatus).optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
  search: z.string().optional(),
});

export type AuditSearchSchema = z.infer<typeof auditSearchSchema>;
```

### 7. Components (`components/`)

#### AuditLogCard Component

```typescript
// components/audit-log-card.tsx
import { Badge, Card, CardContent, Typography } from '@/shared/ui';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Activity, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import {
  AUDIT_ACTION_COLORS,
  AUDIT_ACTION_LABELS,
  AUDIT_STATUS_LABELS,
  RESOURCE_TYPE_LABELS,
} from '../constants';
import { AuditLog, AuditStatus } from '../types';

interface AuditLogCardProps {
  log: AuditLog;
  onView: () => void;
}

export function AuditLogCard({ log, onView }: AuditLogCardProps) {
  const statusIcon = {
    [AuditStatus.SUCCESS]: <CheckCircle size={16} className="text-green-500" />,
    [AuditStatus.FAILED]: <AlertCircle size={16} className="text-red-500" />,
    [AuditStatus.PENDING]: <Clock size={16} className="text-yellow-500" />,
  };

  return (
    <Card
      className="group cursor-pointer border-white/10 bg-zinc-900 transition-all hover:border-white/30"
      onClick={onView}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Activity size={16} className={AUDIT_ACTION_COLORS[log.action]} />
            <Typography variant="small" className="font-mono text-white uppercase">
              {AUDIT_ACTION_LABELS[log.action]}
            </Typography>
          </div>
          {statusIcon[log.status]}
        </div>

        {/* Actor Info */}
        <div className="mb-3 space-y-1">
          <Typography variant="small" className="text-zinc-400">
            {log.actor_name}
          </Typography>
          <Typography variant="tiny" className="text-zinc-600">
            {log.actor_email}
          </Typography>
        </div>

        {/* Resource Info */}
        <div className="mb-3 flex items-center gap-2">
          <Badge variant="outline" className="border-white/20 text-zinc-400">
            {RESOURCE_TYPE_LABELS[log.resource_type]}
          </Badge>
          <Typography variant="tiny" className="text-zinc-600">
            ID: {log.resource_id.slice(0, 8)}...
          </Typography>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/10 pt-3">
          <Typography variant="tiny" className="text-zinc-600">
            {formatDistanceToNow(new Date(log.created_at), {
              addSuffix: true,
              locale: vi,
            })}
          </Typography>
          <Typography variant="tiny" className="text-zinc-600">
            {log.ip_address}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
}
```

#### AuditLogTable Component

```typescript
// components/audit-log-table.tsx
import { Badge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Typography } from '@/shared/ui';
import { format } from 'date-fns';
import { Activity } from 'lucide-react';
import {
  AUDIT_ACTION_COLORS,
  AUDIT_ACTION_LABELS,
  AUDIT_STATUS_LABELS,
  RESOURCE_TYPE_LABELS,
} from '../constants';
import { AuditLog } from '../types';

interface AuditLogTableProps {
  logs: AuditLog[];
  onRowClick: (log: AuditLog) => void;
}

export function AuditLogTable({ logs, onRowClick }: AuditLogTableProps) {
  return (
    <div className="border border-white/10">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 bg-zinc-900">
            <TableHead className="font-mono text-xs text-zinc-400 uppercase">
              Hành Động
            </TableHead>
            <TableHead className="font-mono text-xs text-zinc-400 uppercase">
              Người Thực Hiện
            </TableHead>
            <TableHead className="font-mono text-xs text-zinc-400 uppercase">
              Tài Nguyên
            </TableHead>
            <TableHead className="font-mono text-xs text-zinc-400 uppercase">
              Trạng Thái
            </TableHead>
            <TableHead className="font-mono text-xs text-zinc-400 uppercase">
              Thời Gian
            </TableHead>
            <TableHead className="font-mono text-xs text-zinc-400 uppercase">
              IP Address
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow
              key={log.id}
              className="cursor-pointer border-white/10 transition-colors hover:bg-zinc-900"
              onClick={() => onRowClick(log)}
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  <Activity size={14} className={AUDIT_ACTION_COLORS[log.action]} />
                  <Typography variant="small" className="font-mono text-white">
                    {AUDIT_ACTION_LABELS[log.action]}
                  </Typography>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <Typography variant="small" className="text-white">
                    {log.actor_name}
                  </Typography>
                  <Typography variant="tiny" className="text-zinc-600">
                    {log.actor_email}
                  </Typography>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-white/20 text-zinc-400">
                    {RESOURCE_TYPE_LABELS[log.resource_type]}
                  </Badge>
                  <Typography variant="tiny" className="text-zinc-600">
                    {log.resource_id.slice(0, 8)}...
                  </Typography>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={log.status === 'SUCCESS' ? 'default' : 'destructive'}
                  className="font-mono"
                >
                  {AUDIT_STATUS_LABELS[log.status]}
                </Badge>
              </TableCell>
              <TableCell>
                <Typography variant="small" className="text-zinc-400">
                  {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm')}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="tiny" className="font-mono text-zinc-600">
                  {log.ip_address}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

### 8. Pages (`pages/`)

#### Audit List Page

```typescript
// pages/audit-list-page.tsx
import { Button, Input, Typography } from '@/shared/ui';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Download, Filter, LayoutGrid, LayoutList, Search } from 'lucide-react';
import { useState } from 'react';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { toast } from 'sonner';
import { AuditLogCard, AuditLogTable } from '../components';
import { useAuditLogs } from '../hooks/useAuditLogs';
import { AuditSearchSchema } from '../schemas';
import { AuditAction, AuditStatus, ResourceType } from '../types';
import {
  AUDIT_ACTION_LABELS,
  AUDIT_STATUS_LABELS,
  RESOURCE_TYPE_LABELS,
} from '../constants';
import { auditService } from '../services/audit-service';

function AuditListPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [searchQuery, setSearchQuery] = useState('');

  const filters: AuditSearchSchema = useSearch({ strict: false });
  const {
    data: logs,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useAuditLogs();

  const [loadMoreRef] = useInfiniteScroll({
    hasNextPage,
    onLoadMore: fetchNextPage,
    loading: isFetchingNextPage,
  });

  const handleFilterAction = (action: AuditAction) => {
    navigate({
      to: '/audit',
      search: { ...filters, action },
    });
  };

  const handleFilterResourceType = (resourceType: ResourceType) => {
    navigate({
      to: '/audit',
      search: { ...filters, resource_type: resourceType },
    });
  };

  const handleFilterStatus = (status: AuditStatus) => {
    navigate({
      to: '/audit',
      search: { ...filters, status },
    });
  };

  const handleViewDetail = (logId: string) => {
    navigate({ to: `/audit/$logId`, params: { logId } });
  };

  const handleExport = async () => {
    const toastId = toast.loading('Đang xuất dữ liệu...');
    try {
      const blob = await auditService.exportAuditLogs(filters, 'csv');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${Date.now()}.csv`;
      a.click();
      toast.dismiss(toastId);
      toast.success('Xuất dữ liệu thành công');
    } catch (error) {
      toast.dismiss(toastId);
      toast.error('Xuất dữ liệu thất bại');
    }
  };

  return (
    <div className="relative flex h-full flex-col space-y-8 p-4 sm:p-10">
      {/* Header */}
      <div className="sticky top-0 z-50 flex flex-col gap-6 bg-black/80 py-4 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h2" className="text-white">
              LỊCH SỬ HOẠT ĐỘNG
            </Typography>
            <Typography variant="p" className="text-muted-foreground mt-2 font-mono">
              Quản lý các hoạt động audit của hệ thống
            </Typography>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex border border-white/10">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-2 transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white text-black'
                    : 'bg-transparent text-zinc-400 hover:text-white'
                }`}
              >
                <LayoutList size={16} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-black'
                    : 'bg-transparent text-zinc-400 hover:text-white'
                }`}
              >
                <LayoutGrid size={16} />
              </button>
            </div>

            {/* Export Button */}
            <Button
              variant="outline"
              className="border-white/20 font-mono text-xs"
              onClick={handleExport}
            >
              <Download size={14} className="mr-2" />
              XUẤT DỮ LIỆU
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4">
          {/* Action Filter */}
          <div className="space-y-3">
            <Typography variant="small" className="flex items-center gap-2 font-mono text-zinc-500">
              <Filter size={14} /> Lọc Hành Động
            </Typography>
            <div className="flex flex-wrap gap-1">
              {Object.values(AuditAction).map((action) => (
                <button
                  key={action}
                  type="button"
                  onClick={() => handleFilterAction(action)}
                  className={`border px-4 py-2 font-mono text-xs uppercase transition-all ${
                    filters.action === action
                      ? 'border-white bg-white text-black'
                      : 'border-zinc-800 bg-transparent text-zinc-500 hover:border-zinc-500'
                  }`}
                >
                  {AUDIT_ACTION_LABELS[action]}
                </button>
              ))}
            </div>
          </div>

          {/* Resource Type Filter */}
          <div className="space-y-3">
            <Typography variant="small" className="flex items-center gap-2 font-mono text-zinc-500">
              <Filter size={14} /> Lọc Tài Nguyên
            </Typography>
            <div className="flex flex-wrap gap-1">
              {Object.values(ResourceType).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleFilterResourceType(type)}
                  className={`border px-4 py-2 font-mono text-xs uppercase transition-all ${
                    filters.resource_type === type
                      ? 'border-white bg-white text-black'
                      : 'border-zinc-800 bg-transparent text-zinc-500 hover:border-zinc-500'
                  }`}
                >
                  {RESOURCE_TYPE_LABELS[type]}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-3">
            <Typography variant="small" className="flex items-center gap-2 font-mono text-zinc-500">
              <Filter size={14} /> Lọc Trạng Thái
            </Typography>
            <div className="flex flex-wrap gap-1">
              {Object.values(AuditStatus).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => handleFilterStatus(status)}
                  className={`border px-4 py-2 font-mono text-xs uppercase transition-all ${
                    filters.status === status
                      ? 'border-white bg-white text-black'
                      : 'border-zinc-800 bg-transparent text-zinc-500 hover:border-zinc-500'
                  }`}
                >
                  {AUDIT_STATUS_LABELS[status]}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="border-t border-white/10 pt-6">
            <div className="group relative">
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-zinc-600 transition-colors group-hover:text-white" />
              <Input
                placeholder="TÌM KIẾM..."
                className="h-10 border-white/10 bg-black pl-10 font-mono text-xs text-white uppercase focus:border-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading && (
        <div className="flex justify-center py-20">
          <Typography variant="small" className="font-mono text-zinc-500">
            ĐANG TẢI...
          </Typography>
        </div>
      )}

      {!isLoading && !logs?.length && (
        <div className="flex flex-col items-center justify-center py-20">
          <Typography variant="h3" className="text-zinc-500">
            KHÔNG CÓ DỮ LIỆU
          </Typography>
        </div>
      )}

      {!isLoading && !!logs?.length && (
        <>
          {viewMode === 'table' ? (
            <AuditLogTable
              logs={logs}
              onRowClick={(log) => handleViewDetail(log.id)}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {logs.map((log) => (
                <AuditLogCard
                  key={log.id}
                  log={log}
                  onView={() => handleViewDetail(log.id)}
                />
              ))}
            </div>
          )}

          {/* Infinite Scroll Trigger */}
          {hasNextPage && (
            <div ref={loadMoreRef} className="flex justify-center py-8">
              {isFetchingNextPage && (
                <Typography variant="small" className="font-mono text-zinc-500">
                  ĐANG TẢI...
                </Typography>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AuditListPage;
```

---

## 🔌 API Endpoints

### Expected Backend Endpoints

```
GET /api/audit/logs
  Query params:
    - limit: number
    - cursor: string
    - action: AuditAction
    - resource_type: ResourceType
    - actor_id: string
    - status: AuditStatus
    - from_date: ISO string
    - to_date: ISO string
    - search: string
  Response: GetAuditLogsResponse

GET /api/audit/logs/:id
  Response: AuditLogDetail

GET /api/audit/logs/export
  Query params: same as GET /api/audit/logs + format
  Response: Blob (CSV or JSON)

POST /api/audit/logs
  Body: CreateAuditLogPayload
  Response: AuditLog
```

---

## 🎨 UI/UX Design

### Design Principles

1. **Consistency**: Tuân theo dark theme hiện tại
2. **Clarity**: Thông tin rõ ràng, dễ đọc
3. **Performance**: Infinite scroll, lazy loading
4. **Accessibility**: Keyboard navigation, screen reader support

### Color Scheme

- Background: `#050505` (black)
- Text: `#ffffff` (white), `#a1a1aa` (zinc-400)
- Borders: `rgba(255, 255, 255, 0.1)`
- Actions: Color-coded theo action type

### Typography

- Headers: `font-mono uppercase`
- Body: `Inter` font family
- Monospace: `JetBrains Mono` cho IDs, timestamps

---

## ✅ Testing Checklist

### Unit Tests

- [ ] Service functions
- [ ] Utility functions
- [ ] Custom hooks

### Integration Tests

- [ ] API integration
- [ ] Query invalidation
- [ ] Error handling

### E2E Tests

- [ ] Filter functionality
- [ ] Search functionality
- [ ] Pagination/Infinite scroll
- [ ] Export functionality
- [ ] Detail view navigation

### Manual Testing

- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Dark theme consistency
- [ ] Loading states
- [ ] Empty states
- [ ] Error states
- [ ] Performance (large datasets)

---

## 🎯 Best Practices

### 1. **Performance**

- Use React Query for caching
- Implement virtual scrolling for large lists
- Lazy load components
- Optimize re-renders with `useMemo`, `useCallback`

### 2. **Security**

- Validate all inputs with Zod
- Sanitize user-generated content
- Implement proper RBAC (Role-Based Access Control)
- Log sensitive actions

### 3. **Code Quality**

- Follow Airbnb style guide
- Use TypeScript strict mode
- Write meaningful comments
- Keep components small and focused

### 4. **Accessibility**

- Use semantic HTML
- Add ARIA labels
- Ensure keyboard navigation
- Test with screen readers

### 5. **Error Handling**

- Use try-catch blocks
- Show user-friendly error messages
- Log errors for debugging
- Implement retry logic

---

## 📝 Implementation Checklist

### Phase 1: Foundation (Day 1-2)

- [ ] Create types and interfaces
- [ ] Set up services
- [ ] Configure query keys
- [ ] Create custom hooks
- [ ] Define constants

### Phase 2: Components (Day 3-4)

- [ ] Build AuditLogCard
- [ ] Build AuditLogTable
- [ ] Build filter components
- [ ] Build detail view
- [ ] Create skeletons

### Phase 3: Pages (Day 5-6)

- [ ] Implement list page
- [ ] Implement detail page
- [ ] Add routing
- [ ] Integrate filters
- [ ] Add export functionality

### Phase 4: Polish (Day 7)

- [ ] Add loading states
- [ ] Add error boundaries
- [ ] Optimize performance
- [ ] Write documentation
- [ ] Code review

### Phase 5: Testing (Day 8-9)

- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Manual testing
- [ ] Fix bugs
- [ ] Performance testing

### Phase 6: Deployment (Day 10)

- [ ] Final review
- [ ] Merge to main
- [ ] Deploy to staging
- [ ] QA testing
- [ ] Deploy to production

---

## 🚀 Next Steps

1. **Review this document** với team
2. **Confirm API contract** với backend team
3. **Start implementation** theo checklist
4. **Daily standup** để track progress
5. **Code review** sau mỗi phase

---

## 📚 References

- [TanStack Query Docs](https://tanstack.com/query/)
- [TanStack Router Docs](https://tanstack.com/router/)
- [Zod Documentation](https://zod.dev/)
- [Radix UI Components](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

> **Lưu ý**: Document này là living document và sẽ được cập nhật trong quá trình implementation.
