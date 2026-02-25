/**
 * Zustand Store Example - Authentication
 *
 * Docs: https://github.com/pmndrs/zustand
 */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ContentState {
  // State
  selectedIds: string[];
  viewMode: 'table' | 'grid';
  setViewMode: (mode: 'table' | 'grid') => void;

  setSelectedIds: (ids: string[]) => void;
  resetSelectedIds: () => void;
}

/**
 * Auth Store với persistence
 */
export const useContentStore = create<ContentState>()(
  persist(
    (set) => ({
      selectedIds: [],
      contentDetails: null,
      viewMode: 'grid',
      setViewMode: (mode: 'table' | 'grid') => set({ viewMode: mode }),

      setSelectedIds: (ids: string[]) => set({ selectedIds: ids }),

      resetSelectedIds: () => set({ selectedIds: [] }),
    }),
    {
      name: 'content-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/**
 * Selectors - Tối ưu re-renders
 */
export const useContent = () => useContentStore((state) => state);
