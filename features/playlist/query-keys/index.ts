import { PlaylistListQueryParamsDto } from '../dto';

/**
 * Playlist Query Keys
 */
export const playlistKeys = {
  all: ['playlists'] as const,
  lists: () => [...playlistKeys.all, 'list'] as const,
  list: (params: PlaylistListQueryParamsDto) => [...playlistKeys.lists(), params] as const,
  details: () => [...playlistKeys.all, 'detail'] as const,
  detail: (id: string) => [...playlistKeys.details(), id] as const,
};
