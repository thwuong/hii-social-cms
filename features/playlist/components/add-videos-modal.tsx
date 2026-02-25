import { useContent } from '@/features/content/hooks/useContent';
import { ContentItem, ContentStatus } from '@/shared';
import { Button, Dialog, DialogContent, Input, Typography } from '@/shared/ui';
import { debounce } from 'lodash';
import { Search, Video } from 'lucide-react';
import { useMemo, useState } from 'react';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { transformContentToPlaylistVideo } from '../transform';
import { PlaylistContent } from '../types';

interface AddVideosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVideo: (video: PlaylistContent) => void;
  existingVideoIds: string[];
  onRemoveVideo: (videoId: string) => void;
}

export function AddVideosModal({
  isOpen,
  onClose,
  onAddVideo,
  existingVideoIds,
  onRemoveVideo,
}: AddVideosModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  const debounceFn = useMemo(
    () => debounce((value: string) => setDebouncedSearchQuery(value), 500),
    []
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchQuery(value);
    debounceFn(value);
  };

  // Get published videos
  const {
    data: videos,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useContent({
    approving_status: ContentStatus.PUBLISHED,
    search: debouncedSearchQuery,
  });

  const [loadMoreRef] = useInfiniteScroll({
    hasNextPage,
    onLoadMore: fetchNextPage,
    loading: isFetchingNextPage,
  });

  // Filter out existing videos and apply search
  const availableVideos = useMemo(() => {
    if (!videos) return [];

    return videos.map((video) => {
      return {
        ...video,
        isExisting: existingVideoIds.includes(video.id),
      };
    });
  }, [videos, existingVideoIds]);

  const handleClose = () => {
    setSearchQuery('');
    onClose();
  };

  const handleToggleVideo = (video: ContentItem) => {
    if (existingVideoIds.includes(video.id)) {
      onRemoveVideo(video.id);
    } else {
      const playlistVideo = transformContentToPlaylistVideo(video, availableVideos.length);
      onAddVideo(playlistVideo);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="!max-w-2xl border-white/20 bg-black p-0">
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
              onChange={handleSearch}
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
            <div className="flex flex-col gap-2">
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
                      {video.target_platforms?.join(', ')}
                    </Typography>
                  </div>

                  {/* Add Button */}
                  <Button
                    size="sm"
                    onClick={() => handleToggleVideo(video)}
                    variant={video.isExisting ? 'outline' : 'default'}
                  >
                    {video.isExisting ? 'Đã thêm' : 'Thêm'}
                  </Button>
                </div>
              ))}
              {hasNextPage && (
                <div ref={loadMoreRef} className="h-10">
                  {isFetchingNextPage && (
                    <div className="flex items-center justify-center">
                      <Typography variant="small" className="font-mono text-zinc-500">
                        Đang tải thêm...
                      </Typography>
                    </div>
                  )}
                  {!isFetchingNextPage && hasNextPage && (
                    <div className="flex items-center justify-center">
                      <Typography variant="small" className="font-mono text-zinc-500">
                        Cuộn xuống để tải thêm
                      </Typography>
                    </div>
                  )}
                </div>
              )}
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
