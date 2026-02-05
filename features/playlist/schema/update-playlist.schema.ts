import z from 'zod';

export const updatePlaylistSchema = z.object({
  name: z.string().min(1, 'Tên playlist không được để trống'),
  description: z.string().optional(),
  video_ids: z.array(z.string()).min(1, 'Video không được để trống'),
  thumbnail: z.string().optional(),
});

export type UpdatePlaylistSchema = z.infer<typeof updatePlaylistSchema>;
