import { create } from 'zustand';
import type { Playlist, PlaylistVideo } from '../types';

interface PlaylistState {
  // Selected videos for creating playlist
  selectedVideoIds: string[];
  setSelectedVideoIds: (ids: string[]) => void;
  toggleVideoSelection: (id: string) => void;
  clearSelection: () => void;

  // Current editing playlist
  currentPlaylist: Playlist | null;
  setCurrentPlaylist: (playlist: Playlist | null) => void;

  // Playlist videos (for detail page)
  playlistVideos: PlaylistVideo[];
  setPlaylistVideos: (videos: PlaylistVideo[]) => void;

  // Active video in player
  activeVideoId: string | null;
  setActiveVideoId: (id: string | null) => void;

  // UI State
  isAddVideoModalOpen: boolean;
  setIsAddVideoModalOpen: (isOpen: boolean) => void;

  isCreatePlaylistModalOpen: boolean;
  setIsCreatePlaylistModalOpen: (isOpen: boolean) => void;

  addVideoToPlaylist: (playlistId: string, video: PlaylistVideo) => void;
  removeVideoFromPlaylist: (playlistId: string, videoId: string) => void;
}

export const usePlaylistStore = create<PlaylistState>((set) => ({
  // Selection
  selectedVideoIds: [],
  setSelectedVideoIds: (ids) => set({ selectedVideoIds: ids }),
  toggleVideoSelection: (id) =>
    set((state) => ({
      selectedVideoIds: state.selectedVideoIds.includes(id)
        ? state.selectedVideoIds.filter((videoId) => videoId !== id)
        : [...state.selectedVideoIds, id],
    })),
  clearSelection: () => set({ selectedVideoIds: [] }),

  // Current playlist
  currentPlaylist: null,
  setCurrentPlaylist: (playlist) => set({ currentPlaylist: playlist }),

  // Playlist videos
  playlistVideos: [],
  setPlaylistVideos: (videos) => set({ playlistVideos: videos }),

  // Active video
  activeVideoId: null,
  setActiveVideoId: (id) => set({ activeVideoId: id }),

  // UI State
  isAddVideoModalOpen: false,
  setIsAddVideoModalOpen: (isOpen) => set({ isAddVideoModalOpen: isOpen }),

  isCreatePlaylistModalOpen: false,
  setIsCreatePlaylistModalOpen: (isOpen) => set({ isCreatePlaylistModalOpen: isOpen }),

  addVideoToPlaylist: (playlistId, video: PlaylistVideo) =>
    set((state) => ({
      playlistVideos: [...state.playlistVideos, video],
    })),
  removeVideoFromPlaylist: (playlistId, videoId) =>
    set((state) => ({
      playlistVideos: state.playlistVideos.filter((video) => video.id !== videoId),
    })),
}));
