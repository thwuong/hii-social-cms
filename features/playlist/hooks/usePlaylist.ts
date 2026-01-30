import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { playlistKeys } from '../query-keys';
import { playlistService } from '../services/playlist-service';
import type {
  AddVideoToPlaylistPayload,
  CreatePlaylistPayload,
  DeleteVideoFromPlaylistPayload,
  ReorderPlaylistPayload,
  UpdatePlaylistPayload,
} from '../types';

/**
 * Get all playlists
 */
export function usePlaylists() {
  return useQuery({
    queryKey: playlistKeys.list(),
    queryFn: () => playlistService.getPlaylists(),
  });
}

/**
 * Get playlist by ID
 */
export function usePlaylist(id: string) {
  return useQuery({
    queryKey: playlistKeys.detail(id),
    queryFn: () => playlistService.getPlaylistById(id),
    enabled: !!id,
  });
}

/**
 * Create playlist
 */
export function useCreatePlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePlaylistPayload) => playlistService.createPlaylist(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: playlistKeys.lists() });
      toast.success('TẠO PLAYLIST THÀNH CÔNG');
    },
    onError: () => {
      toast.error('TẠO PLAYLIST THẤT BẠI');
    },
  });
}

/**
 * Update playlist
 */
export function useUpdatePlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePlaylistPayload }) =>
      playlistService.updatePlaylist(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: playlistKeys.lists() });
      queryClient.invalidateQueries({ queryKey: playlistKeys.detail(data.id) });
      toast.success('CẬP NHẬT PLAYLIST THÀNH CÔNG');
    },
    onError: () => {
      toast.error('CẬP NHẬT PLAYLIST THẤT BẠI');
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
      toast.success('XÓA PLAYLIST THÀNH CÔNG');
    },
    onError: () => {
      toast.error('XÓA PLAYLIST THẤT BẠI');
    },
  });
}

/**
 * Add video to playlist
 */
export function useAddVideoToPlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      playlistId,
      payload,
    }: {
      playlistId: string;
      payload: AddVideoToPlaylistPayload;
    }) => playlistService.addVideoToPlaylist(playlistId, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: playlistKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: playlistKeys.lists() });
      toast.success('THÊM VIDEO THÀNH CÔNG');
    },
    onError: () => {
      toast.error('THÊM VIDEO THẤT BẠI');
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
      payload: DeleteVideoFromPlaylistPayload;
    }) => playlistService.removeVideoFromPlaylist(playlistId, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: playlistKeys.detail(data.id) });
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
    mutationFn: ({
      playlistId,
      payload,
    }: {
      playlistId: string;
      payload: ReorderPlaylistPayload;
    }) => playlistService.reorderPlaylist(playlistId, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: playlistKeys.detail(data.id) });
      toast.success('THAY ĐỔI VỊ TRÍ THÀNH CÔNG');
    },
    onError: () => {
      toast.error('THAY ĐỔI VỊ TRÍ THẤT BẠI');
    },
  });
}
