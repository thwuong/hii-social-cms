import React from 'react';
import { Video, Image as ImageIcon, Type, Link as LinkIcon, MoreHorizontal } from 'lucide-react';
import { ContentItem, ContentStatus, MediaType } from '@/shared/types';
import { STATUS_LABELS } from '@/features/content/constants';
import { Button } from '@/shared/ui/primitives';

interface ContentTableProps {
  items: ContentItem[];
  onView: (id: string) => void;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleAll: () => void;
}

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

const ContentTable: React.FC<ContentTableProps> = ({
  items,
  onView,
  selectedIds,
  onToggleSelect,
  onToggleAll,
}) => {
  const allSelected =
    items.length > 0 && items.every((item) => selectedIds.includes(item.content_id));

  return (
    <div className="w-full border border-white/10 bg-black">
      <div className="w-full overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="h-10 px-6 text-left align-middle w-[50px]">
                <input
                  type="checkbox"
                  className="accent-white h-3 w-3 bg-transparent border-zinc-700 rounded-none cursor-pointer"
                  checked={allSelected}
                  onChange={onToggleAll}
                />
              </th>
              <th className="h-10 px-6 text-left align-middle font-mono text-[10px] uppercase text-zinc-500 tracking-wider">
                Tài Nguyên
              </th>
              <th className="h-10 px-6 text-left align-middle font-mono text-[10px] uppercase text-zinc-500 tracking-wider">
                Loại
              </th>
              <th className="h-10 px-6 text-left align-middle font-mono text-[10px] uppercase text-zinc-500 tracking-wider">
                Nguồn
              </th>
              <th className="h-10 px-6 text-left align-middle font-mono text-[10px] uppercase text-zinc-500 tracking-wider">
                Trạng Thái
              </th>
              <th className="h-10 px-6 text-right align-middle font-mono text-[10px] uppercase text-zinc-500 tracking-wider">
                Thao Tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {items.map((item) => (
              <tr
                key={item.content_id}
                className={`group transition-colors hover:bg-[#111] cursor-pointer ${selectedIds.includes(item.content_id) ? 'bg-white/5' : ''}`}
                onClick={() => onView(item.content_id)}
              >
                <td className="p-6 align-middle" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    className="accent-white h-3 w-3 bg-transparent border-zinc-700 rounded-none cursor-pointer"
                    checked={selectedIds.includes(item.content_id)}
                    onChange={() => onToggleSelect(item.content_id)}
                  />
                </td>
                <td className="p-6 align-middle">
                  <div className="flex flex-col max-w-[300px]">
                    <span className="font-bold text-white truncate mb-1 group-hover:text-white transition-colors">
                      {item.title}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-600 uppercase">
                      ID: {item.content_id}
                    </span>
                  </div>
                </td>
                <td className="p-6 align-middle">
                  <div className="flex items-center gap-2">
                    <MediaIcon type={item.media_type} />
                    <span className="font-mono text-[10px] text-zinc-400 uppercase">
                      {item.category}
                    </span>
                  </div>
                </td>
                <td className="p-6 align-middle">
                  <div className="font-mono text-[10px] uppercase text-zinc-400">
                    {item.source_platform}
                  </div>
                </td>
                <td className="p-6 align-middle">
                  <div className="inline-block border border-zinc-800 px-2 py-1 font-mono text-[10px] uppercase text-zinc-300">
                    {STATUS_LABELS[item.status]}
                  </div>
                </td>
                <td className="p-6 align-middle text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-zinc-600 hover:text-white rounded-none"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 align-middle text-center font-mono text-xs text-zinc-600 uppercase"
                >
                  Không có dữ liệu hiển thị.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContentTable;
