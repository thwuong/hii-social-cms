/**
 * Playlist Types
 */

import { Media } from '@/features/content';
import { MediaType } from '@/shared';

export interface PlaylistContent {
  id: string;
  video_id: string;
  title: string;
  thumbnail_url: string;
  duration: number;
  position: number; // Order in playlist
  created_at: string;
  url: string;
  media: Media[];
  type: MediaType;
  platforms: string[];
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  video_count: number;
  thumbnail_url?: string; // First video thumbnail
  contents?: PlaylistContent[];
  created_at: string;
  updated_at: string;
  created_by: string;
}
