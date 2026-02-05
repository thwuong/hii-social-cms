import { SortOrder } from '@/shared/types';
import z from 'zod';

const draftContentSearchSchema = z.object({
  search: z.string().optional().default(''),
  page_size: z.number().optional().default(24),
  sort: z.string().optional().default('created_at'),
  sort_order: z.nativeEnum(SortOrder).optional().default(SortOrder.ASC),
  is_previewed: z.string().optional().default('false'),
});

export type DraftContentSearchSchema = z.infer<typeof draftContentSearchSchema>;

export { draftContentSearchSchema };
