import z from 'zod';

export const createPlaylistSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  video_ids: z.array(z.string()).optional(),
  thumbnail: z.string().optional(),
});

export type CreatePlaylistSchema = z.infer<typeof createPlaylistSchema>;
