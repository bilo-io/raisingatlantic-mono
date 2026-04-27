'use client';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import type { UserRole } from '@/lib/constants';
import { hasRole } from '@/lib/rbac';
import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

type RequireRoleProps = {
  /** Allowed roles. If empty, only requires authentication (any role). */
  roles?: UserRole[];
  /** Where to send users who fail the check. Defaults to '/login'. */
  redirectTo?: string;
  /** What to render while the auth state hydrates. */
  loading?: ReactNode;
  children: ReactNode;
};

/**
 * Page/segment-level gate. Mount this inside a route's layout.tsx (or
 * page.tsx for one-off gating) to redirect unauthorized users.
 * Renders nothing while redirecting to avoid leaking restricted UI.
 */
export function RequireRole({
  roles,
  redirectTo,
  loading = null,
  children,
}: RequireRoleProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useCurrentUser();

  const allowed =
    isAuthenticated && (!roles || roles.length === 0 || hasRole(user, roles));

  useEffect(() => {
    if (isLoading) return;
    if (!allowed) {
      const dest =
        redirectTo ?? (isAuthenticated ? '/dashboard' : '/login');
      router.replace(dest);
    }
  }, [allowed, isAuthenticated, isLoading, redirectTo, router]);

  if (isLoading) return <>{loading}</>;
  if (!allowed) return null;
  return <>{children}</>;
}
