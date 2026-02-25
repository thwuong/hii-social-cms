import { createRoute } from '@tanstack/react-router';
import PlaylistDetailPage from '@/features/playlist/pages/playlist-detail-page';
import { mainLayoutRoute } from './_main';

export const playlistDetailRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/playlists/$playlistId',
  component: PlaylistDetailPage,
});
