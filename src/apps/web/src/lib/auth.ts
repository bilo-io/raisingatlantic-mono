import { apiClient } from '@/lib/api/api-client';
import { UserRole } from './constants';
import { User, dummyUsers } from '@/data/users';

// Dev-only bypass: the /login/test page can drop into the app without a real
// IdP/GCP. Gated so production builds never accept a mock session.
const TEST_LOGIN_ENABLED = process.env.NEXT_PUBLIC_ENABLE_TEST_LOGIN === 'true';
const MOCK_USERS_KEY = 'mock_auth_users';
const MOCK_CURRENT_USER_KEY = 'mock_auth_current_user_id';

// Synchronously-readable snapshot of the authenticated user. Hydrated by
// fetchCurrentUser() (called from useCurrentUser on mount) so legacy sync
// callers — e.g. dashboard pages already gated behind <RequireRole> — keep
// working without becoming async.
let currentUserCache: User | null = null;
let inflight: Promise<User | null> | null = null;

export interface SignupData {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  title?: string;
  phone?: string;
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// The API returns an MFA challenge instead of a session for MFA-enrolled users
// and privileged roles (clinician/admin/super_admin). The web MFA screens are
// not built yet (tracked in docs/GO_LIVE/PHASE_2_TODO.md), so surface a clear
// error rather than silently caching an undefined user.
const WEB_MFA_UNSUPPORTED_MESSAGE =
  'This account requires multi-factor authentication, which is not yet ' +
  'available on the web. Please sign in with the mobile app for now.';

/** Real login against the API. The access token is set as an httpOnly cookie. */
export const login = async (email: string, password: string): Promise<User> => {
  const { data } = await apiClient.post('/auth/login', { email, password });
  if (!data.user) throw new Error(WEB_MFA_UNSUPPORTED_MESSAGE);
  return setCurrentUser(data.user as User);
};

/**
 * Real registration. Parents receive a session (httpOnly cookie) immediately;
 * clinician accounts get an MFA-setup challenge instead, so no session is
 * cached — the success flow only needs to know the account was created.
 */
export const signup = async (data: SignupData): Promise<User | null> => {
  const { data: res } = await apiClient.post('/auth/register', {
    title: data.title,
    name: data.name,
    email: data.email,
    phone: data.phone || '',
    password: data.password,
    role: data.role,
  });
  if (!res.user) return null;
  return setCurrentUser(res.user as User);
};

/** Exchange a Google ID token (from Google Identity Services) for a session. */
export const loginWithGoogle = async (idToken: string): Promise<User> => {
  const { data } = await apiClient.post('/auth/google', { idToken });
  if (!data.user) throw new Error(WEB_MFA_UNSUPPORTED_MESSAGE);
  return setCurrentUser(data.user as User);
};

export const logout = async (): Promise<void> => {
  try {
    await apiClient.post('/auth/logout');
  } catch {
    // Best effort — clear local state regardless.
  }
  currentUserCache = null;
  inflight = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem(MOCK_CURRENT_USER_KEY);
    localStorage.removeItem('currentUserId');
  }
};

/**
 * Resolve the current user from the session cookie (GET /v1/auth/me).
 * Dedupes concurrent callers. Falls back to the dev test-login user when no
 * real session exists and NEXT_PUBLIC_ENABLE_TEST_LOGIN is on.
 */
export const fetchCurrentUser = async (force = false): Promise<User | null> => {
  if (!force && currentUserCache) return currentUserCache;
  if (!inflight) {
    inflight = apiClient
      .get('/auth/me')
      .then((res) => (res.data.user as User) ?? null)
      .catch(() => (TEST_LOGIN_ENABLED ? getMockCurrentUser() : null))
      .then((user) => {
        currentUserCache = user;
        inflight = null;
        return user;
      });
  }
  return inflight;
};

/** Last-known user, read synchronously (populated by fetchCurrentUser). */
export const getCurrentUser = (): User | null => currentUserCache;

function setCurrentUser(user: User): User {
  currentUserCache = user;
  inflight = null;
  return user;
}

// --- Dev test-login bypass (no real IdP) ------------------------------------

export function getMockCurrentUser(): User | null {
  if (!TEST_LOGIN_ENABLED || typeof window === 'undefined') return null;
  const id = localStorage.getItem(MOCK_CURRENT_USER_KEY);
  if (!id) return null;
  const stored = localStorage.getItem(MOCK_USERS_KEY);
  const users: User[] = stored ? JSON.parse(stored) : [];
  return [...users, ...dummyUsers].find((u) => u.id === id) ?? null;
}

export function setMockCurrentUser(user: User): void {
  if (!TEST_LOGIN_ENABLED || typeof window === 'undefined') return;
  const stored = localStorage.getItem(MOCK_USERS_KEY);
  const users: User[] = stored ? JSON.parse(stored) : [];
  if (!users.find((u) => u.id === user.id)) {
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify([...users, user]));
  }
  localStorage.setItem(MOCK_CURRENT_USER_KEY, user.id);
  localStorage.setItem('currentUserId', user.id);
  currentUserCache = user;
  inflight = null;
}
