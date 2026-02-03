export interface LogResponseDataDto {
  logs: LogEntryDto[];
  meta: MetaDataDto;
}

export interface MetaDataDto {
  current_page: number;
  per_page: number;
  total_pages: number;
  total_items: number;
}

export interface LogEntryDto {
  id: string;
  who: string;
  email: string;
  action: string;
  before: any | null;
  after: ReelAfterStateDto;
  created_at: string;
  updated_at: string;
}

export interface ReelAfterStateDto {
  reelbaseinfo: ReelBaseInfoDto;
  owner: any | null;
  likes: number;
  dislikes: number;
  views: number;
  total_unread_comments: number;
  totalcomments: number;
  oldest_unread_comment: any | null;
  liked: boolean;
  is_trending: boolean;
}

export interface ReelBaseInfoDto {
  _id: string;
  title: string;
  type: string;
  description: string;
  owner_id: string;
  content: string;
  language: string;
  categories: string[];
  platforms: string[];
  media: MediaAssetDto[];
  thumbnail: MediaAssetDto;
  sound: MediaAssetDto;
  tags: string[];
  status: string;
  approving_status: string;
  participants: any[];
  is_allow_comment: boolean;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
  scheduled_at: string | null;
  notification_status: string;
  crawler_id: string;
  is_internal_owner: boolean;
  metadata: ReelMetadataDto;
}

export interface MediaAssetDto {
  type: string;
  url: string;
  duration: number | null;
  poster: string;
  download_url: string;
}

export interface ReelMetadataDto {
  targetUrl: string;
  channelId: number;
  name: string;
  tags: string[];
  privacy: number;
  nsfw: boolean;
  waitTranscoding: boolean;
}
