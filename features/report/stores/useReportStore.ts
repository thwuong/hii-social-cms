import { create } from 'zustand';
import type { ReportStatus } from '../types';

interface ReportFilters {
  status: ReportStatus | '';
  cursor: string;
  limit: number;
  search: string;
}

interface ReportStore {
  filters: ReportFilters;
  setFilters: <K extends keyof ReportFilters>(key: K, value: ReportFilters[K]) => void;
  resetFilters: () => void;
}

const initialFilters: ReportFilters = {
  cursor: '',
  limit: 20,
  status: '',
  search: '',
};

export const useReportStore = create<ReportStore>((set) => ({
  filters: initialFilters,
  setFilters: (key, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
      },
    })),
  resetFilters: () => set({ filters: initialFilters }),
}));
