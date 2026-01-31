import { VideoPlayer, MediaType, ContentItem } from '@/shared';
import { MediaCarousel } from './media-carousel';

interface ContentBodyProps {
  content: ContentItem;
}

function ContentBody({ content }: ContentBodyProps) {
  const isVideo = content.media_type === MediaType.VIDEO || content.media_type === MediaType.REEL;
  const isArticle = content.media_type === MediaType.TEXT;

  // Video/Reel content
  if (isVideo) {
    return (
      <VideoPlayer
        url={content.media_url}
        poster={content.thumbnail_url}
        title={content.title}
        aspectRatio="9/16"
        className="video-mock"
      />
    );
  }

  // Article content with media carousel
  if (isArticle && content.media && content.media.length > 0) {
    return (
      <MediaCarousel
        media={content.media}
        title={content.title}
        aspectRatio="custom"
        customAspectRatio="9/16"
        objectFit="contain"
      />
    );
  }

  // Fallback for other media types
  return (
    <div className="flex h-96 items-center justify-center border border-white/10 bg-black">
      <div className="text-center">
        <p className="font-mono text-sm text-zinc-500 uppercase">{content.media_type}</p>
        {content.media_url && (
          <a
            href={content.media_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-xs text-zinc-400 underline hover:text-white"
          >
            View Media
          </a>
        )}
      </div>
    </div>
  );
}

export default ContentBody;
