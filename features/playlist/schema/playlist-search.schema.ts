import { SortOrder } from '@/shared';
import z from 'zod';

export const playlistSearchSchema = z.object({
  search: z.string().optional().default(''),
  limit: z.number().optional().default(20),
  sort: z.enum(['created_at', 'updated_at']).optional().default('created_at'),
  sorted: z.nativeEnum(SortOrder).optional().default(SortOrder.DESC),
});

export type PlaylistSearchSchema = z.infer<typeof playlistSearchSchema>;
