'use client';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import type { UserRole } from '@/lib/constants';
import { hasRole } from '@/lib/rbac';
import type { ReactNode } from 'react';

type RoleGateProps = {
  roles: UserRole[];
  children: ReactNode;
  /** Rendered when the user is not in `roles`. Defaults to nothing. */
  fallback?: ReactNode;
};

/**
 * Hides UI islands (buttons, links, sections) from users whose role is
 * not in `roles`. Use for inline action gating, not page-level guards —
 * for that, use <RequireRole>.
 */
export function RoleGate({ roles, children, fallback = null }: RoleGateProps) {
  const { user, isLoading } = useCurrentUser();
  if (isLoading) return null;
  if (!hasRole(user, roles)) return <>{fallback}</>;
  return <>{children}</>;
}
