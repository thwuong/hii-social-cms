# DataTable Component

Reusable, type-safe table component với sticky header, sorting, và infinite scroll support.

## Features

- ✅ **Type-safe**: Generic `<T>` support cho bất kỳ data type nào
- ✅ **Sticky Header**: Header luôn visible khi scroll
- ✅ **Column Sorting**: Asc → Desc → None với visual indicators
- ✅ **Row Selection**: Checkbox với indeterminate state
- ✅ **Infinite Scroll**: Built-in support
- ✅ **Custom Cells**: Flexible cell rendering
- ✅ **Responsive**: Mobile-friendly design
- ✅ **Theme**: Carbon Kinetic styling

## Basic Usage

```tsx
import { DataTable, DataTableColumn } from '@/shared/ui';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

const columns: DataTableColumn<Product>[] = [
  {
    id: 'name',
    header: 'Tên Sản Phẩm',
    enableSorting: true,
    accessorFn: (row) => row.name,
  },
  {
    id: 'price',
    header: 'Giá',
    enableSorting: true,
    sortFn: (a, b) => a.price - b.price,
    cell: (row) => <span>{row.price.toLocaleString()} đ</span>,
  },
  {
    id: 'category',
    header: 'Danh Mục',
    accessorFn: (row) => row.category,
  },
];

function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);

  return <DataTable data={products} columns={columns} getRowId={(row) => row.id} stickyHeader />;
}
```

## Advanced Usage

### With Selection

```tsx
const [selectedIds, setSelectedIds] = useState<string[]>([]);

const handleToggleSelect = (id: string) => {
  setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
};

const handleToggleAll = () => {
  setSelectedIds((prev) => (prev.length === products.length ? [] : products.map((p) => p.id)));
};

<DataTable
  data={products}
  columns={columns}
  selectedIds={selectedIds}
  onToggleSelect={handleToggleSelect}
  onToggleAll={handleToggleAll}
/>;
```

### With Row Click

```tsx
const navigate = useNavigate();

<DataTable
  data={products}
  columns={columns}
  onRowClick={(product) => {
    navigate({ to: `/products/${product.id}` });
  }}
/>;
```

### With Infinite Scroll

```tsx
import { useInfiniteScroll } from '@/shared';

const {
  data: products,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
} = useInfiniteQuery({
  // ... query config
});

const loadMoreRef = useInfiniteScroll({
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  threshold: 300,
});

<DataTable
  data={products}
  columns={columns}
  hasNextPage={hasNextPage}
  isFetchingNextPage={isFetchingNextPage}
  fetchNextPage={fetchNextPage}
  loadMoreRef={loadMoreRef}
/>;
```

### Custom Cell Rendering

```tsx
// Define cell components outside render
function PriceCell({ row }: { row: Product }) {
  const isExpensive = row.price > 1000000;

  return (
    <div className={cn('font-mono', isExpensive && 'text-red-500')}>
      {row.price.toLocaleString()} đ
    </div>
  );
}

function ImageCell({ row }: { row: Product }) {
  return <img src={row.image} alt={row.name} className="h-10 w-10 object-cover" />;
}

// Use in columns
const columns: DataTableColumn<Product>[] = [
  {
    id: 'image',
    header: 'Hình',
    cell: (row) => <ImageCell row={row} />,
  },
  {
    id: 'price',
    header: 'Giá',
    enableSorting: true,
    cell: (row) => <PriceCell row={row} />,
  },
];
```

### Custom Sorting

```tsx
{
  id: 'created_at',
  header: 'Ngày Tạo',
  enableSorting: true,
  sortFn: (a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return dateA - dateB;
  },
  cell: (row) => format(new Date(row.created_at), 'dd/MM/yyyy HH:mm'),
}
```

### Column Alignment

```tsx
{
  id: 'actions',
  header: 'Thao Tác',
  headerAlign: 'right',  // Header alignment
  cellAlign: 'right',    // Cell alignment
  cell: (row) => (
    <Button onClick={() => handleEdit(row)}>
      Sửa
    </Button>
  ),
}
```

### Fixed Column Width

```tsx
{
  id: 'title',
  header: 'Tiêu Đề',
  className: 'w-[300px] max-w-[300px]',
  cell: (row) => (
    <div className="max-w-[300px] truncate">
      {row.title}
    </div>
  ),
}
```

## Props Reference

### DataTableProps<T>

| Prop                 | Type                                   | Default                        | Description                          |
| -------------------- | -------------------------------------- | ------------------------------ | ------------------------------------ |
| `data`               | `T[]`                                  | **required**                   | Mảng data cần hiển thị               |
| `columns`            | `DataTableColumn<T>[]`                 | **required**                   | Cấu hình columns                     |
| `getRowId`           | `(row: T, index: number) => string`    | `(_, i) => i.toString()`       | Hàm lấy unique ID cho row            |
| `onRowClick`         | `(row: T) => void`                     | `undefined`                    | Handler khi click vào row            |
| `selectedIds`        | `string[]`                             | `[]`                           | Mảng IDs của rows đã chọn            |
| `onToggleSelect`     | `(id: string) => void`                 | `undefined`                    | Handler khi toggle selection         |
| `onToggleAll`        | `() => void`                           | `undefined`                    | Handler khi toggle select all        |
| `stickyHeader`       | `boolean`                              | `true`                         | Enable sticky header                 |
| `emptyMessage`       | `string`                               | `'Không có dữ liệu hiển thị.'` | Message khi không có data            |
| `isLoading`          | `boolean`                              | `false`                        | Loading state                        |
| `hasNextPage`        | `boolean`                              | `undefined`                    | Có next page không (infinite scroll) |
| `isFetchingNextPage` | `boolean`                              | `undefined`                    | Đang fetch next page                 |
| `fetchNextPage`      | `() => void`                           | `undefined`                    | Hàm fetch next page                  |
| `loadMoreRef`        | `React.RefObject<HTMLTableRowElement>` | `undefined`                    | Ref cho infinite scroll trigger      |
| `className`          | `string`                               | `undefined`                    | Custom classes cho container         |

### DataTableColumn<T>

| Prop            | Type                            | Description                                    |
| --------------- | ------------------------------- | ---------------------------------------------- |
| `id`            | `string`                        | Unique identifier cho column                   |
| `header`        | `string`                        | Label hiển thị ở header                        |
| `accessorFn`    | `(row: T) => React.ReactNode`   | Hàm lấy giá trị từ row (dùng cho sort default) |
| `cell`          | `(row: T) => React.ReactNode`   | Custom cell renderer                           |
| `enableSorting` | `boolean`                       | Enable sorting cho column này                  |
| `sortFn`        | `(a: T, b: T) => number`        | Custom sort function                           |
| `className`     | `string`                        | CSS classes cho column                         |
| `headerAlign`   | `'left' \| 'center' \| 'right'` | Header alignment                               |
| `cellAlign`     | `'left' \| 'center' \| 'right'` | Cell alignment                                 |

## Sorting Behavior

1. **Initial**: No sort (original order)
2. **Click 1**: Sort ascending (A→Z, 0→9)
3. **Click 2**: Sort descending (Z→A, 9→0)
4. **Click 3**: Clear sort (back to original)

Visual indicators:

- ↑ Arrow Up = Ascending
- ↓ Arrow Down = Descending
- ↕ Arrow Up/Down = Sortable (hover)

## Selection Behavior

- **Individual**: Click checkbox on row
- **Select All**: Click checkbox in header
- **Indeterminate**: Shows when some (not all) rows selected
- **Visual**: Selected rows have `bg-white/5` background

## Styling

### Theme Variables

```css
/* Border */
border-white/10

/* Background */
bg-black              /* Container */
bg-[#111]            /* Hover row */
bg-white/5           /* Selected row */

/* Text */
text-white           /* Primary text */
text-zinc-400        /* Secondary text */
text-zinc-500        /* Header text */
text-zinc-600        /* Muted text */

/* Header */
text-[10px]          /* Font size */
tracking-wider       /* Letter spacing */
uppercase            /* Transform */
```

### Custom Styling

```tsx
<DataTable
  className="custom-table"
  columns={columns.map((col) => ({
    ...col,
    className: cn(col.className, 'custom-column'),
  }))}
/>
```

## Performance Tips

1. **Define columns outside component**:

```tsx
// ✅ Good: Static, won't re-create
const columns = [...];

function MyTable() {
  return <DataTable columns={columns} />;
}

// ❌ Bad: Re-creates on every render
function MyTable() {
  const columns = [...];
  return <DataTable columns={columns} />;
}
```

2. **Memoize cell components**:

```tsx
const PriceCell = React.memo(({ row }: { row: Product }) => {
  return <span>{row.price}</span>;
});
```

3. **Use accessorFn for simple values**:

```tsx
// ✅ Good: Simple accessor
{
  id: 'name',
  accessorFn: (row) => row.name,
}

// ❌ Overkill: Don't need custom cell
{
  id: 'name',
  cell: (row) => <span>{row.name}</span>,
}
```

## Examples

Xem implementation thực tế:

- `features/content/components/content-table.tsx` - Content management table
- `features/report/components/report-table.tsx` - Report table (if implemented)

## Migration from Custom Table

**Before:**

```tsx
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Price</th>
    </tr>
  </thead>
  <tbody>
    {items.map((item) => (
      <tr key={item.id}>
        <td>{item.name}</td>
        <td>{item.price}</td>
      </tr>
    ))}
  </tbody>
</table>
```

**After:**

```tsx
const columns: DataTableColumn<Item>[] = [
  { id: 'name', header: 'Name', accessorFn: (row) => row.name },
  { id: 'price', header: 'Price', accessorFn: (row) => row.price },
];

<DataTable data={items} columns={columns} />;
```

## Troubleshooting

### Sort không hoạt động

- Kiểm tra `enableSorting: true`
- Kiểm tra `accessorFn` hoặc `sortFn` đã define

### Selection không work

- Phải pass cả 3: `selectedIds`, `onToggleSelect`, `onToggleAll`
- `getRowId` phải return unique ID

### Infinite scroll không trigger

- Kiểm tra `loadMoreRef` từ `useInfiniteScroll`
- Kiểm tra `hasNextPage`, `fetchNextPage`, `isFetchingNextPage`

### Header không sticky

- Kiểm tra `stickyHeader={true}`
- Container phải có `overflow-auto`

## Best Practices

1. ✅ Define columns outside component (performance)
2. ✅ Use TypeScript for type safety
3. ✅ Extract cell components (reusability)
4. ✅ Use proper accessorFn for sorting
5. ✅ Handle empty/loading states
6. ✅ Add meaningful column IDs
7. ✅ Test on mobile (responsive)
8. ✅ Use semantic HTML (accessibility)

## Related

- `shared/ui/table.tsx` - Base table primitives (shadcn)
- `shared/hooks/useInfiniteScroll.ts` - Infinite scroll hook
- `docs/DATA_TABLE_REFACTOR.md` - Refactoring documentation
