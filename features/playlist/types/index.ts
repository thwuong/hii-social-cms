/**
 * Playlist Types
 */

export interface PlaylistVideo {
  id: string;
  video_id: string;
  title: string;
  thumbnail_url: string;
  duration: number;
  position: number; // Order in playlist
  created_at: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  video_count: number;
  thumbnail_url?: string; // First video thumbnail
  videos?: PlaylistVideo[];
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface CreatePlaylistPayload {
  name: string;
  description?: string;
  video_ids: string[]; // Initial videos
}

export interface UpdatePlaylistPayload {
  name?: string;
  description?: string;
}

export interface AddVideoToPlaylistPayload {
  video_id: string;
  position?: number;
}

export interface ReorderPlaylistPayload {
  video_ids: string[]; // Ordered array of video IDs
}

export interface DeleteVideoFromPlaylistPayload {
  video_id: string;
}

// Playlist list response
export interface PlaylistListResponse {
  data: Playlist[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
  };
}

// Playlist detail response
export interface PlaylistDetailResponse {
  data: Playlist;
}
