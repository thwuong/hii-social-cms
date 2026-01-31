import { create } from 'zustand';
import type { Playlist, PlaylistContent } from '../types';

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
  playlistVideos: PlaylistContent[];
  setPlaylistVideos: (videos: PlaylistContent[]) => void;

  // Active video in player
  activeVideoId: string | null;
  setActiveVideoId: (id: string | null) => void;

  // UI State
  isAddVideoModalOpen: boolean;
  setIsAddVideoModalOpen: (isOpen: boolean) => void;

  isCreatePlaylistModalOpen: boolean;
  setIsCreatePlaylistModalOpen: (isOpen: boolean) => void;

  addVideoToPlaylist: (playlistId: string, video: PlaylistContent) => void;
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

  addVideoToPlaylist: (playlistId, video: PlaylistContent) =>
    set((state) => ({
      playlistVideos: [...state.playlistVideos, video],
    })),
  removeVideoFromPlaylist: (playlistId, videoId) =>
    set((state) => {
      const newVideos = state.playlistVideos.filter((video) => video.id !== videoId);
      const formattedVideos = newVideos.map((v, index) => ({
        ...v,
        position: index + 1,
      }));
      return { playlistVideos: formattedVideos };
    }),
}));
