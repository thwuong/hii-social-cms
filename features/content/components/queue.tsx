import { cn } from '@/lib';
import { ContentItem, ContentStatus, STATUS_LABELS, Typography } from '@/shared';
import { useNavigate } from '@tanstack/react-router';
import { Check, ListVideo } from 'lucide-react';

type QueueListProps = {
  queueItems: ContentItem[];
  item: ContentItem;
  loadMoreRef?: React.Ref<HTMLDivElement>;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  selectedIds?: string[];
  onToggleSelect?: (id: string) => void;
  className?: string;
};

function QueueList({
  queueItems,
  item,
  loadMoreRef,
  hasNextPage,
  isFetchingNextPage,
  selectedIds,
  onToggleSelect,
  className,
}: QueueListProps) {
  return (
    <div className={cn('custom-scrollbar queue-list flex flex-col overflow-y-auto', className)}>
      {queueItems.map((qItem) => (
        <QueueItem
          key={qItem.content_id}
          qItem={qItem}
          activeItem={qItem.content_id === item.content_id}
          isSelected={selectedIds?.includes(qItem.id)}
          onToggleSelect={onToggleSelect}
        />
      ))}

      {/* Infinite Scroll Trigger */}
      {loadMoreRef && hasNextPage && (
        <div ref={loadMoreRef} className="flex justify-center p-4">
          {isFetchingNextPage && <LoadingState />}
          {!isFetchingNextPage && hasNextPage && (
            <div className="font-mono text-[10px] text-zinc-600 uppercase">SCROLL_FOR_MORE</div>
          )}
        </div>
      )}
    </div>
  );
}

interface QueueItemProps {
  qItem: ContentItem;
  activeItem: boolean;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
}

function QueueItem({ qItem, activeItem, isSelected, onToggleSelect }: QueueItemProps) {
  const navigate = useNavigate();
  const isPending = qItem.status === ContentStatus.PENDING_REVIEW;

  const handleClick = () => {
    navigate({
      to: `${qItem.details_link}/$contentId`,
      params: { contentId: qItem.id },
      search: {
        approving_status: qItem.details_link === '/content/detail' ? qItem.status : undefined,
        playlist: qItem.playlist_id || undefined,
      },
    });
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSelect?.(qItem.id);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={cn(
        'group relative flex w-full cursor-pointer items-center gap-3 p-4 transition-all duration-300',
        activeItem &&
          'after:bg-accent-foreground bg-foreground/10 after:absolute after:top-0 after:bottom-0 after:left-0 after:w-0.5 after:shadow-md',
        activeItem && 'queue-item-active'
      )}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Selection Checkbox - Only for PENDING items */}
      {isPending && onToggleSelect && (
        <div
          onClick={handleCheckboxClick}
          className={cn(
            'absolute top-2 right-2 z-10 flex h-5 w-5 cursor-pointer items-center justify-center border border-white/20 bg-black/80 backdrop-blur transition-all hover:border-white',
            isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          )}
        >
          {isSelected && <Check size={12} className="text-white" />}
        </div>
      )}

      <img
        src={qItem.thumbnail_url}
        className="border-border h-16 w-12 shrink-0 border object-cover"
        alt="thumb"
        loading="lazy"
      />
      <div className="flex flex-1 flex-col gap-2 overflow-hidden">
        <Typography className="line-clamp-2 font-bold text-white" variant="small">
          {qItem.title}
        </Typography>

        <Typography className="text-muted-foreground" variant="tiny">
          {qItem.tags.join(', ')}
        </Typography>
      </div>
    </div>
  );
}

type QueueProps = {
  queueItems: ContentItem[];
  item: ContentItem;
  loadMoreRef?: React.Ref<HTMLDivElement>;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  totalItems?: number;
  title?: string;
  className?: string;
};

function Queue({
  queueItems,
  item,
  loadMoreRef,
  hasNextPage,
  isFetchingNextPage,
  totalItems,
  title,
  className,
}: QueueProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <Typography className="flex items-center gap-2 p-4 font-medium" variant="small">
        <ListVideo size={14} />
        <span>{title || `HÀNG ĐỢI // ${STATUS_LABELS[item.status as ContentStatus]}`}</span>
        <span className="ml-auto opacity-50">{totalItems}</span>
      </Typography>
      <QueueList
        queueItems={queueItems}
        item={item}
        loadMoreRef={loadMoreRef}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        className={className}
      />
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center gap-2 font-mono text-[10px] text-white uppercase">
      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
      <span>LOADING...</span>
    </div>
  );
}

export { QueueItem, QueueList };
export default Queue;
