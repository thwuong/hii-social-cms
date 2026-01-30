import { api } from '@/services';
import type {
  AddVideoToPlaylistPayload,
  CreatePlaylistPayload,
  DeleteVideoFromPlaylistPayload,
  Playlist,
  PlaylistDetailResponse,
  PlaylistListResponse,
  ReorderPlaylistPayload,
  UpdatePlaylistPayload,
} from '../types';

/**
 * Playlist Service
 *
 * API calls for playlist management
 */

class PlaylistService {
  private baseUrl = 'playlists';

  /**
   * Get all playlists
   */
  async getPlaylists(): Promise<Playlist[]> {
    const response = await api.get<PlaylistListResponse>(this.baseUrl);
    return response.data;
  }

  /**
   * Get playlist by ID
   */
  async getPlaylistById(id: string): Promise<Playlist> {
    const response = await api.get<PlaylistDetailResponse>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Create new playlist
   */
  async createPlaylist(payload: CreatePlaylistPayload): Promise<Playlist> {
    const response = await api.post<PlaylistDetailResponse>(this.baseUrl, payload);
    return response.data;
  }

  /**
   * Update playlist
   */
  async updatePlaylist(id: string, payload: UpdatePlaylistPayload): Promise<Playlist> {
    const response = await api.put<PlaylistDetailResponse>(`${this.baseUrl}/${id}`, payload);
    return response.data;
  }

  /**
   * Delete playlist
   */
  async deletePlaylist(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Add video to playlist
   */
  async addVideoToPlaylist(
    playlistId: string,
    payload: AddVideoToPlaylistPayload
  ): Promise<Playlist> {
    const response = await api.post<PlaylistDetailResponse>(
      `${this.baseUrl}/${playlistId}/videos`,
      payload
    );
    return response.data;
  }

  /**
   * Remove video from playlist
   */
  async removeVideoFromPlaylist(
    playlistId: string,
    payload: DeleteVideoFromPlaylistPayload
  ): Promise<Playlist> {
    const response = await api.delete<PlaylistDetailResponse>(
      `${this.baseUrl}/${playlistId}/videos/${payload.video_id}`
    );
    return response.data;
  }

  /**
   * Reorder videos in playlist
   */
  async reorderPlaylist(playlistId: string, payload: ReorderPlaylistPayload): Promise<Playlist> {
    const response = await api.patch<PlaylistDetailResponse>(
      `${this.baseUrl}/${playlistId}/reorder`,
      payload
    );
    return response.data;
  }
}

export const playlistService = new PlaylistService();
