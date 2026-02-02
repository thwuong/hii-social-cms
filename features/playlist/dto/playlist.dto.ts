import { Reel } from '@/features/content';

export interface PlaylistVideoDto {
  playlist_id: string;
  video_id: string;
  video_title: string;
  video_thumbnail: string;
  video_duration: number;
  position: number;
  added_by: string;
  added_at: string;
  video: Reel;
}
export interface PlaylistDto {
  id: string;
  name: string;
  description: string;
  created_by: string;
  status: string;
  visibility: string;
  thumbnail: string;
  video_count: number;
  total_views: number;
  total_likes: number;
  created_at: string;
  updated_at: string;
}
export interface PlaylistDetailDto {
  playlist: PlaylistDto;
  videos: PlaylistVideoDto[];
}

export interface CreatePlaylistDto {
  name: string;
  description?: string;
  video_ids: string[];
  thumbnail: string;
}

export interface UpdatePlaylistDto extends Partial<CreatePlaylistDto> {
  is_merged_platforms: boolean;
}

export interface AddVideosToPlaylistsDto {
  video_ids: string[];
  playlist_ids: string[];
  is_merged_platforms: boolean;
}

export interface ReorderPlaylistDto {
  video_ids: string[];
}

export interface DeleteVideoFromPlaylistDto {
  video_id: string;
}

export interface PlaylistListQueryParamsDto {
  cursor?: string;
  limit?: number;
  sort?: string;
  search?: string;
}

export interface PlaylistListResponseDto {
  playlists: PlaylistDto[];
  total: number;
  has_next: boolean;
  next_cursor: string;
  limit: number;
}

export interface PlaylistDetailResponseDto {
  playlist: PlaylistDto;
  videos: PlaylistVideoDto[];
}
