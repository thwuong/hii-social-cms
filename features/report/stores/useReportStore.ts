import { create } from 'zustand';
import type { ReportStatus } from '../types';

interface ReportFilters {
  status: ReportStatus | '';
  cursor: string;
  limit: number;
  search: string;
}

interface ReportStore {}

export const useReportStore = create<ReportStore>((set) => ({}));
