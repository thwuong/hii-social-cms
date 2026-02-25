# 📋 Audit Feature - Summary & Quick Reference

> **Quick reference guide cho việc implement Audit Feature**

---

## 🎯 Tổng Quan

**Audit Feature** hiện tại chỉ có:

- ✅ Basic page với header
- ❌ Chưa có data fetching
- ❌ Chưa có UI components
- ❌ Chưa có filters/search

**Mục tiêu**: Xây dựng một hệ thống audit log hoàn chỉnh để theo dõi mọi hoạt động trong CMS.

---

## 📊 So Sánh Với Features Khác

### Content Feature (Reference)

```
features/content/
├── components/      ✅ 16 components
├── constants/       ✅ Status labels, options
├── hooks/          ✅ 5 custom hooks
├── pages/          ✅ 6 pages
├── query-keys/     ✅ React Query keys
├── schemas/        ✅ 5 Zod schemas
├── services/       ✅ 4 API services
├── stores/         ✅ 2 Zustand stores
├── types/          ✅ 6 type definitions
└── utils/          ✅ Utility functions
```

### Audit Feature (Current)

```
features/audit/
├── components/      ❌ MISSING
├── constants/       ❌ MISSING
├── hooks/          ❌ MISSING
├── pages/          ⚠️  1 basic page only
├── query-keys/     ❌ MISSING
├── schemas/        ❌ MISSING
├── services/       ❌ MISSING
├── stores/         ❌ MISSING (optional)
├── types/          ❌ MISSING
└── utils/          ❌ MISSING
```

---

## 🚀 Quick Start Implementation

### Step 1: Types (30 mins)

```bash
# Create types
touch features/audit/types/audit-log.types.ts
touch features/audit/types/index.ts
```

**Key Types Needed:**

- `AuditLog` - Main audit log interface
- `AuditAction` - Enum for action types
- `ResourceType` - Enum for resource types
- `AuditStatus` - Enum for status
- `GetAuditLogsPayload` - Request payload
- `GetAuditLogsResponse` - Response type

### Step 2: Services (20 mins)

```bash
# Create services
touch features/audit/services/audit-service.ts
```

**API Methods:**

- `getAuditLogs()` - Fetch logs with filters
- `getAuditLogDetail()` - Get single log detail
- `exportAuditLogs()` - Export to CSV/JSON

### Step 3: Query Keys (10 mins)

```bash
# Create query keys
touch features/audit/query-keys/auditKeys.ts
```

### Step 4: Hooks (20 mins)

```bash
# Create hooks
touch features/audit/hooks/useAuditLogs.ts
```

**Hooks Needed:**

- `useAuditLogs()` - Infinite query for list
- `useAuditLogDetail()` - Query for detail

### Step 5: Constants (15 mins)

```bash
# Create constants
touch features/audit/constants/index.ts
```

**Constants:**

- `AUDIT_ACTION_LABELS` - Vietnamese labels
- `RESOURCE_TYPE_LABELS` - Resource type labels
- `AUDIT_STATUS_LABELS` - Status labels
- `AUDIT_ACTION_COLORS` - Color mapping

### Step 6: Schemas (10 mins)

```bash
# Create schemas
touch features/audit/schemas/audit-search.schema.ts
```

### Step 7: Components (2-3 hours)

```bash
# Create components
mkdir -p features/audit/components
touch features/audit/components/audit-log-card.tsx
touch features/audit/components/audit-log-table.tsx
touch features/audit/components/audit-log-filters.tsx
touch features/audit/components/index.ts
```

### Step 8: Update Page (1 hour)

```bash
# Update existing page
# Edit: features/audit/pages/audit-page.tsx
```

---

## 🎨 Design Pattern Reference

### Styling Pattern (từ Report Feature)

```tsx
// Dark theme với borders
className="border border-white/10 bg-zinc-900"

// Hover effects
className="transition-all hover:border-white/30"

// Typography
<Typography variant="h2" className="text-white">
  TIÊU ĐỀ
</Typography>

// Buttons
<Button variant="outline" className="border-white/20 font-mono text-xs">
  BUTTON TEXT
</Button>

// Filters
className="border px-4 py-2 font-mono text-xs uppercase"
```

### Data Fetching Pattern

```tsx
// Infinite scroll với React Query
const { data: logs, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useAuditLogs();

// Infinite scroll hook
const [loadMoreRef] = useInfiniteScroll({
  hasNextPage,
  onLoadMore: fetchNextPage,
  loading: isFetchingNextPage,
});
```

### Filter Pattern

```tsx
// URL-based filters với TanStack Router
const filters = useSearch({ strict: false });

// Navigate với filters
navigate({
  to: '/audit',
  search: { ...filters, action: newAction },
});
```

---

## 📝 Code Templates

### Service Template

```typescript
import { api } from '@/services';
import queryString from 'query-string';

export const auditService = {
  getAuditLogs: async (payload) => {
    const searchParams = queryString.stringify(payload);
    return await api.get(`audit/logs?${searchParams}`);
  },
};
```

### Hook Template

```typescript
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';

export const useAuditLogs = () => {
  const filters = useSearch({ strict: false });

  return useInfiniteQuery({
    queryKey: auditKeys.list(filters),
    queryFn: ({ pageParam }) =>
      auditService.getAuditLogs({
        ...filters,
        cursor: pageParam,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => (lastPage.has_next ? lastPage.next_cursor : undefined),
    select: (data) => data.pages.flatMap((page) => page.logs),
  });
};
```

### Component Template

```tsx
import { Card, Typography } from '@/shared/ui';

interface AuditLogCardProps {
  log: AuditLog;
  onView: () => void;
}

export function AuditLogCard({ log, onView }: AuditLogCardProps) {
  return (
    <Card
      className="cursor-pointer border-white/10 bg-zinc-900 hover:border-white/30"
      onClick={onView}
    >
      {/* Content */}
    </Card>
  );
}
```

---

## ✅ Implementation Checklist

### Must Have (MVP)

- [ ] Types & Interfaces
- [ ] API Service
- [ ] Query Keys
- [ ] useAuditLogs hook
- [ ] Constants (labels, colors)
- [ ] AuditLogTable component
- [ ] Updated audit-page.tsx with filters
- [ ] Infinite scroll
- [ ] Loading/Empty states

### Nice to Have

- [ ] AuditLogCard component
- [ ] Grid/Table view toggle
- [ ] Export functionality
- [ ] Detail page
- [ ] Date range picker
- [ ] Advanced search
- [ ] Analytics dashboard

### Optional

- [ ] Real-time updates
- [ ] Zustand store for filters
- [ ] Skeleton loading
- [ ] Error boundaries

---

## 🔍 Key Differences from Other Features

### Audit vs Content

- **Read-only**: Audit logs không có create/update/delete
- **Time-based**: Focus vào timeline và filtering
- **System-wide**: Tracks all features, not just one

### Audit vs Report

- **No batch actions**: Không cần select/approve/reject
- **More filters**: Nhiều filter options hơn
- **Detail-heavy**: Chi tiết metadata quan trọng hơn

---

## 🎯 Priority Order

1. **High Priority** (Week 1)
   - Types, Services, Hooks
   - Basic table view
   - Filters (action, resource type, status)
   - Infinite scroll

2. **Medium Priority** (Week 2)
   - Card view
   - Export functionality
   - Detail page
   - Date range filter

3. **Low Priority** (Week 3+)
   - Analytics dashboard
   - Real-time updates
   - Advanced search

---

## 📚 Files to Reference

### For Patterns

- `features/report/pages/report-list-page.tsx` - List page pattern
- `features/content/services/content-service.ts` - Service pattern
- `features/report/hooks/useReport.ts` - Hook pattern
- `features/content/constants/index.ts` - Constants pattern

### For Styling

- `shared/ui/typography.tsx` - Typography component
- `shared/ui/button.tsx` - Button variants
- `shared/ui/card.tsx` - Card component
- `shared/ui/table.tsx` - Table component

### For Configuration

- `lib/api-client.ts` - API client setup
- `lib/query-client.ts` - React Query config

---

## 🚨 Common Pitfalls to Avoid

1. **Don't hardcode strings** - Use constants
2. **Don't forget loading states** - Always handle loading/error
3. **Don't skip TypeScript** - Proper typing is crucial
4. **Don't ignore accessibility** - Add ARIA labels
5. **Don't over-engineer** - Start simple, iterate

---

## 💡 Pro Tips

1. **Copy-paste smartly**: Use report feature as template
2. **Test incrementally**: Test each layer before moving on
3. **Use TypeScript**: Let types guide your implementation
4. **Follow conventions**: Stick to project patterns
5. **Ask for help**: Reference existing code when stuck

---

## 📞 Need Help?

- **Full Implementation Guide**: See `AUDIT_FEATURE_IMPLEMENTATION.md`
- **Source Code Overview**: See `SOURCE_CODE_OVERVIEW.md`
- **API Client Guide**: See `API_CLIENT.md`
- **Data Fetching Guide**: See `DATA_FETCHING.md`

---

> **Estimated Time**: 2-3 days for MVP, 1 week for full feature
