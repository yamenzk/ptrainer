// src/stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LoginResponse, Client, Membership, Plan, References } from '@/types/api';

interface AuthState {
  // Auth state
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // User data
  membership: Membership | null;
  client: Client | null;
  plans: Plan[];
  references: References | null;

  // Actions
  login: (data: LoginResponse['data']) => void;
  logout: () => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      isAuthenticated: false,
      isLoading: false,
      error: null,
      membership: null,
      client: null,
      plans: [],
      references: null,

      // Actions
      login: (data) => set({
        isAuthenticated: true,
        membership: data.membership,
        client: data.client,
        plans: data.plans,
        references: data.references,
        error: null,
      }),

      logout: () => set({
        isAuthenticated: false,
        membership: null,
        client: null,
        plans: [],
        references: null,
        error: null,
      }),

      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated,
        membership: state.membership,
        client: state.client,
        plans: state.plans,
        references: state.references,
      }),
    }
  )
);

// Optional: Create hooks for specific parts of the state
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useClient = () => useAuthStore((state) => state.client);
export const useMembership = () => useAuthStore((state) => state.membership);
export const usePlans = () => useAuthStore((state) => state.plans);