import z from 'zod';

export const updateReelSchema = z.object({
  title: z.string().min(1).optional(),
  platforms: z.array(z.string()).default([]).optional(),
  categories: z.array(z.string()).default([]).optional(),
  tags: z.array(z.string()).default([]).optional(),
  is_allow_comment: z.boolean().default(true).optional(),
  country: z.array(z.string()).optional(),
  language: z.string().optional(),
});

export type UpdateReelSchema = z.infer<typeof updateReelSchema>;
