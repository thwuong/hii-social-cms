import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import * as React from 'react';
import { Button } from './button';
import { Checkbox } from './checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';

/**
 * DataTable Column Definition
 */
export interface DataTableColumn<T> {
  /** Unique identifier for the column */
  id: string;
  /** Column header label */
  header: string;
  /** Accessor function to get cell value */
  accessorFn?: (row: T) => React.ReactNode;
  /** Custom cell renderer */
  cell?: (row: T) => React.ReactNode;
  /** Enable sorting for this column */
  enableSorting?: boolean;
  /** Custom sort function */
  sortFn?: (a: T, b: T) => number;
  /** Column width class (e.g., 'w-[300px]') */
  className?: string;
  /** Header alignment */
  headerAlign?: 'left' | 'center' | 'right';
  /** Cell alignment */
  cellAlign?: 'left' | 'center' | 'right';
}

/**
 * DataTable Props
 */
export interface DataTableProps<T> {
  /** Array of data items */
  data: T[];
  /** Column definitions */
  columns: DataTableColumn<T>[];
  /** Optional row key extractor */
  getRowId?: (row: T, index: number) => string;
  /** Optional row click handler */
  onRowClick?: (row: T) => void;
  /** Optional selection */
  selectedIds?: string[];
  onToggleSelect?: (id: string) => void;
  onToggleAll?: () => void;
  /** Sticky header */
  stickyHeader?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Infinite scroll */
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  loadMoreRef?: React.Ref<HTMLDivElement>;
  /** Additional table classes */
  className?: string;
}

type SortDirection = 'asc' | 'desc' | null;

interface SortState {
  columnId: string | null;
  direction: SortDirection;
}

/**
 * Reusable DataTable Component
 *
 * Features:
 * - Sticky header
 * - Column sorting
 * - Row selection
 * - Infinite scroll
 * - Custom cell rendering
 * - Responsive
 */
export function DataTable<T>({
  data,
  columns,
  getRowId = (_, index) => index.toString(),
  onRowClick,
  selectedIds = [],
  onToggleSelect,
  onToggleAll,
  stickyHeader = true,
  emptyMessage = 'Không có dữ liệu hiển thị.',
  isLoading = false,
  hasNextPage,
  isFetchingNextPage,
  loadMoreRef,
  className,
}: DataTableProps<T>) {
  const [sortState, setSortState] = React.useState<SortState>({
    columnId: null,
    direction: null,
  });

  // Handle sorting
  const handleSort = (column: DataTableColumn<T>) => {
    if (!column.enableSorting) return;

    setSortState((prev) => {
      if (prev.columnId !== column.id) {
        return { columnId: column.id, direction: 'asc' };
      }
      if (prev.direction === 'asc') {
        return { columnId: column.id, direction: 'desc' };
      }
      return { columnId: null, direction: null };
    });
  };

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortState.columnId || !sortState.direction) return data;

    const column = columns.find((col) => col.id === sortState.columnId);
    if (!column) return data;

    const sorted = [...data].sort((a, b) => {
      if (column.sortFn) {
        return column.sortFn(a, b);
      }

      // Default sort by accessor
      const aValue = column.accessorFn?.(a);
      const bValue = column.accessorFn?.(b);

      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue);
      }

      return aValue > bValue ? 1 : -1;
    });

    return sortState.direction === 'desc' ? sorted.reverse() : sorted;
  }, [data, sortState, columns]);

  // Calculate selection state
  const allSelected = data.length > 0 && selectedIds.length === data.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < data.length;

  // Calculate colspan
  const colSpan = columns.length + (onToggleSelect ? 1 : 0);

  const getSortIcon = (column: DataTableColumn<T>) => {
    if (!column.enableSorting) return null;

    if (sortState.columnId === column.id) {
      return sortState.direction === 'asc' ? (
        <ArrowUp className="ml-1 h-3 w-3" />
      ) : (
        <ArrowDown className="ml-1 h-3 w-3" />
      );
    }

    return <ArrowUpDown className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-50" />;
  };

  const getAlignClass = (align?: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  return (
    <div className={cn('w-full border border-white/10 bg-black', className)}>
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader
            className={cn('border-b border-white/10', stickyHeader && 'sticky top-0 z-10 bg-black')}
          >
            <TableRow className="border-b border-white/10 hover:bg-transparent">
              {/* Selection Column */}
              {onToggleSelect && onToggleAll && (
                <TableHead className="h-10 w-[50px] px-6">
                  <Checkbox
                    className="size-5 cursor-pointer"
                    checked={allSelected}
                    onCheckedChange={onToggleAll}
                  />
                </TableHead>
              )}

              {/* Data Columns */}
              {columns.map((column) => (
                <TableHead
                  key={column.id}
                  className={cn(
                    'h-10 px-6 font-mono text-xs tracking-wider text-zinc-500 uppercase',
                    getAlignClass(column.headerAlign),
                    column.className
                  )}
                >
                  {column.enableSorting ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="group -ml-3 h-8 px-3 font-mono text-xs tracking-wider text-zinc-500 uppercase hover:bg-transparent hover:text-zinc-300"
                      onClick={() => handleSort(column)}
                    >
                      {column.header}
                      {getSortIcon(column)}
                    </Button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-white/5">
            {/* Data Rows */}
            {sortedData.map((row, index) => {
              const rowId = getRowId(row, index);
              const isSelected = selectedIds.includes(rowId);

              return (
                <TableRow
                  key={rowId}
                  className={cn(
                    'group cursor-pointer border-b border-white/5 transition-colors hover:bg-[#111]',
                    isSelected && 'bg-white/5'
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {/* Selection Cell */}
                  {onToggleSelect && (
                    <TableCell className="px-6" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onToggleSelect(rowId)}
                        className="size-5 cursor-pointer"
                      />
                    </TableCell>
                  )}

                  {/* Data Cells */}
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      className={cn('px-6 py-4', getAlignClass(column.cellAlign))}
                    >
                      {column.cell ? column.cell(row) : column.accessorFn?.(row)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}

            {/* Empty State */}
            {sortedData.length === 0 && !isLoading && (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={colSpan}
                  className="p-8 text-center font-mono text-xs text-zinc-600 uppercase"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}

            {/* Loading State */}
            {isLoading && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={colSpan} className="p-8 text-center">
                  <div className="flex items-center justify-center gap-2 font-mono text-xs text-white uppercase">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
                    <span>ĐANG_TẢI...</span>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {/* Infinite Scroll Trigger */}
            {hasNextPage && sortedData.length > 0 && (
              <TableRow className="border-t border-white/10 hover:bg-transparent">
                <TableCell colSpan={colSpan} className="py-8 text-center">
                  <div ref={loadMoreRef}>
                    {isFetchingNextPage && (
                      <div className="flex items-center justify-center gap-2 font-mono text-xs text-white uppercase">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
                        <span>ĐANG_TẢI...</span>
                      </div>
                    )}
                    {!isFetchingNextPage && hasNextPage && (
                      <div className="font-mono text-xs text-zinc-600 uppercase">
                        Cuộn xuống để tải thêm
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
