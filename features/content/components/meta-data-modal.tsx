import { cn } from '@/lib/utils';
import { DialogContent, DialogHeader, DialogTitle, Input } from '@/shared';
import { Check, Loader2, Search } from 'lucide-react';
import useInfiniteScroll from 'react-infinite-scroll-hook';

const MetadataModal = ({
  title,
  searchTerm,
  onSearchChange,
  items,
  selectedValues,
  onSelect,
  multiple = false,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
}: {
  title: string;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  items: any[];
  selectedValues: string | string[];
  onSelect?: (val: string) => void;
  multiple?: boolean;
  hasNextPage?: boolean;
  fetchNextPage?: () => void;
  isFetchingNextPage?: boolean;
}) => {
  const [sentryRef] = useInfiniteScroll({
    loading: !!isFetchingNextPage,
    hasNextPage: !!hasNextPage,
    onLoadMore: fetchNextPage || (() => {}),
    disabled: !hasNextPage,
    rootMargin: '0px 0px 100px 0px',
  });

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 pt-4">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-2 size-4 -translate-y-1/2" />
          <Input
            placeholder={`Tìm ${title.toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="max-h-[300px] space-y-1 overflow-y-auto">
          {items.map((item) => {
            const isSelected = multiple
              ? (selectedValues as string[]).includes(item.code || item.slug)
              : selectedValues === (item.code || item.slug);
            return (
              <div
                key={item.id}
                onClick={() => onSelect?.(item.code || item.slug)}
                className={cn(
                  'hover:bg-accent flex cursor-pointer items-center justify-between rounded-none px-2 py-1.5 transition-colors',
                  isSelected && 'bg-accent font-medium'
                )}
              >
                <span>{item.name}</span>
                {isSelected && <Check size={16} />}
              </div>
            );
          })}

          {(hasNextPage || isFetchingNextPage) && (
            <div ref={sentryRef} className="flex justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
            </div>
          )}

          {items.length === 0 && !isFetchingNextPage && (
            <p className="text-muted-foreground py-4 text-center text-sm italic">
              Không tìm thấy kết quả
            </p>
          )}
        </div>
      </div>
    </DialogContent>
  );
};

export default MetadataModal;
