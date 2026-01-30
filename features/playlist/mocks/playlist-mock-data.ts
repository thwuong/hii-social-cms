/**
 * Mock Data for Playlist Feature
 *
 * Use for development, testing, and demos
 */

import type { Playlist, PlaylistVideo } from '../types';

/**
 * Mock Playlist Videos
 */
export const mockPlaylistVideos: PlaylistVideo[] = [
  {
    id: 'pv-1',
    video_id: 'vid-001',
    title: 'Hướng Dẫn React Query - Phần 1',
    thumbnail_url: 'https://picsum.photos/seed/video1/400/225',
    duration: 1245, // 20:45
    position: 0,
    created_at: '2026-01-20T10:30:00Z',
  },
  {
    id: 'pv-2',
    video_id: 'vid-002',
    title: 'TypeScript Best Practices 2026',
    thumbnail_url: 'https://picsum.photos/seed/video2/400/225',
    duration: 1820, // 30:20
    position: 1,
    created_at: '2026-01-20T11:00:00Z',
  },
  {
    id: 'pv-3',
    video_id: 'vid-003',
    title: 'Xây Dựng API với Node.js và Express',
    thumbnail_url: 'https://picsum.photos/seed/video3/400/225',
    duration: 2145, // 35:45
    position: 2,
    created_at: '2026-01-20T14:30:00Z',
  },
  {
    id: 'pv-4',
    video_id: 'vid-004',
    title: 'CSS Grid Layout - Toàn Tập',
    thumbnail_url: 'https://picsum.photos/seed/video4/400/225',
    duration: 1680, // 28:00
    position: 3,
    created_at: '2026-01-21T09:00:00Z',
  },
  {
    id: 'pv-5',
    video_id: 'vid-005',
    title: 'React Hooks Deep Dive',
    thumbnail_url: 'https://picsum.photos/seed/video5/400/225',
    duration: 2400, // 40:00
    position: 4,
    created_at: '2026-01-21T10:30:00Z',
  },
  {
    id: 'pv-6',
    video_id: 'vid-006',
    title: 'Next.js 14 - Server Components',
    thumbnail_url: 'https://picsum.photos/seed/video6/400/225',
    duration: 1950, // 32:30
    position: 5,
    created_at: '2026-01-21T15:00:00Z',
  },
  {
    id: 'pv-7',
    video_id: 'vid-007',
    title: 'Tailwind CSS Tips & Tricks',
    thumbnail_url: 'https://picsum.photos/seed/video7/400/225',
    duration: 1320, // 22:00
    position: 6,
    created_at: '2026-01-22T08:30:00Z',
  },
  {
    id: 'pv-8',
    video_id: 'vid-008',
    title: 'Authentication với JWT',
    thumbnail_url: 'https://picsum.photos/seed/video8/400/225',
    duration: 2700, // 45:00
    position: 7,
    created_at: '2026-01-22T11:00:00Z',
  },
  {
    id: 'pv-9',
    video_id: 'vid-009',
    title: 'Database Design Principles',
    thumbnail_url: 'https://picsum.photos/seed/video9/400/225',
    duration: 3120, // 52:00
    position: 8,
    created_at: '2026-01-22T14:30:00Z',
  },
  {
    id: 'pv-10',
    video_id: 'vid-010',
    title: 'GraphQL vs REST API',
    thumbnail_url: 'https://picsum.photos/seed/video10/400/225',
    duration: 1890, // 31:30
    position: 9,
    created_at: '2026-01-22T16:00:00Z',
  },
  {
    id: 'pv-11',
    video_id: 'vid-011',
    title: 'Docker Container Basics',
    thumbnail_url: 'https://picsum.photos/seed/video11/400/225',
    duration: 2250, // 37:30
    position: 10,
    created_at: '2026-01-23T09:00:00Z',
  },
  {
    id: 'pv-12',
    video_id: 'vid-012',
    title: 'Testing với Jest và React Testing Library',
    thumbnail_url: 'https://picsum.photos/seed/video12/400/225',
    duration: 2580, // 43:00
    position: 11,
    created_at: '2026-01-23T11:30:00Z',
  },
];

/**
 * Mock Playlists
 */
export const mockPlaylists: Playlist[] = [
  {
    id: 'pl-1',
    name: 'React Master Class 2026',
    description:
      'Khóa học React từ cơ bản đến nâng cao, bao gồm hooks, context, và state management.',
    video_count: 5,
    thumbnail_url: 'https://picsum.photos/seed/playlist1/400/225',
    videos: mockPlaylistVideos.slice(0, 5),
    created_at: '2026-01-20T10:00:00Z',
    updated_at: '2026-01-23T14:00:00Z',
    created_by: 'user-123',
  },
  {
    id: 'pl-2',
    name: 'Backend Development Path',
    description: 'Series hướng dẫn xây dựng backend với Node.js, Express, và cơ sở dữ liệu.',
    video_count: 4,
    thumbnail_url: 'https://picsum.photos/seed/playlist2/400/225',
    videos: [
      mockPlaylistVideos[2], // Node.js
      mockPlaylistVideos[7], // JWT
      mockPlaylistVideos[8], // Database
      mockPlaylistVideos[9], // GraphQL
    ].map((v, index) => ({ ...v, position: index })),
    created_at: '2026-01-21T09:00:00Z',
    updated_at: '2026-01-22T16:30:00Z',
    created_by: 'user-123',
  },
  {
    id: 'pl-3',
    name: 'CSS & Styling Complete',
    description: 'Tất cả về CSS, từ fundamentals đến Grid, Flexbox, và Tailwind CSS.',
    video_count: 2,
    thumbnail_url: 'https://picsum.photos/seed/playlist3/400/225',
    videos: [mockPlaylistVideos[3], mockPlaylistVideos[6]].map((v, index) => ({
      ...v,
      position: index,
    })),
    created_at: '2026-01-21T14:00:00Z',
    updated_at: '2026-01-22T10:00:00Z',
    created_by: 'user-456',
  },
  {
    id: 'pl-4',
    name: 'TypeScript for Professionals',
    description: 'TypeScript best practices, advanced types, và practical examples.',
    video_count: 1,
    thumbnail_url: 'https://picsum.photos/seed/playlist4/400/225',
    videos: [mockPlaylistVideos[1]],
    created_at: '2026-01-22T08:00:00Z',
    updated_at: '2026-01-22T08:00:00Z',
    created_by: 'user-789',
  },
  {
    id: 'pl-5',
    name: 'Modern Web Development Stack',
    description: 'Next.js, React, TypeScript, và các công cụ hiện đại cho web development.',
    video_count: 3,
    thumbnail_url: 'https://picsum.photos/seed/playlist5/400/225',
    videos: [mockPlaylistVideos[5], mockPlaylistVideos[1], mockPlaylistVideos[0]].map(
      (v, index) => ({ ...v, position: index })
    ),
    created_at: '2026-01-22T15:00:00Z',
    updated_at: '2026-01-23T09:30:00Z',
    created_by: 'user-123',
  },
  {
    id: 'pl-6',
    name: 'DevOps Essentials',
    description: 'Docker, CI/CD, và deployment strategies cho modern applications.',
    video_count: 1,
    thumbnail_url: 'https://picsum.photos/seed/playlist6/400/225',
    videos: [mockPlaylistVideos[10]],
    created_at: '2026-01-23T10:00:00Z',
    updated_at: '2026-01-23T10:00:00Z',
    created_by: 'user-456',
  },
  {
    id: 'pl-7',
    name: 'Testing & Quality Assurance',
    description: 'Unit testing, integration testing, và E2E testing với modern tools.',
    video_count: 1,
    thumbnail_url: 'https://picsum.photos/seed/playlist7/400/225',
    videos: [mockPlaylistVideos[11]],
    created_at: '2026-01-23T12:00:00Z',
    updated_at: '2026-01-23T12:00:00Z',
    created_by: 'user-789',
  },
  {
    id: 'pl-8',
    name: 'Fullstack JavaScript',
    description: 'Từ frontend đến backend với JavaScript/TypeScript ecosystem.',
    video_count: 6,
    thumbnail_url: 'https://picsum.photos/seed/playlist8/400/225',
    videos: [
      mockPlaylistVideos[0],
      mockPlaylistVideos[2],
      mockPlaylistVideos[5],
      mockPlaylistVideos[7],
      mockPlaylistVideos[8],
      mockPlaylistVideos[11],
    ].map((v, index) => ({ ...v, position: index })),
    created_at: '2026-01-23T14:00:00Z',
    updated_at: '2026-01-23T15:30:00Z',
    created_by: 'user-123',
  },
];

/**
 * Mock Available Videos (for AddVideoModal)
 */
export const mockAvailableVideos = [
  {
    id: 'vid-101',
    title: 'Vue.js 3 Composition API',
    thumbnail_url: 'https://picsum.photos/seed/video101/400/225',
    source_platform: 'YouTube',
    duration: 1800,
    created_at: '2026-01-23T16:00:00Z',
  },
  {
    id: 'vid-102',
    title: 'Angular Standalone Components',
    thumbnail_url: 'https://picsum.photos/seed/video102/400/225',
    source_platform: 'Vimeo',
    duration: 2100,
    created_at: '2026-01-23T17:00:00Z',
  },
  {
    id: 'vid-103',
    title: 'Svelte for Beginners',
    thumbnail_url: 'https://picsum.photos/seed/video103/400/225',
    source_platform: 'YouTube',
    duration: 1650,
    created_at: '2026-01-23T18:00:00Z',
  },
  {
    id: 'vid-104',
    title: 'Astro Static Site Generator',
    thumbnail_url: 'https://picsum.photos/seed/video104/400/225',
    source_platform: 'YouTube',
    duration: 1920,
    created_at: '2026-01-23T19:00:00Z',
  },
  {
    id: 'vid-105',
    title: 'Web Performance Optimization',
    thumbnail_url: 'https://picsum.photos/seed/video105/400/225',
    source_platform: 'YouTube',
    duration: 2450,
    created_at: '2026-01-23T20:00:00Z',
  },
];

/**
 * Helper: Get playlist by ID
 */
export function getMockPlaylistById(id: string): Playlist | undefined {
  return mockPlaylists.find((playlist) => playlist.id === id);
}

/**
 * Helper: Get videos for playlist
 */
export function getMockPlaylistVideos(playlistId: string): PlaylistVideo[] {
  const playlist = getMockPlaylistById(playlistId);
  return playlist?.videos || [];
}

/**
 * Helper: Add video to playlist
 */
export function addMockVideoToPlaylist(playlistId: string, videoId: string): Playlist | undefined {
  const playlist = getMockPlaylistById(playlistId);
  if (!playlist) return undefined;

  // Find video from available videos
  const availableVideo = mockAvailableVideos.find((v) => v.id === videoId);
  if (!availableVideo) return undefined;

  // Create playlist video
  const newPlaylistVideo: PlaylistVideo = {
    id: `pv-${Date.now()}`,
    video_id: availableVideo.id,
    title: availableVideo.title,
    thumbnail_url: availableVideo.thumbnail_url,
    duration: availableVideo.duration,
    position: playlist.videos?.length || 0,
    created_at: new Date().toISOString(),
  };

  // Add to playlist
  const updatedPlaylist = {
    ...playlist,
    videos: [...(playlist.videos || []), newPlaylistVideo],
    video_count: (playlist.video_count || 0) + 1,
    updated_at: new Date().toISOString(),
  };

  // Update mock data
  const index = mockPlaylists.findIndex((p) => p.id === playlistId);
  if (index !== -1) {
    mockPlaylists[index] = updatedPlaylist;
  }

  return updatedPlaylist;
}

/**
 * Helper: Remove video from playlist
 */
export function removeMockVideoFromPlaylist(
  playlistId: string,
  videoId: string
): Playlist | undefined {
  const playlist = getMockPlaylistById(playlistId);
  if (!playlist) return undefined;

  // Filter out video
  const updatedVideos = (playlist.videos || [])
    .filter((v) => v.video_id !== videoId)
    .map((v, index) => ({ ...v, position: index })); // Reindex positions

  const updatedPlaylist = {
    ...playlist,
    videos: updatedVideos,
    video_count: updatedVideos.length,
    updated_at: new Date().toISOString(),
  };

  // Update mock data
  const index = mockPlaylists.findIndex((p) => p.id === playlistId);
  if (index !== -1) {
    mockPlaylists[index] = updatedPlaylist;
  }

  return updatedPlaylist;
}

/**
 * Helper: Reorder videos in playlist
 */
export function reorderMockPlaylistVideos(
  playlistId: string,
  videoIds: string[]
): Playlist | undefined {
  const playlist = getMockPlaylistById(playlistId);
  if (!playlist || !playlist.videos) return undefined;

  // Create map of videos by video_id
  const videoMap = new Map(playlist.videos.map((v) => [v.video_id, v]));

  // Reorder based on videoIds array
  const reorderedVideos = videoIds
    .map((videoId) => videoMap.get(videoId))
    .filter((v): v is PlaylistVideo => v !== undefined)
    .map((v, index) => ({ ...v, position: index }));

  const updatedPlaylist = {
    ...playlist,
    videos: reorderedVideos,
    updated_at: new Date().toISOString(),
  };

  // Update mock data
  const index = mockPlaylists.findIndex((p) => p.id === playlistId);
  if (index !== -1) {
    mockPlaylists[index] = updatedPlaylist;
  }

  return updatedPlaylist;
}

/**
 * Helper: Create new playlist
 */
export function createMockPlaylist(payload: {
  name: string;
  description?: string;
  video_ids?: string[];
}): Playlist {
  const newPlaylist: Playlist = {
    id: `pl-${Date.now()}`,
    name: payload.name,
    description: payload.description,
    video_count: payload.video_ids?.length || 0,
    thumbnail_url: 'https://picsum.photos/seed/new/400/225',
    videos: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 'user-123',
  };

  // Add videos if provided
  if (payload.video_ids && payload.video_ids.length > 0) {
    const videos = payload.video_ids
      .map((videoId, index) => {
        const availableVideo = mockAvailableVideos.find((v) => v.id === videoId);
        if (!availableVideo) return null;

        return {
          id: `pv-${Date.now()}-${index}`,
          video_id: availableVideo.id,
          title: availableVideo.title,
          thumbnail_url: availableVideo.thumbnail_url,
          duration: availableVideo.duration,
          position: index,
          created_at: new Date().toISOString(),
        };
      })
      .filter((v): v is PlaylistVideo => v !== null);

    newPlaylist.videos = videos;
    newPlaylist.thumbnail_url = videos[0]?.thumbnail_url || newPlaylist.thumbnail_url;
  }

  // Add to mock data
  mockPlaylists.push(newPlaylist);

  return newPlaylist;
}

/**
 * Helper: Update playlist
 */
export function updateMockPlaylist(
  playlistId: string,
  payload: { name?: string; description?: string }
): Playlist | undefined {
  const playlist = getMockPlaylistById(playlistId);
  if (!playlist) return undefined;

  const updatedPlaylist = {
    ...playlist,
    ...(payload.name && { name: payload.name }),
    ...(payload.description !== undefined && { description: payload.description }),
    updated_at: new Date().toISOString(),
  };

  // Update mock data
  const index = mockPlaylists.findIndex((p) => p.id === playlistId);
  if (index !== -1) {
    mockPlaylists[index] = updatedPlaylist;
  }

  return updatedPlaylist;
}

/**
 * Helper: Delete playlist
 */
export function deleteMockPlaylist(playlistId: string): boolean {
  const index = mockPlaylists.findIndex((p) => p.id === playlistId);
  if (index === -1) return false;

  mockPlaylists.splice(index, 1);
  return true;
}

/**
 * Export all mock data and helpers
 */
export const playlistMocks = {
  playlists: mockPlaylists,
  videos: mockPlaylistVideos,
  availableVideos: mockAvailableVideos,
  getPlaylistById: getMockPlaylistById,
  getPlaylistVideos: getMockPlaylistVideos,
  addVideo: addMockVideoToPlaylist,
  removeVideo: removeMockVideoFromPlaylist,
  reorderVideos: reorderMockPlaylistVideos,
  createPlaylist: createMockPlaylist,
  updatePlaylist: updateMockPlaylist,
  deletePlaylist: deleteMockPlaylist,
};
