import { Button, ContentItem, MediaType, STATUS_LABELS, Typography } from '@/shared';
import { ImageIcon, LinkIcon, MoreHorizontal, Type, Video } from 'lucide-react';

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

type ContentRowProps = {
  item: ContentItem;
  selectedIds: string[];
  onView: () => void;
  onToggleSelect?: (id: string) => void;
};
function ContentRow({ item, selectedIds, onView, onToggleSelect }: ContentRowProps) {
  return (
    <tr
      className={`group cursor-pointer transition-colors hover:bg-[#111] ${selectedIds.includes(item.id.toString()) ? 'bg-white/5' : ''}`}
      onClick={() => onView()}
    >
      {onToggleSelect && (
        <td className="p-6 align-middle" onClick={(e) => e.stopPropagation()}>
          {onToggleSelect ? (
            <input
              type="checkbox"
              className="h-3 w-3 cursor-pointer rounded-none border-zinc-700 bg-transparent accent-white"
              checked={selectedIds.includes(item.id)}
              onChange={() => onToggleSelect(item.id)}
            />
          ) : (
            <div className="h-3 w-3" />
          )}
        </td>
      )}
      <td className="p-6 align-middle">
        <div className="flex max-w-[300px] flex-col">
          <Typography className="line-clamp-2 leading-normal text-white">{item.title}</Typography>

          <Typography
            variant="small"
            className="line-clamp-2 font-mono leading-normal text-zinc-500"
          >
            {item.short_description}
          </Typography>
        </div>
      </td>
      <td className="p-6 align-middle">
        <div className="flex items-center gap-2">
          <MediaIcon type={item.media_type} />
          <Typography variant="tiny" className="font-mono leading-normal text-zinc-400 uppercase">
            {item.media_type}
          </Typography>
        </div>
      </td>
      <td className="p-6 align-middle">
        <div className="font-mono text-[10px] text-zinc-400 uppercase">{item.source_platform}</div>
      </td>
      <td className="p-6 align-middle">
        <div className="inline-block border border-zinc-800 px-2 py-1 font-mono text-[10px] text-zinc-300 uppercase">
          {STATUS_LABELS[item.status]}
        </div>
      </td>
      <td className="p-6 text-right align-middle">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-none text-zinc-600 hover:text-white"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
}

export default ContentRow;
