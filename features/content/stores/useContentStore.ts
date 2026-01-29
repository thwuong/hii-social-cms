/**
 * Zustand Store Example - Authentication
 *
 * Docs: https://github.com/pmndrs/zustand
 */

import { ContentItem } from '@/shared';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const defaultFilters: ContentState['filters'] = {
  page_size: 20,
  limit: 20,
  search: '',
  sorted: 'asc',
  sort: 'created_at',
  approving_status: '',
  tags: [],
  platform: '',
  status: '',
};

interface ContentState {
  // State
  filters: {
    page_size: number;
    limit: number;
    search?: string;
    sorted: 'asc' | 'desc';
    sort: string;
    approving_status: string;
    tags: string[];
    platform: string;
    status: string;
  };
  selectedIds: string[];
  contentDetails: ContentItem | null;
  viewMode: 'table' | 'grid';
  setViewMode: (mode: 'table' | 'grid') => void;

  setFilters: (key: keyof ContentState['filters'], value: any) => void;
  setSelectedIds: (ids: string[]) => void;
  setContentDetails: (details: Partial<ContentItem>) => void;
  resetFilters: () => void;
  resetSelectedIds: () => void;
  resetContentDetails: () => void;
}

/**
 * Auth Store với persistence
 */
export const useContentStore = create<ContentState>()(
  persist(
    (set) => ({
      filters: defaultFilters,
      selectedIds: [],
      contentDetails: null,
      viewMode: 'grid',
      setViewMode: (mode: 'table' | 'grid') => set({ viewMode: mode }),
      setFilters: (key: keyof ContentState['filters'], value: any) =>
        set((state) => ({ filters: { ...state.filters, [key]: value } })),
      setSelectedIds: (ids: string[]) => set({ selectedIds: ids }),
      setContentDetails: (details: Partial<ContentItem>) =>
        set((state) => ({
          contentDetails: { ...state.contentDetails, ...details } as ContentItem,
        })),

      resetFilters: () => set({ filters: defaultFilters }),
      resetSelectedIds: () => set({ selectedIds: [] }),
      resetContentDetails: () => set({ contentDetails: null }),
    }),
    {
      name: 'content-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        contentDetails: state.contentDetails,
      }),
    }
  )
);

/**
 * Selectors - Tối ưu re-renders
 */
export const useCrawl = () => useContentStore((state) => state);
export const useCrawlFilters = () => useContentStore((state) => state.filters);
export const useCrawlContentDetails = () => useContentStore((state) => state.contentDetails);
