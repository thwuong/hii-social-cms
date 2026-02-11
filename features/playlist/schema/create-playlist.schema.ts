import z from 'zod';

export const createPlaylistSchema = z.object({
  name: z
    .string()
    .min(1, 'Tên playlist không được để trống')
    .max(100, 'Tên playlist không được vượt quá 100 ký tự')
    .trim(),
  description: z.string().min(0).max(256, 'Mô tả không được vượt quá 256 ký tự').trim(),
  video_ids: z.array(z.string()).min(1, 'Video không được để trống'),
  thumbnail: z.string().optional(),
});

export type CreatePlaylistSchema = z.infer<typeof createPlaylistSchema>;
