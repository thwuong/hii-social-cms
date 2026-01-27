/**
 * Zustand Store Example - Authentication
 *
 * Docs: https://github.com/pmndrs/zustand
 */

import { ContentItem } from '@/shared';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const defaultFilters: CrawlState['filters'] = {
  page: 1,
  page_size: 20,
  sort_order: 'asc',
  sort_by: 'created_at',
  limit: 20,
  search: '',
  is_previewed: 'false',
};
interface CrawlState {
  // State
  filters: {
    page: number;
    page_size: number;
    sort_order: 'asc' | 'desc';
    sort_by: 'created_at' | 'updated_at';
    limit: number;
    search?: string;
    is_previewed?: string;
  };
  selectedIds: string[];
  contentDetails: ContentItem | null;

  setFilters: (key: keyof CrawlState['filters'], value: any) => void;
  setSelectedIds: (ids: string[]) => void;
  setContentDetails: (details: Partial<ContentItem>) => void;
  resetFilters: () => void;
  resetSelectedIds: () => void;
  resetContentDetails: () => void;
}

/**
 * Auth Store với persistence
 */
export const useCrawlStore = create<CrawlState>()(
  persist(
    (set) => ({
      filters: defaultFilters,
      selectedIds: [],
      contentDetails: null,
      setFilters: (key: keyof CrawlState['filters'], value: any) =>
        set((state) => ({ filters: { ...state.filters, [key]: value } })),
      setSelectedIds: (ids: string[]) => set({ selectedIds: ids }),
      setContentDetails: (details: Partial<ContentItem>) =>
        set((state) => ({
          contentDetails: { ...state.contentDetails, ...details } as ContentItem,
        })),

      resetFilters: () =>
        set({
          filters: defaultFilters,
        }),
      resetSelectedIds: () => set({ selectedIds: [] }),
      resetContentDetails: () => set({ contentDetails: null }),
    }),
    {
      name: 'content-crawl-storage', // localStorage key
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
export const useCrawl = () => useCrawlStore((state) => state);
export const useCrawlFilters = () => useCrawlStore((state) => state.filters);
export const useCrawlContentDetails = () => useCrawlStore((state) => state.contentDetails);
