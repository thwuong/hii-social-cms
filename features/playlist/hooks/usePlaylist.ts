import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { playlistKeys } from '../query-keys';
import { playlistService } from '../services/playlist-service';

import {
  AddVideosToPlaylistsDto,
  CreatePlaylistDto,
  DeleteVideoFromPlaylistDto,
  PlaylistListQueryParamsDto,
  ReorderPlaylistDto,
  UpdatePlaylistDto,
} from '../dto';
import { transformPlaylistDetail, transformPlaylistList } from '../transform';

/**
 * Get all playlists
 */
export function usePlaylists(params: PlaylistListQueryParamsDto) {
  const playlistsQuery = useInfiniteQuery({
    queryKey: playlistKeys.list(params),
    queryFn: ({ pageParam = '' }) => playlistService.getPlaylists({ ...params, cursor: pageParam }),
    getNextPageParam: (lastPage) => (lastPage.next_cursor ? lastPage.next_cursor : undefined),
    initialPageParam: '',
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  return {
    ...playlistsQuery,
    data:
      playlistsQuery.data?.pages.flatMap((page) => transformPlaylistList(page.playlists || [])) ||
      [],
  };
}

/**
 * Get playlist by ID
 */
export function usePlaylist(id: string) {
  const playlistQuery = useQuery({
    queryKey: playlistKeys.detail(id),
    queryFn: () => playlistService.getPlaylistById(id),
    enabled: !!id,
  });
  return {
    ...playlistQuery,
    data: playlistQuery.data ? transformPlaylistDetail(playlistQuery.data) : null,
  };
}

/**
 * Create playlist
 */
export function useCreatePlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePlaylistDto) => playlistService.createPlaylist(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: playlistKeys.lists() });
    },
  });
}

/**
 * Update playlist
 */
export function useUpdatePlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePlaylistDto }) =>
      playlistService.updatePlaylist(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: playlistKeys.lists() });
      queryClient.invalidateQueries({ queryKey: playlistKeys.detail(data?.playlist?.id || '') });
    },
  });
}

/**
 * Delete playlist
 */
export function useDeletePlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => playlistService.deletePlaylist(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: playlistKeys.lists() });
    },
  });
}

/**
 * Add video to playlist
 */
export function useAddVideosToPlaylists() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ payload }: { payload: AddVideosToPlaylistsDto }) =>
      playlistService.addVideosToPlaylists(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: playlistKeys.lists() });
      toast.success('THÊM VIDEO VÀO PLAYLIST THÀNH CÔNG');
    },
    onError: () => {
      toast.error('THÊM VIDEO VÀO PLAYLIST THẤT BẠI');
    },
  });
}

/**
 * Remove video from playlist
 */
export function useRemoveVideoFromPlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      playlistId,
      payload,
    }: {
      playlistId: string;
      payload: DeleteVideoFromPlaylistDto;
    }) => playlistService.removeVideoFromPlaylist(playlistId, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: playlistKeys.detail(data?.playlist?.id || '') });
      queryClient.invalidateQueries({ queryKey: playlistKeys.lists() });
      toast.success('XÓA VIDEO THÀNH CÔNG');
    },
    onError: () => {
      toast.error('XÓA VIDEO THẤT BẠI');
    },
  });
}

/**
 * Reorder videos in playlist
 */
export function useReorderPlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ playlistId, payload }: { playlistId: string; payload: ReorderPlaylistDto }) =>
      playlistService.reorderPlaylist(playlistId, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: playlistKeys.detail(data?.playlist?.id || '') });
      toast.success('THAY ĐỔI VỊ TRÍ THÀNH CÔNG');
    },
    onError: () => {
      toast.error('THAY ĐỔI VỊ TRÍ THẤT BẠI');
    },
  });
}
