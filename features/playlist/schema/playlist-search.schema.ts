import { SortOrder } from '@/shared';
import z from 'zod';

export const playlistSearchSchema = z.object({
  search: z.string().optional().default(''),
  limit: z.number().optional().default(20),
  // sort: z.nativeEnum(SortOrder).optional().default(SortOrder.ASC),
});

export type PlaylistSearchSchema = z.infer<typeof playlistSearchSchema>;
