/**
 * Zustand Store Example - Authentication
 *
 * Docs: https://github.com/pmndrs/zustand
 */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  // Actions
  login: (user: User, token: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  setToken: (token: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  clearTokens: () => void;
}

/**
 * Auth Store với persistence
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      refreshToken: null,

      // Actions
      login: (user, token, refreshToken) =>
        set({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          refreshToken: null,
        }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      setToken: (token) => set({ token }),
      setRefreshToken: (refreshToken) => set({ refreshToken }),
      clearTokens: () => set({ token: null, refreshToken: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Chỉ persist những fields này
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        refreshToken: state.refreshToken,
      }),
    }
  )
);

/**
 * Selectors - Tối ưu re-renders
 */
export const useAuth = () => useAuthStore((state) => state);
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);

/**
 * Example usage:
 *
 * // In component
 * const { user, login, logout } = useAuth();
 *
 * // Or use specific selectors
 * const user = useUser();
 * const isAuthenticated = useIsAuthenticated();
 *
 * // Actions
 * login({ id: '1', name: 'John', email: 'john@example.com', role: UserRole.ADMIN }, 'token123');
 * logout();
 * updateUser({ name: 'John Doe' });
 */
