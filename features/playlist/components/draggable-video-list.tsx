import { cn } from '@/lib';
import { Typography } from '@/shared/ui';
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Play, Trash2 } from 'lucide-react';
import type { PlaylistContent } from '../types';

interface DraggableVideoListProps {
  videos: PlaylistContent[];
  activeVideoId: string | null;
  onReorder: (videos: PlaylistContent[]) => void;
  onPlayVideo: (video: PlaylistContent) => void;
  onRemoveVideo: (video: PlaylistContent) => void;
}

export function DraggableVideoList({
  videos,
  activeVideoId,
  onReorder,
  onPlayVideo,
  onRemoveVideo,
}: DraggableVideoListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = videos.findIndex((v) => v.id === active.id);
      const newIndex = videos.findIndex((v) => v.id === over.id);

      const reorderedVideos = arrayMove(videos, oldIndex, newIndex).map((video, index) => ({
        ...video,
        position: index + 1,
      }));

      onReorder(reorderedVideos);
    }
  };

  if (videos.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center border border-white/10 bg-black">
        <Typography variant="small" className="font-mono text-zinc-500 uppercase">
          Chưa có video trong playlist
        </Typography>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={videos.map((v) => v.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-[1px] border border-white/10 bg-white/10">
          {videos.map((video) => (
            <SortableVideoItem
              key={video.id}
              video={video}
              isActive={video.id === activeVideoId}
              onPlay={onPlayVideo}
              onRemove={onRemoveVideo}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

interface SortableVideoItemProps {
  video: PlaylistContent;
  isActive: boolean;
  onPlay: (video: PlaylistContent) => void;
  onRemove: (video: PlaylistContent) => void;
}

function SortableVideoItem({ video, isActive, onPlay, onRemove }: SortableVideoItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: video.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group flex items-center gap-4 bg-black p-4 transition-colors',
        isActive && 'bg-white/5',
        isDragging && 'opacity-50'
      )}
    >
      {/* Drag Handle */}
      <button
        type="button"
        className="cursor-grab touch-none text-zinc-600 hover:text-white active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={20} />
      </button>

      {/* Position */}
      <div className="flex h-8 w-8 items-center justify-center">
        <Typography variant="small" className="font-mono text-zinc-500">
          {video.position}
        </Typography>
      </div>

      {/* Thumbnail */}
      <div className="relative h-16 w-28 flex-shrink-0 overflow-hidden bg-zinc-900">
        {video.thumbnail_url ? (
          <img src={video.thumbnail_url} alt={video.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Play size={20} className="text-zinc-700" />
          </div>
        )}
        {isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <Play size={20} className="text-white" fill="white" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 overflow-hidden">
        <Typography
          className={cn(
            'line-clamp-1 font-mono text-sm uppercase',
            isActive ? 'text-white' : 'text-zinc-300'
          )}
        >
          {video.title}
        </Typography>
        <div className="mt-1 flex items-center gap-4">
          <Typography variant="tiny" className="font-mono text-zinc-500">
            {formatDuration(video.duration)}
          </Typography>
          {isActive && (
            <Typography variant="tiny" className="font-mono text-white">
              • ĐANG PHÁT
            </Typography>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Play Button */}
        <button
          type="button"
          onClick={() => onPlay(video)}
          className="flex h-8 w-8 items-center justify-center border border-white/20 bg-transparent text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white hover:text-black"
        >
          <Play size={14} />
        </button>

        {/* Remove Button */}
        <button
          type="button"
          onClick={() => onRemove(video)}
          className="flex h-8 w-8 items-center justify-center border border-white/20 bg-transparent text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-900"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
