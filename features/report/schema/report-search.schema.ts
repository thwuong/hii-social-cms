import z from 'zod';
import { ReportStatus } from '../types';

const reportSearchSchema = z.object({
  search: z.string().optional().default(''),
  limit: z.number().optional().default(20),
  status: z.nativeEnum(ReportStatus).optional().default(ReportStatus.PENDING),
});

export type ReportSearchSchema = z.infer<typeof reportSearchSchema>;
export { reportSearchSchema };
