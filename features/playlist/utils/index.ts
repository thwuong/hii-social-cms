import { PlaylistContent } from '../types';

export const checkIsPlaylistPlatform = (playlistVideos: PlaylistContent[]) => {
  if (!playlistVideos?.length) return false;

  const normalize = (platforms?: string[]) => [...(platforms ?? [])].sort();

  const base = normalize(playlistVideos[0].platforms);

  return playlistVideos.slice(1).some((video) => {
    const current = normalize(video.platforms);

    if (base.length !== current.length) return true;

    return base.some((p, i) => p !== current[i]);
  });
};
