import {
  ContentItem,
  ContentStatus,
  MediaType,
  SourcePlatform,
  SourceType,
  STATUS_LABELS,
} from '@/shared';
import { Reel, Video } from '../types';

export const transformCrawlContent = (content: Video): ContentItem => {
  return {
    id: content.id.toString(),
    title: content.video_metadata?.title,
    short_description: content.video_metadata?.description,
    thumbnail_url: content.thumbnail_url,
    content_id: content.video_id,
    media_type: MediaType.VIDEO,
    media_url: content.storage_url,
    source_type: SourceType.CRAWL,
    source_platform: content.platform as SourcePlatform,
    target_platforms: [SourcePlatform.LALALA, SourcePlatform.VOTEME, SourcePlatform.BOOKING],
    original_source_url: content.original_url,
    created_at: content.created_at,
    created_by: content.publish_metadata?.data?.updated_by,
    status: ContentStatus.DRAFT as ContentStatus,
    category: '',
    tags: content.publish_metadata?.data?.tags || [],
    visibility: 'public',
    moderation_notes: '',
    details_link: `/draft/detail`,
    categories: [],
    is_pending: content.is_pending || false,
    playlist_id: content.video_metadata?.playlist_id,
    language: content.publish_metadata?.data?.language || '',
    country: content.publish_metadata?.data?.country || [],
  };
};

export const transformReelContent = (content: Reel): ContentItem => {
  return {
    id: content.id,
    title: content.title,
    short_description: content.description,
    thumbnail_url: content.thumbnail?.url,
    content_id: content.id,
    media_type: content.type as MediaType,
    media_url: content.media?.[0].url,
    source_type: SourceType.MANUAL,
    source_platform: content.type as SourcePlatform,
    target_platforms: content.platforms as SourcePlatform[],
    original_source_url: '',
    created_at: content.created_at,
    created_by: content.updated_by,
    approving_status: content.approving_status as ContentStatus,
    status: content.approving_status as ContentStatus,
    category: content.type,
    tags: content.tags || [],
    visibility: 'public',
    moderation_notes: content.reason,
    details_link: `/content/detail`,
    scheduled_at: content.scheduled_at,
    categories: content.categories || [],
    media: content.media || [],
    is_pending: content.is_pending || false,
    playlist_id: content.playlist,
    language: content.language || '',
    country: content.country || [],
  };
};

export const transformStatusLabel = (status: string) => {
  return STATUS_LABELS[status as ContentStatus];
};

export const checkIsPlaylistPlatform = (playlistVideos: ContentItem[]) => {
  if (!playlistVideos?.length) return false;

  const normalize = (platforms?: string[]) => [...(platforms ?? [])].sort();

  const base = normalize(playlistVideos[0].target_platforms);

  return playlistVideos.slice(1).some((video) => {
    const current = normalize(video.target_platforms);

    if (base.length !== current.length) return true;

    return base.some((p, i) => p !== current[i]);
  });
};

export const detectTags = (title?: string) => {
  if (!title) return [];
  const tags = title.match(/#([\p{L}\p{N}_]+)/gu) || [];
  return tags;
};
