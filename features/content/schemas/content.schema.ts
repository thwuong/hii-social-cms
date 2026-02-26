import z from 'zod';

export const contentSchema = z.object({
  title: z.string().min(1).trim(),
  description: z.string().min(1).trim(),
  is_allow_comment: z.boolean().default(true),
  media: z.array(z.string()),
  thumbnail: z.string().optional(),
  platforms: z.array(z.string()).default([]),
  status: z.string().optional(),
  id: z.string().optional(),
  categories: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]).optional(),
  crawler_id: z.string(),
  playlist: z.array(z.string()).optional(),
  language: z.string().optional(),
  country: z.array(z.string()).optional(),
});

export type ContentSchema = z.infer<typeof contentSchema>;
