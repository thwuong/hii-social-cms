/**
 * Mock Service Hook
 *
 * Use mock data instead of real API calls
 * Toggle with environment variable or flag
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { playlistKeys } from '../query-keys';
import type {
  AddVideoToPlaylistPayload,
  CreatePlaylistPayload,
  Playlist,
  ReorderPlaylistPayload,
  UpdatePlaylistPayload,
} from '../types';
import {
  addMockVideoToPlaylist,
  createMockPlaylist,
  deleteMockPlaylist,
  getMockPlaylistById,
  mockAvailableVideos,
  mockPlaylists,
  removeMockVideoFromPlaylist,
  reorderMockPlaylistVideos,
  updateMockPlaylist,
} from './playlist-mock-data';

/**
 * Simulate API delay
 */
function delay(ms: number = 500): Promise<void> {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Use Mock Playlists Query
 */
export function useMockPlaylists() {
  return useQuery({
    queryKey: playlistKeys.list(),
    queryFn: async () => {
      await delay();
      return [...mockPlaylists]; // Return copy
    },
  });
}

/**
 * Use Mock Playlist Query
 */
export function useMockPlaylist(id: string) {
  return useQuery({
    queryKey: playlistKeys.detail(id),
    queryFn: async () => {
      await delay();
      const playlist = getMockPlaylistById(id);
      if (!playlist) {
        throw new Error('Playlist not found');
      }
      return { ...playlist }; // Return copy
    },
    enabled: !!id,
  });
}

/**
 * Use Mock Create Playlist Mutation
 */
export function useMockCreatePlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreatePlaylistPayload) => {
      await delay();
      return createMockPlaylist(payload);
    },
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
 * Use Mock Update Playlist Mutation
 */
export function useMockUpdatePlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdatePlaylistPayload }) => {
      await delay();
      const updated = updateMockPlaylist(id, payload);
      if (!updated) {
        throw new Error('Playlist not found');
      }
      return updated;
    },
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
 * Use Mock Delete Playlist Mutation
 */
export function useMockDeletePlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await delay();
      const deleted = deleteMockPlaylist(id);
      if (!deleted) {
        throw new Error('Playlist not found');
      }
      return id;
    },
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
 * Use Mock Add Video Mutation
 */
export function useMockAddVideoToPlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      playlistId,
      payload,
    }: {
      playlistId: string;
      payload: AddVideoToPlaylistPayload;
    }) => {
      await delay();
      const updated = addMockVideoToPlaylist(playlistId, payload.video_id);
      if (!updated) {
        throw new Error('Failed to add video');
      }
      return updated;
    },
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
 * Use Mock Remove Video Mutation
 */
export function useMockRemoveVideoFromPlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ playlistId, videoId }: { playlistId: string; videoId: string }) => {
      await delay();
      const updated = removeMockVideoFromPlaylist(playlistId, videoId);
      if (!updated) {
        throw new Error('Failed to remove video');
      }
      return updated;
    },
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
 * Use Mock Reorder Playlist Mutation
 */
export function useMockReorderPlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      playlistId,
      payload,
    }: {
      playlistId: string;
      payload: ReorderPlaylistPayload;
    }) => {
      await delay(200); // Faster for drag & drop
      const updated = reorderMockPlaylistVideos(playlistId, payload.video_ids);
      if (!updated) {
        throw new Error('Failed to reorder');
      }
      return updated;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: playlistKeys.detail(data.id) });
      toast.success('THAY ĐỔI VỊ TRÍ THÀNH CÔNG');
    },
    onError: () => {
      toast.error('THAY ĐỔI VỊ TRÍ THẤT BẠI');
    },
  });
}

export function useMockAvailableVideos() {
  return useQuery({
    queryKey: ['available-videos'],
    queryFn: async () => {
      await delay();
      return mockAvailableVideos;
    },
  });
}
/**
 * Export all mock hooks as object
 */
export const useMockPlaylistService = {
  usePlaylists: useMockPlaylists,
  usePlaylist: useMockPlaylist,
  useCreatePlaylist: useMockCreatePlaylist,
  useUpdatePlaylist: useMockUpdatePlaylist,
  useDeletePlaylist: useMockDeletePlaylist,
  useAddVideoToPlaylist: useMockAddVideoToPlaylist,
  useRemoveVideoFromPlaylist: useMockRemoveVideoFromPlaylist,
  useReorderPlaylist: useMockReorderPlaylist,
  useAvailableVideos: useMockAvailableVideos,
};
