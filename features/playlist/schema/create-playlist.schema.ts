import z from 'zod';

export const createPlaylistSchema = z.object({
  name: z.string().min(1, 'Tên playlist không được để trống'),
  description: z.string().optional(),
  video_ids: z.array(z.string()).min(1, 'Video không được để trống'),
  thumbnail: z.string().optional(),
});

export type CreatePlaylistSchema = z.infer<typeof createPlaylistSchema>;
