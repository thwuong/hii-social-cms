import { cn } from '@/lib';
import {
  Badge,
  ContentStatus,
  Permission,
  PermissionGate,
  STATUS_COLORS,
  STATUS_LABELS,
  Typography,
} from '@/shared';
import { ContentItem, MediaType } from '@/shared/types';
import { useSearch } from '@tanstack/react-router';
import { Check, Play } from 'lucide-react';
import { useMemo } from 'react';

interface MediaProps {
  item: ContentItem;
  onView: () => void;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
}
const limitTags = 2;

function Media({ item, onView, isSelected, onToggleSelect }: MediaProps) {
  const isVideo = item.media_type === MediaType.VIDEO;

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSelect?.(item.id);
  };

  const tags = item.tags?.slice(0, limitTags);
  const remainingTags = +(item.tags?.length || 0) - limitTags;

  const { approving_status: approvingStatus } = useSearch({ strict: false });
  const permission = useMemo(() => {
    if (approvingStatus === ContentStatus.PENDING_REVIEW) return Permission.REELS_APPROVE;
    if (approvingStatus === ContentStatus.APPROVED) return Permission.REELS_PUBLISH;
    if (approvingStatus === ContentStatus.REJECTED) return Permission.REELS_APPROVE;
    if (approvingStatus === ContentStatus.SCHEDULED) return Permission.REELS_PUBLISH;
    if (approvingStatus === ContentStatus.PUBLISHED) return Permission.REELS_PUBLISH;

    return Permission.NONE;
  }, [approvingStatus]);

  return (
    <button
      type="button"
      onClick={() => onView()}
      className="group hover:bg-background relative flex cursor-pointer flex-col items-start gap-3 overflow-hidden border border-white/5 bg-black p-4 text-left transition-colors"
    >
      {/* Hover Line */}
      <div className="absolute top-0 left-0 z-20 h-[1px] w-full origin-left scale-x-0 transform bg-white transition-transform duration-500 group-hover:scale-x-100" />

      {/* Selection Checkbox */}
      {onToggleSelect && (
        <PermissionGate permission={permission as Permission}>
          <button
            type="button"
            onClick={handleCheckboxClick}
            className="absolute top-3 right-3 z-30 flex h-6 w-6 cursor-pointer items-center justify-center border border-white/20 bg-black/80 backdrop-blur transition-all hover:border-white"
          >
            {isSelected && <Check size={14} className="text-white" />}
          </button>
        </PermissionGate>
      )}

      {/* Image/Media */}
      <div className="relative mb-4 aspect-[16/10] w-full overflow-hidden border border-white/5 bg-[#111] transition-colors duration-500 group-hover:border-zinc-600">
        <img
          src={item.thumbnail_url}
          alt={item.title}
          className="h-full w-full object-cover opacity-70 filter transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0"
        />

        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="group-hover:bg-background flex h-8 w-8 items-center justify-center rounded-none border border-white/20 bg-black/50 backdrop-blur transition-all">
              <Play size={12} className="fill-white text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex w-full flex-col gap-2 overflow-hidden text-ellipsis">
        <Typography
          variant="h4"
          className="line-clamp-2 text-ellipsis text-white transition-colors group-hover:text-white"
        >
          {item.title}
        </Typography>
      </div>
      {/* Meta */}
      <div className="flex flex-wrap items-center gap-1 font-mono text-[10px] text-zinc-500">
        {tags.map((tag) => (
          <Badge variant="outline" key={tag}>
            {tag}
          </Badge>
        ))}
        {remainingTags > 0 && (
          <Badge variant="outline" className="cursor-pointer" onClick={() => onView()}>
            +{remainingTags}
          </Badge>
        )}
      </div>
      <div className="absolute top-4 left-4 flex size-fit">
        <Badge
          className={cn('cursor-pointer', STATUS_COLORS[item.status])}
          onClick={() => onView()}
        >
          {STATUS_LABELS[item.status]}
        </Badge>
      </div>

      {/* Bottom Actions */}
    </button>
  );
}

export default Media;
