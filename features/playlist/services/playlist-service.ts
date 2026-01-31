import { api } from '@/services';
import queryString from 'query-string';
import {
  AddVideosToPlaylistsDto,
  CreatePlaylistDto,
  DeleteVideoFromPlaylistDto,
  PlaylistDetailDto,
  PlaylistDetailResponseDto,
  PlaylistDto,
  PlaylistListQueryParamsDto,
  PlaylistListResponseDto,
  ReorderPlaylistDto,
  UpdatePlaylistDto,
} from '../dto';

/**
 * Playlist Service
 *
 * API calls for playlist management
 */

class PlaylistService {
  private baseUrl = 'playlists/dashboard';

  /**
   * Get all playlists
   */
  async getPlaylists(params: PlaylistListQueryParamsDto): Promise<PlaylistListResponseDto> {
    const searchParams = queryString.stringify(params);
    const response = await api.get<PlaylistListResponseDto>(`${this.baseUrl}/my`, { searchParams });
    return response;
  }

  /**
   * Get playlist by ID
   */
  async getPlaylistById(id: string): Promise<PlaylistDetailResponseDto> {
    const response = await api.get<PlaylistDetailResponseDto>(
      `${this.baseUrl}/${id}/videos/detail`
    );
    return response;
  }

  /**
   * Create new playlist
   */
  async createPlaylist(payload: CreatePlaylistDto): Promise<PlaylistDetailResponseDto> {
    const response = await api.post<PlaylistDetailResponseDto>(this.baseUrl, payload);
    return response;
  }

  /**
   * Update playlist
   */
  async updatePlaylist(id: string, payload: UpdatePlaylistDto): Promise<PlaylistDetailResponseDto> {
    const response = await api.put<PlaylistDetailResponseDto>(`${this.baseUrl}/${id}`, payload);
    return response;
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
  async addVideosToPlaylists(payload: AddVideosToPlaylistsDto): Promise<PlaylistDetailDto> {
    const response = await api.post<PlaylistDetailResponseDto>(
      `${this.baseUrl}/videos/batch`,
      payload
    );
    return response;
  }

  /**
   * Remove video from playlist
   */
  async removeVideoFromPlaylist(
    playlistId: string,
    payload: DeleteVideoFromPlaylistDto
  ): Promise<PlaylistDetailDto> {
    const response = await api.delete<PlaylistDetailResponseDto>(
      `${this.baseUrl}/${playlistId}/videos/${payload.video_id}`
    );
    return response;
  }

  /**
   * Reorder videos in playlist
   */
  async reorderPlaylist(
    playlistId: string,
    payload: ReorderPlaylistDto
  ): Promise<PlaylistDetailDto> {
    const response = await api.patch<PlaylistDetailResponseDto>(
      `${this.baseUrl}/${playlistId}/reorder`,
      payload
    );
    return response;
  }
}

export const playlistService = new PlaylistService();
