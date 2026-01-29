import { z } from 'zod';

const contentSearchSchema = z.object({
  search: z.string().optional().default(''),
  page_size: z.number().optional().default(20),
  sort: z.string().optional().default('created_at'),
  sort_order: z.string().optional().default('asc'),
  approving_status: z.string().optional().default(''),
  categories: z.array(z.string()).optional().default([]),
  platform: z.string().optional().default(''),
});

const contentDetailSearchSchema = z.object({
  approving_status: z.string().optional().default(''),
  page_size: z.number().optional().default(20),
  sort: z.string().optional().default('created_at'),
  sort_order: z.string().optional().default('asc'),
});

export type ContentSearchSchema = z.infer<typeof contentSearchSchema>;
export type ContentDetailSearchSchema = z.infer<typeof contentDetailSearchSchema>;
export { contentSearchSchema, contentDetailSearchSchema };
