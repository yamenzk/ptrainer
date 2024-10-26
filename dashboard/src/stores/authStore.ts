// src/stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LoginResponse, Client, Membership, Plan, References } from '@/types/api';


interface AuthState {
  client: Client | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  membership: Membership | null;
  client: Client | null;
  plans: Plan[];
  references: References | null;
  
  login: (data: LoginResponse['data']) => void;
  logout: () => void;
  refreshData: () => Promise<void>;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isLoading: true,
      error: null,
      membership: null,
      client: null,
      plans: [],
      references: null,

      login: (data) => {
        set({
          isAuthenticated: true,
          membership: data.membership,
          client: data.client,
          plans: data.plans,
          references: data.references,
          error: null,
          isLoading: false,
        });
      },

      logout: () => {
        set({
          isAuthenticated: false,
          membership: null,
          client: null,
          plans: [],
          references: null,
          error: null,
        });
      },

      refreshData: async () => {
        const state = get();
        if (!state.membership?.name) {
          set({ isLoading: false });
          return;
        }

        try {
          set({ isLoading: true });
          const response = await fetch(`/api/v2/method/ptrainer.ptrainer_methods.get_membership?membership=${state.membership.name}`);
          const result = await response.json();
          
          if (!response.ok || !result.data) {
            throw new Error('Failed to refresh data');
          }

          set({
            membership: result.data.membership,
            client: result.data.client,
            plans: result.data.plans,
            references: result.data.references,
            isLoading: false,
          });
        } catch (error) {
          set({ 
            error: 'Failed to refresh data',
            isLoading: false
          });
        }
      },

      setError: (error) => set({ error }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        membership: state.membership,
      }),
    }
  )
);

// Helper hooks
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useIsLoading = () => useAuthStore((state) => state.isLoading);
export const useClient = () => useAuthStore((state) => state.client);
export const useMembership = () => useAuthStore((state) => state.membership);
export const usePlans = () => useAuthStore((state) => state.plans);
export const useError = () => useAuthStore((state) => state.error);