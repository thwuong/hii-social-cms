// import { useContent } from '@/features/content/hooks/useContent';
// import { ContentStatus } from '@/shared/types';
import { Button, Dialog, DialogContent, Input, Typography } from '@/shared/ui';
import { Search, Video, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ContentStatus } from '@/shared';
import { useContent } from '@/features/content/hooks/useContent';
import { PlaylistVideo } from '../types';

interface AddVideosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVideo: (video: PlaylistVideo) => void;
  existingVideoIds: string[];
}

export function AddVideosModal({
  isOpen,
  onClose,
  onAddVideo,
  existingVideoIds,
}: AddVideosModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Get published videos
  const { data: videos, isLoading } = useContent(ContentStatus.PUBLISHED);

  // Filter out existing videos and apply search
  const availableVideos = useMemo(() => {
    if (!videos) return [];

    return videos
      .filter((video) => !existingVideoIds.includes(video.id))
      .filter((video) => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return video.title.toLowerCase().includes(query);
      });
  }, [videos, existingVideoIds, searchQuery]);

  const handleClose = () => {
    setSearchQuery('');
    onClose();
  };

  const handleAddVideo = (video: PlaylistVideo) => {
    onAddVideo(video);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl border-white/20 bg-black p-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <Typography variant="h4" className="font-mono uppercase">
            Thêm Video
          </Typography>
        </div>

        {/* Search */}
        <div className="border-b border-white/10 p-6">
          <div className="relative">
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Tìm kiếm video..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-white/20 bg-zinc-900 pl-10 font-mono text-white"
            />
          </div>
        </div>

        {/* Video List */}
        <div className="max-h-96 overflow-y-auto p-6">
          {isLoading && (
            <div className="flex justify-center py-8">
              <Typography variant="small" className="font-mono text-zinc-500">
                Đang tải...
              </Typography>
            </div>
          )}

          {!isLoading && availableVideos.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8">
              <Video className="mb-2 h-12 w-12 text-zinc-700" />
              <Typography variant="small" className="font-mono text-zinc-500">
                Không tìm thấy video
              </Typography>
            </div>
          )}

          {!isLoading && availableVideos.length > 0 && (
            <div className="space-y-2">
              {availableVideos.map((video) => (
                <div
                  key={video.id}
                  className="flex items-center gap-4 border border-white/10 bg-zinc-900 p-4 transition-colors hover:border-white/30"
                >
                  {/* Thumbnail */}
                  <div className="h-16 w-28 flex-shrink-0 overflow-hidden bg-black">
                    {video.thumbnail_url ? (
                      <img
                        src={video.thumbnail_url}
                        alt={video.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Video className="h-8 w-8 text-zinc-700" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 overflow-hidden">
                    <Typography className="line-clamp-1 font-mono text-sm text-white">
                      {video.title}
                    </Typography>
                    <Typography variant="tiny" className="mt-1 font-mono text-zinc-500">
                      {video.source_platform}
                    </Typography>
                  </div>

                  {/* Add Button */}
                  <Button
                    size="sm"
                    onClick={() =>
                      handleAddVideo({
                        ...video,
                        position: availableVideos.length,
                        video_id: video.id,
                        created_at: video.created_at,
                        id: video.id,
                        thumbnail_url: video.thumbnail_url || '',
                        duration: 0,
                      })
                    }
                    className="border-white bg-white font-mono text-xs text-black uppercase hover:bg-zinc-200"
                  >
                    Thêm
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 p-6">
          <Typography variant="small" className="font-mono text-zinc-500">
            {availableVideos.length} video có sẵn
          </Typography>
        </div>
      </DialogContent>
    </Dialog>
  );
}
