import type { User } from "../../auth/types";

let currentUser: User | null = null;
let currentToken: string | null = null;

export function setAuthBridge(user: User | null) {
  currentUser = user;
  if (!user) currentToken = null;
}

export function setAuthToken(token: string | null) {
  currentToken = token;
}

export function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  if (currentToken) headers.Authorization = `Bearer ${currentToken}`;
  if (currentUser) {
    headers["X-User-Id"] = currentUser.id;
    headers["X-User-Role"] = currentUser.role;
  }
  return headers;
}
