import z from 'zod';

export const contentSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  is_allow_comment: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
  media: z.array(z.string()),
  thumbnail: z.string().optional(),
  platforms: z.array(z.string()).default([]),
  status: z.string().optional(),
  id: z.string().optional(),
  categories: z.array(z.string()).default([]),
});

export type ContentSchema = z.infer<typeof contentSchema>;
