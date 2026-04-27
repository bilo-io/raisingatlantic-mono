'use client';

import { getCurrentUser } from '@/lib/auth';
import { setAuthBridge } from '@/lib/api/auth-bridge';
import type { User } from '@/types/models';
import type { UserRole } from '@/lib/constants';
import { useEffect, useState } from 'react';

export type CurrentUserState = {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

/**
 * Reads the current authenticated user from the local mock auth store.
 * Hydrates after mount (localStorage is unavailable on the server) and
 * pushes the user into the api auth-bridge so axios requests carry the
 * X-User-Id / X-User-Role headers.
 *
 * Listens for storage events so cross-tab sign-in/out stays in sync.
 */
export function useCurrentUser(): CurrentUserState {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const sync = () => {
      const next = getCurrentUser();
      setUser(next);
      setAuthBridge(next);
      setIsLoading(false);
    };
    sync();
    if (typeof window === 'undefined') return;
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  return {
    user,
    role: user?.role ?? null,
    isAuthenticated: !!user,
    isLoading,
  };
}
