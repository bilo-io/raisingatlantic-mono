import { UserRole } from '@/lib/constants';
import type { User } from '@/types/models';
import { permissions, type Action, type Resource } from './permissions';

export type CanScope = {
  /** Owner id of the resource being acted on (for self-vs-other checks). */
  ownerId?: string;
};

/**
 * Returns true if `user` is allowed to perform `action` on `resource`.
 * - `null` user is treated as unauthenticated; only `'public'` scopes pass.
 * - `'any-auth'` allows any signed-in user.
 * - When the resource has a `scope.ownerId`, allow the action if the user
 *   is the owner OR has one of the listed roles.
 */
export function can(
  user: User | null,
  action: Action,
  resource: Resource,
  scope?: CanScope,
): boolean {
  const rule = permissions[resource]?.[action];
  if (rule === undefined) return false;
  if (rule === 'public') return true;

  if (!user) return false;

  if (rule === 'any-auth') {
    if (scope?.ownerId) return user.id === scope.ownerId || isPrivileged(user.role);
    return true;
  }

  // Array of explicit roles
  if (rule.includes(user.role as UserRole)) return true;

  // Self-fallback: even if the user's role isn't in the list, they can act
  // on their own record (parent updates own child, user updates own profile).
  if (scope?.ownerId && user.id === scope.ownerId) return true;

  return false;
}

/** Helper: roles that bypass owner-only restrictions for read paths. */
function isPrivileged(role: UserRole): boolean {
  return role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN;
}

/** Convenience: does the user have any of the listed roles? */
export function hasRole(user: User | null, roles: UserRole[]): boolean {
  if (!user) return false;
  return roles.includes(user.role as UserRole);
}
