import { MediaType } from '@/shared';
import { PlaylistDetailDto, PlaylistDto, PlaylistVideoDto } from '../dto';
import { Playlist, PlaylistContent } from '../types';

const transformPlaylistVideo = (video: PlaylistVideoDto): PlaylistContent => {
  return {
    id: video.video_id,
    video_id: video.video_id,
    title: video.video_title,
    thumbnail_url: video.video_thumbnail,
    duration: video.video_duration,
    position: video.position,
    created_at: video.added_at,
    url: video.video.media[0].url,
    media: video.video.media,
    type: video.video.type as MediaType,
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
