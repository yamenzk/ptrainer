// src/components/auth/AuthProvider.tsx
import { FC, ReactNode, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const refreshData = useAuthStore(state => state.refreshData);

  useEffect(() => {
    // Initial refresh
    refreshData();

    // Set up interval for periodic refresh
    const interval = setInterval(refreshData, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, [refreshData]);

  return <>{children}</>;
};