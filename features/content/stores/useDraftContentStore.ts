/**
 * Zustand Store Example - Authentication
 *
 * Docs: https://github.com/pmndrs/zustand
 */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface DraftContentState {
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
export const useDraftContentStore = create<DraftContentState>()(
  persist(
    (set) => ({
      selectedIds: [],
      viewMode: 'grid',
      setViewMode: (mode: 'table' | 'grid') => set({ viewMode: mode }),

      setSelectedIds: (ids: string[]) => set({ selectedIds: ids }),

      resetSelectedIds: () => set({ selectedIds: [] }),
    }),
    {
      name: 'draft-content-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/**
 * Selectors - Tối ưu re-renders
 */
export const useDraftContent = () => useDraftContentStore((state) => state);
