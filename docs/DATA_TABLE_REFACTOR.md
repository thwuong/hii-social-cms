# DataTable Refactoring Documentation

## 📋 Overview

Refactored table components to use shadcn UI's DataTable pattern with enhanced features:

- ✅ Sticky header
- ✅ Column sorting
- ✅ Reusable across the application
- ✅ Type-safe
- ✅ Responsive design
- ✅ Infinite scroll support

## 🏗️ Architecture

### New Components

#### 1. **DataTable** (`shared/ui/data-table.tsx`)

Reusable, generic table component with full TypeScript support.

**Features:**

- Generic type support `<T>`
- Column-based configuration
- Built-in sorting (asc/desc/none)
- Row selection with checkbox
- Sticky header (optional)
- Infinite scroll integration
- Custom cell renderers
- Empty/loading states

**Props:**

```typescript
interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  getRowId?: (row: T, index: number) => string;
  onRowClick?: (row: T) => void;
  selectedIds?: string[];
  onToggleSelect?: (id: string) => void;
  onToggleAll?: () => void;
  stickyHeader?: boolean;
  emptyMessage?: string;
  isLoading?: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
  loadMoreRef?: React.RefObject<HTMLTableRowElement>;
  className?: string;
}
```

**Column Definition:**

```typescript
interface DataTableColumn<T> {
  id: string;
  header: string;
  accessorFn?: (row: T) => React.ReactNode;
  cell?: (row: T) => React.ReactNode;
  enableSorting?: boolean;
  sortFn?: (a: T, b: T) => number;
  className?: string;
  headerAlign?: 'left' | 'center' | 'right';
  cellAlign?: 'left' | 'center' | 'right';
}
```

#### 2. **ContentTable** (Refactored)

Specialized implementation of DataTable for content management.

**Changes:**

- Removed custom table markup
- Removed ContentRow component
- Removed ContentColumn component
- Uses DataTable with configured columns
- Cleaner, more maintainable code

## 📊 Usage Example

### Basic Usage

```typescript
import { DataTable, DataTableColumn } from '@/shared/ui';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const columns: DataTableColumn<User>[] = [
  {
    id: 'name',
    header: 'Name',
    enableSorting: true,
    accessorFn: (row) => row.name,
  },
  {
    id: 'email',
    header: 'Email',
    accessorFn: (row) => row.email,
  },
  {
    id: 'role',
    header: 'Role',
    enableSorting: true,
    cell: (row) => (
      <Badge>{row.role}</Badge>
    ),
  },
];

function UserTable() {
  const [users, setUsers] = useState<User[]>([]);

  return (
    <DataTable
      data={users}
      columns={columns}
      getRowId={(row) => row.id}
      onRowClick={(user) => console.log(user)}
      stickyHeader
    />
  );
}
```

### With Selection

```typescript
const [selectedIds, setSelectedIds] = useState<string[]>([]);

const handleToggleSelect = (id: string) => {
  setSelectedIds((prev) =>
    prev.includes(id)
      ? prev.filter((i) => i !== id)
      : [...prev, id]
  );
};

const handleToggleAll = () => {
  setSelectedIds((prev) =>
    prev.length === users.length
      ? []
      : users.map((u) => u.id)
  );
};

<DataTable
  data={users}
  columns={columns}
  selectedIds={selectedIds}
  onToggleSelect={handleToggleSelect}
  onToggleAll={handleToggleAll}
/>
```

### With Infinite Scroll

```typescript
import { useInfiniteScroll } from '@/shared';

const loadMoreRef = useInfiniteScroll({
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  threshold: 300,
});

<DataTable
  data={users}
  columns={columns}
  hasNextPage={hasNextPage}
  isFetchingNextPage={isFetchingNextPage}
  fetchNextPage={fetchNextPage}
  loadMoreRef={loadMoreRef}
/>
```

### Custom Sorting

```typescript
{
  id: 'created_at',
  header: 'Created',
  enableSorting: true,
  sortFn: (a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return dateA - dateB;
  },
  cell: (row) => format(new Date(row.created_at), 'dd/MM/yyyy'),
}
```

## 🎨 Styling

### Sticky Header

```typescript
<DataTable stickyHeader data={data} columns={columns} />
```

The header will:

- Stay at the top when scrolling
- Have `z-10` to appear above content
- Maintain background color

### Custom Column Width

```typescript
{
  id: 'title',
  header: 'Title',
  className: 'w-[300px]', // Fixed width
  cell: (row) => <div className="max-w-[300px] truncate">{row.title}</div>,
}
```

### Text Alignment

```typescript
{
  id: 'actions',
  header: 'Actions',
  headerAlign: 'right',
  cellAlign: 'right',
  cell: (row) => <Button>Edit</Button>,
}
```

## 🔄 Migration Guide

### Before (Old ContentTable)

```typescript
// Manual table markup
<table>
  <thead>
    <ContentColumn allSelected={...} onToggleAll={...} />
  </thead>
  <tbody>
    {items.map((item) => (
      <TableRow
        item={item}
        selectedIds={selectedIds}
        onView={onView}
        onToggleSelect={onToggleSelect}
      />
    ))}
  </tbody>
</table>
```

### After (New DataTable)

```typescript
// Column-based configuration
const columns: DataTableColumn<ContentItem>[] = [
  {
    id: 'title',
    header: 'Title',
    enableSorting: true,
    cell: (row) => <div>{row.title}</div>,
  },
];

<DataTable
  data={items}
  columns={columns}
  onRowClick={onView}
  selectedIds={selectedIds}
  onToggleSelect={onToggleSelect}
  onToggleAll={onToggleAll}
  stickyHeader
/>
```

## 📝 Benefits

### 1. **Reusability**

- One DataTable component for all tables
- Define columns once, reuse everywhere
- Consistent behavior across app

### 2. **Type Safety**

- Full TypeScript support
- Generic types for any data model
- Compile-time error checking

### 3. **Maintainability**

- Centralized sorting logic
- Easy to add/remove columns
- Clear separation of concerns

### 4. **Features**

- Built-in sorting (asc/desc/none)
- Sticky header support
- Selection with indeterminate state
- Infinite scroll ready
- Loading/empty states

### 5. **Performance**

- Memoized sorting
- Only re-renders when data changes
- Efficient selection tracking

## 🧪 Testing

### Manual Testing Checklist

- [ ] Sticky header works on scroll
- [ ] Sorting toggles: none → asc → desc → none
- [ ] Sort icon updates correctly
- [ ] Row selection (single)
- [ ] Select all (with indeterminate)
- [ ] Infinite scroll loads more
- [ ] Empty state displays
- [ ] Loading state displays
- [ ] Row click navigation
- [ ] Responsive on mobile

### Edge Cases

- [ ] Empty data array
- [ ] Single row
- [ ] All rows selected
- [ ] Some rows selected (indeterminate)
- [ ] No sorting columns
- [ ] All sorting columns
- [ ] Long content overflow
- [ ] Special characters in data

## 🔮 Future Enhancements

### Potential Features

- [ ] Column resizing
- [ ] Column reordering (drag & drop)
- [ ] Column visibility toggle
- [ ] Filtering per column
- [ ] Export to CSV/Excel
- [ ] Virtualization for large datasets
- [ ] Multi-column sorting
- [ ] Column groups/nesting
- [ ] Fixed columns (left/right)
- [ ] Row expansion/details

### Implementation Ideas

**Column Visibility:**

```typescript
const [visibleColumns, setVisibleColumns] = useState(['name', 'email']);

<DataTable
  columns={columns.filter(col => visibleColumns.includes(col.id))}
  // ...
/>
```

**Multi-Sort:**

```typescript
interface SortState {
  columnId: string;
  direction: 'asc' | 'desc';
}

const [sorts, setSorts] = useState<SortState[]>([]);
```

## 📁 Files Changed

### Added

- ✅ `shared/ui/data-table.tsx` - Reusable DataTable component
- ✅ `docs/DATA_TABLE_REFACTOR.md` - This documentation

### Modified

- ✅ `shared/ui/index.ts` - Export DataTable and Table components
- ✅ `features/content/components/content-table.tsx` - Refactored to use DataTable

### Deleted

- ❌ `features/content/components/content-row.tsx` - Replaced by DataTable cells
- ❌ `features/content/components/content-column.tsx` - Replaced by DataTable header

## 🎯 Summary

The DataTable refactor provides:

- **Better DX**: Type-safe, reusable, declarative API
- **Better UX**: Sticky headers, sorting, smooth interactions
- **Better Maintenance**: Single source of truth, consistent behavior
- **Better Performance**: Memoized logic, efficient rendering

**Migration complete!** 🎉

All table functionality preserved and enhanced with new features.
