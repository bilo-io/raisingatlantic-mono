import type { User } from '@/types/models';

let currentUser: User | null = null;

export function setAuthBridge(user: User | null) {
  currentUser = user;
}

export function getAuthHeaders(): Record<string, string> {
  if (!currentUser) return {};
  return {
    'X-User-Id': currentUser.id,
    'X-User-Role': currentUser.role,
  };
}
