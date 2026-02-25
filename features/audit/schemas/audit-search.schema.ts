/**
 * Audit Search Schema
 *
 * Zod validation schema for audit search filters
 */

import { z } from 'zod';

export const auditSearchSchema = z.object({
  limit: z.number().optional(),
  page: z.number().optional(),
  actions: z.string().array().default([]),
  platforms: z.string().array().default([]),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
  search: z.string().optional(),
});

export type AuditSearchSchema = z.infer<typeof auditSearchSchema>;
