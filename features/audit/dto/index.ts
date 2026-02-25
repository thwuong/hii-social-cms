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
  ip_address: string;
  action: string;
  status: string;
  before: {
    items: ReelStateDto[];
  };
  after: {
    items: ReelStateDto[];
  };
  reason: string;
  created_at: string;
  updated_at: string;
}

export interface ReelStateDto {
  id: string;
  title: string;
  type: string;
  description: string;
  owner_id: string;
  content: string;
  language: string;
  status: string; // Vd: "private" ở before và "published" ở after
  approving_status: string;
  categories: string[];
  platforms: string[];
  tags: string[];
  media: MediaDetailsDto[];
  thumbnail: MediaDetailsDto;
  sound: MediaDetailsDto;
  metadata: ReelMetadataDto;
  is_internal_owner: boolean;
  is_allow_comment: boolean;
  is_hidden: boolean;
  peer_tube_video_uuid: string;
  crawler_id: string;
  notification_status: string;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
  scheduled_at: string | null;
  participants: any[];
}

export interface MediaDetailsDto {
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
