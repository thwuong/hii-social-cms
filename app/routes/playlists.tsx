import { createRoute } from '@tanstack/react-router';
import PlaylistListPage from '@/features/playlist/pages/playlist-list-page';
import { mainLayoutRoute } from './_main';

export const playlistsRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/playlists',
  component: PlaylistListPage,
});
