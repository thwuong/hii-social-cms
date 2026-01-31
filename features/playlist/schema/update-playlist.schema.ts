import z from 'zod';

export const updatePlaylistSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  video_ids: z.array(z.string()).optional(),
  thumbnail: z.string().optional(),
});

export type UpdatePlaylistSchema = z.infer<typeof updatePlaylistSchema>;
