/**
 * Zustand Store Example - UI State
 *
 * Store cho các UI state như sidebar, modals, theme, etc.
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UIState {
  // Sidebar
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Modals
  activeModal: string | null;
  openModal: (modalId: string) => void;
  closeModal: () => void;

  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;

  // Loading states
  isLoading: boolean;
  setLoading: (loading: boolean) => void;

  // Notifications
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  }>;
  addNotification: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
  removeNotification: (id: string) => void;
}

/**
 * UI Store với devtools
 */
export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      // Sidebar
      isSidebarOpen: true,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),

      // Modals
      activeModal: null,
      openModal: (modalId) => set({ activeModal: modalId }),
      closeModal: () => set({ activeModal: null }),

      // Theme
      theme: 'dark',
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
      setTheme: (theme) => set({ theme }),

      // Loading
      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading }),

      // Notifications
      notifications: [],
      addNotification: (type, message) =>
        set((state) => ({
          notifications: [
            ...state.notifications,
            {
              id: Date.now().toString(),
              type,
              message,
            },
          ],
        })),
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
    }),
    {
      name: 'ui-store', // DevTools name
    }
  )
);

/**
 * Selectors
 */
export const useSidebar = () =>
  useUIStore((state) => ({
    isOpen: state.isSidebarOpen,
    toggle: state.toggleSidebar,
    setOpen: state.setSidebarOpen,
  }));

export const useModal = () =>
  useUIStore((state) => ({
    activeModal: state.activeModal,
    open: state.openModal,
    close: state.closeModal,
  }));

export const useTheme = () =>
  useUIStore((state) => ({
    theme: state.theme,
    toggle: state.toggleTheme,
    set: state.setTheme,
  }));

export const useNotifications = () =>
  useUIStore((state) => ({
    notifications: state.notifications,
    add: state.addNotification,
    remove: state.removeNotification,
  }));

/**
 * Example usage:
 *
 * // In component
 * const { isOpen, toggle } = useSidebar();
 * const { theme, toggle: toggleTheme } = useTheme();
 * const { add: addNotification } = useNotifications();
 *
 * // Actions
 * toggle(); // Toggle sidebar
 * toggleTheme(); // Toggle theme
 * addNotification('success', 'Content created!');
 */
