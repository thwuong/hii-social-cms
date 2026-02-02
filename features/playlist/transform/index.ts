import { ContentItem, MediaType } from '@/shared';
import { PlaylistDetailDto, PlaylistDto, PlaylistVideoDto } from '../dto';
import { Playlist, PlaylistContent } from '../types';

const transformPlaylistVideo = (content: PlaylistVideoDto): PlaylistContent => {
  return {
    id: content.video_id,
    video_id: content.video_id,
    title: content.video_title,
    thumbnail_url: content.video_thumbnail,
    duration: content.video_duration,
    position: content.position,
    created_at: content.added_at,
    url: content.video.media[0].url,
    media: content.video.media,
    type: content.video.type as MediaType,
    platforms: content.video.platforms || [],
  };
};

const transformPlaylist = (playlist: PlaylistDto): Playlist => {
  return {
    created_at: playlist.created_at,
    created_by: playlist.created_by,
    description: playlist.description,
    id: playlist.id,
    name: playlist.name,
    thumbnail_url: playlist.thumbnail,
    updated_at: playlist.updated_at,
    video_count: playlist.video_count,
  };
};

export const transformContentToPlaylistVideo = (
  content: ContentItem,
  position: number
): PlaylistContent => {
  return {
    id: content.id,
    video_id: content.id,
    title: content.title,
    thumbnail_url: content.thumbnail_url || '',
    duration: 0,
    position,
    created_at: content.created_at,
    url: content.media?.[0]?.url || '',
    media: content.media || [],
    type: content.media_type as MediaType,
    platforms: content.target_platforms || [],
  };
};

export const transformPlaylistList = (playlists: PlaylistDto[]): Playlist[] => {
  return playlists.map(transformPlaylist);
};

export const transformPlaylistVideoList = (videos: PlaylistVideoDto[]): PlaylistContent[] => {
  return videos.map(transformPlaylistVideo);
};

export const transformPlaylistDetail = (playlist: PlaylistDetailDto): Playlist => {
  return {
    ...transformPlaylist(playlist.playlist),
    contents: transformPlaylistVideoList(playlist.videos),
  };
};
