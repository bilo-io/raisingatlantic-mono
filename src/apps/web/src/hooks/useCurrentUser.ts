'use client';

import { fetchCurrentUser, getCurrentUser } from '@/lib/auth';
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
 * Resolves the authenticated user from the httpOnly session cookie via
 * GET /v1/auth/me (deduped + cached in lib/auth). Hydrates after mount, and
 * re-syncs on storage events so the dev /login/test bypass stays consistent
 * across tabs.
 */
export function useCurrentUser(): CurrentUserState {
  const [user, setUser] = useState<User | null>(getCurrentUser());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const sync = async (force = false) => {
      const next = await fetchCurrentUser(force);
      if (!active) return;
      setUser(next);
      setIsLoading(false);
    };

    void sync();
    if (typeof window === 'undefined') return;

    const onStorage = () => void sync(true);
    window.addEventListener('storage', onStorage);
    return () => {
      active = false;
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return {
    user,
    role: user?.role ?? null,
    isAuthenticated: !!user,
    isLoading,
  };
}
