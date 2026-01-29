import {
  ContentItem,
  ContentStatus,
  MediaType,
  Reel,
  SourcePlatform,
  SourceType,
  Video,
} from '../types';

const checkScheduledAtValidTime = (scheduledAt: string) => {
  return new Date(scheduledAt).getTime() > new Date().getTime();
};

const contentStatus = (content: Reel) => {
  if (checkScheduledAtValidTime(content.scheduled_at)) {
    return ContentStatus.SCHEDULED;
  }
  if (content.status === ContentStatus.PUBLISHED) {
    return ContentStatus.PUBLISHED;
  }
  return content.approving_status as ContentStatus;
};

export const transformCrawlContent = (content: Video): ContentItem => {
  return {
    id: content.id.toString(),
    title: content.video_metadata.title,
    short_description: content.video_metadata.description,
    thumbnail_url: content.thumbnail_url,
    content_id: content.video_id,
    media_type: MediaType.VIDEO,
    media_url: content.storage_url,
    source_type: SourceType.CRAWL,
    source_platform: content.platform as SourcePlatform,
    target_platforms: [SourcePlatform.LALALA, SourcePlatform.VOTEME, SourcePlatform.BOOKING],
    original_source_url: content.original_url,
    created_at: content.created_at,
    created_by: content.publish_metadata.data.updated_by,
    status: ContentStatus.DRAFT as ContentStatus,
    category: '',
    tags: content.publish_metadata.data.tags || [],
    visibility: 'public',
    moderation_notes: '',
    details_link: `/review/detail`,
    categories: [],
  };
};

export const transformReelContent = (content: Reel): ContentItem => {
  return {
    id: content.id,
    title: content.title,
    short_description: content.description,
    thumbnail_url: content.thumbnail.url,
    content_id: content.id,
    media_type: content.media?.[0].type as MediaType,
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
    moderation_notes: '',
    details_link: `/content/detail`,
    scheduled_at: content.scheduled_at,
    categories: content.categories || [],
  };
};

export const LABEL_STATUS = {
  [ContentStatus.PENDING_REVIEW]: 'Chờ Duyệt',
  [ContentStatus.APPROVED]: 'Đã Duyệt',
  [ContentStatus.SCHEDULED]: 'Đã Lên Lịch',
  [ContentStatus.PUBLISHED]: 'Đã Đăng',
  [ContentStatus.REJECTED]: 'Bị Từ Chối',
  [ContentStatus.ALL]: 'Tất cả',
  [ContentStatus.DRAFT]: 'Nháp',
  [ContentStatus.ARCHIVED]: 'Lưu Trữ',
  [ContentStatus.PRIVATE]: 'Riêng Tư',
};

export const transformStatusLabel = (status: string) => {
  return LABEL_STATUS[status as ContentStatus];
};
