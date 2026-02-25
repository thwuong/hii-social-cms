import { cn } from '@/lib';
import {
  Badge,
  ContentStatus,
  MediaType,
  Permission,
  STATUS_COLORS,
  STATUS_LABELS,
  Typography,
} from '@/shared';
import { usePermission } from '@/shared/hooks/use-permission';
import { ContentItem } from '@/shared/types';
import { DataTable, DataTableColumn } from '@/shared/ui/data-table';
import { useSearch } from '@tanstack/react-router';
import { format } from 'date-fns';
import { ImageIcon, LinkIcon, Type, Video } from 'lucide-react';
import React, { useMemo } from 'react';

interface ContentTableProps {
  items: ContentItem[];
  onView: (id: ContentItem) => void;
  selectedIds: string[];
  onToggleSelect?: (id: string) => void;
  onToggleAll?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  loadMoreRef: React.Ref<HTMLDivElement>;
  isPlaceholderData?: boolean;
}

// Media Icon Component (outside render)
function MediaIcon({ type }: { type: MediaType }) {
  switch (type) {
    case MediaType.VIDEO:
      return <Video size={14} className="text-zinc-400" />;
    case MediaType.IMAGE:
      return <ImageIcon size={14} className="text-zinc-400" />;
    case MediaType.TEXT:
      return <Type size={14} className="text-zinc-400" />;
    case MediaType.LINK:
      return <LinkIcon size={14} className="text-zinc-400" />;
    default:
      return null;
  }
}

// Title Cell Component (outside render)
function TitleCell({ row }: { row: ContentItem }) {
  return (
    <div className="flex max-w-[300px] flex-col whitespace-normal">
      <Typography className="line-clamp-1 leading-normal text-white">{row.title}</Typography>
    </div>
  );
}

// Media Type Cell Component (outside render)
function MediaTypeCell({ row }: { row: ContentItem }) {
  return (
    <div className="flex items-center gap-2">
      <MediaIcon type={row.media_type} />
      <Typography variant="tiny" className="font-mono leading-normal text-zinc-400 uppercase">
        {row.media_type}
      </Typography>
    </div>
  );
}

// Source Platform Cell Component (outside render)
function TargetPlatformsCell({ row }: { row: ContentItem }) {
  return (
    <div className="font-mono text-[10px] text-zinc-400 uppercase">
      {row.target_platforms?.join(', ')}
    </div>
  );
}

// Status Cell Component (outside render)
function StatusCell({ row }: { row: ContentItem }) {
  return (
    <Badge variant="outline" className={cn(STATUS_COLORS[row.status])}>
      {STATUS_LABELS[row.status]}
    </Badge>
  );
}

// Actions Cell Component (outside render)
// function ActionsCell() {
//   return (
//     <Button
//       variant="ghost"
//       size="icon"
//       className="h-8 w-8 rounded-none text-zinc-600 hover:text-white"
//     >
//       <MoreHorizontal className="h-4 w-4" />
//     </Button>
//   );
// }

function CreatedAtCell({ row }: { row: ContentItem }) {
  return (
    <div className="font-mono text-[10px] text-zinc-400 uppercase">
      {format(new Date(row.created_at), 'dd/MM/yyyy HH:mm')}
    </div>
  );
}
// Define columns outside component (static configuration)
const contentTableColumns: DataTableColumn<ContentItem>[] = [
  {
    id: 'title',
    header: 'Tài Nguyên',
    enableSorting: true,
    sortFn: (a, b) => a.title.localeCompare(b.title),
    accessorFn: (row) => row.title,
    cell: (row) => <TitleCell row={row} />,
  },
  {
    id: 'media_type',
    header: 'Loại',
    enableSorting: true,
    sortFn: (a, b) => a.media_type.localeCompare(b.media_type),
    accessorFn: (row) => row.media_type,
    cell: (row) => <MediaTypeCell row={row} />,
  },
  {
    id: 'target_platforms',
    header: 'Nơi Đăng',
    enableSorting: true,
    sortFn: (a, b) => a.source_platform.localeCompare(b.source_platform),
    accessorFn: (row) => row.source_platform,
    cell: (row) => <TargetPlatformsCell row={row} />,
  },
  {
    id: 'created_at',
    header: 'Ngày Tạo',
    enableSorting: true,
    sortFn: (a, b) => a.created_at.localeCompare(b.created_at),
    accessorFn: (row) => row.created_at,
    cell: (row) => <CreatedAtCell row={row} />,
  },
  {
    id: 'status',
    header: 'Trạng Thái',
    enableSorting: true,
    sortFn: (a, b) => a.status.localeCompare(b.status),
    accessorFn: (row) => row.status,
    cell: (row) => <StatusCell row={row} />,
  },
];

const ContentTable: React.FC<ContentTableProps> = ({
  items,
  onView,
  selectedIds,
  onToggleSelect,
  onToggleAll,
  hasNextPage,
  isFetchingNextPage,
  loadMoreRef,
  isPlaceholderData,
}) => {
  const { approving_status: approvingStatus } = useSearch({ strict: false });
  const permission = useMemo(() => {
    if (approvingStatus === ContentStatus.PENDING_REVIEW) return Permission.REELS_APPROVE;
    if (approvingStatus === ContentStatus.PUBLISHED) return Permission.REELS_PUBLISH;

    return Permission.NONE;
  }, [approvingStatus]);
  const hasPermission = usePermission(permission);

  return (
    <DataTable
      data={items}
      columns={contentTableColumns}
      getRowId={(row) => row.id}
      onRowClick={onView}
      selectedIds={selectedIds}
      onToggleSelect={hasPermission ? onToggleSelect : undefined}
      onToggleAll={hasPermission ? onToggleAll : undefined}
      stickyHeader
      emptyMessage="Không có dữ liệu hiển thị."
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      loadMoreRef={loadMoreRef}
      className={cn(isPlaceholderData && 'pointer-events-none opacity-50')}
    />
  );
};

export default ContentTable;
