import { SortOrder } from '@/shared';
import { z } from 'zod';

const contentSearchSchema = z.object({
  search: z.string().optional().default(''),
  page_size: z.number().optional().default(24),
  sort: z.string().optional().default('created_at'),
  sort_order: z.nativeEnum(SortOrder).optional().default(SortOrder.DESC),
  approving_status: z.string().optional().default(''),
  categories: z.array(z.string()).optional().default([]),
  platforms: z.array(z.string()).optional().default(['all']),
  playlist: z.array(z.string()).optional(),
});

const contentDetailSearchSchema = z.object({
  approving_status: z.string().optional().default(''),
  page_size: z.number().optional().default(24),
  sort: z.string().optional().default('created_at'),
  sort_order: z.nativeEnum(SortOrder).optional().default(SortOrder.DESC),
  playlist: z.array(z.string()).optional(),
});

export type ContentSearchSchema = z.infer<typeof contentSearchSchema>;
export type ContentDetailSearchSchema = z.infer<typeof contentDetailSearchSchema>;
export { contentDetailSearchSchema, contentSearchSchema };
