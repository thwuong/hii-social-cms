import { Typography } from '@/shared/ui';
import { Clock, Trash2, Video } from 'lucide-react';
import { useState } from 'react';
import type { Playlist } from '../types';

interface PlaylistCardProps {
  playlist: Playlist;
  onView: (playlist: Playlist) => void;
  onDelete: (playlist: Playlist) => void;
  isDeleting: boolean;
}

export function PlaylistCard({ playlist, onView, onDelete, isDeleting }: PlaylistCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(playlist);
  };

  return (
    <div
      className="group relative cursor-pointer overflow-hidden border border-white/10 bg-black transition-all hover:border-white/30"
      onClick={() => onView(playlist)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
        {playlist.thumbnail_url ? (
          <img
            src={playlist.thumbnail_url}
            alt={playlist.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Video className="h-16 w-16 text-zinc-700" />
          </div>
        )}

        {/* Video Count Badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 border border-white/20 bg-black/80 px-2 py-1 backdrop-blur-sm">
          <Video size={12} className="text-white" />
          <Typography variant="tiny" className="font-mono text-white">
            {playlist.video_count}
          </Typography>
        </div>

        {/* Delete Button */}
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="absolute right-4 bottom-4 flex h-8 w-8 items-center justify-center border border-white/20 bg-black/80 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-red-900 hover:text-white disabled:opacity-50"
        >
          <Trash2 size={14} className="text-white" />
        </button>
      </div>

      {/* Info */}
      <div className="space-y-2 p-4">
        {/* Title */}
        <Typography className="line-clamp-1 font-mono text-white uppercase">
          {playlist.name}
        </Typography>

        {/* Description */}
        {playlist.description && (
          <Typography variant="small" className="line-clamp-2 text-zinc-500">
            {playlist.description}
          </Typography>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between border-t border-white/10 pt-2">
          <div className="flex items-center gap-1.5">
            <Clock size={10} className="text-zinc-500" />
            <Typography variant="tiny" className="font-mono text-zinc-500">
              {new Date(playlist.created_at).toLocaleDateString('vi-VN')}
            </Typography>
          </div>
          <Typography
            variant="tiny"
            className="font-mono text-zinc-500 transition-colors group-hover:text-white"
          >
            XEM CHI TIẾT →
          </Typography>
        </div>
      </div>
    </div>
  );
}
