import { api } from "../lib/api/client";
import { useApi } from "../lib/api/data-source";
import { setAuthToken } from "../lib/api/auth-header";
import { fixtureUsers } from "./fixtures";
import { clearIdToken, getIdToken, setIdToken } from "./secure-token";
import type { Role, User } from "./types";

export type CredentialSignInResult =
  | { kind: "session"; user: User; token: string }
  | { kind: "mfa-required"; mfaToken: string }
  | { kind: "mfa-setup-required"; mfaToken: string };

export type MfaSetupInfo = { secret: string; otpauthUrl: string };

export type AuthProvider = {
  // Fixture-mode role picker; ApiAuthProvider rejects it.
  signIn: (role: Role) => Promise<User>;
  signInWithCredentials?: (
    email: string,
    password: string,
  ) => Promise<CredentialSignInResult>;
  completeMfaChallenge?: (
    mfaToken: string,
    code: string,
  ) => Promise<{ user: User; token: string }>;
  setupMfa?: (mfaToken: string) => Promise<MfaSetupInfo>;
  enableMfa?: (
    mfaToken: string,
    code: string,
  ) => Promise<{ user: User; token: string }>;
  restoreSession?: (user: User) => Promise<void>;
  signOut: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
};

function publishFixtureToken(user: User): void {
  if (!__DEV__) return;
  // Inline require so release bundles can drop fixture-jwt with the dead
  // branch — production builds must never contain the unsigned-token path.
  const { signFixtureToken } =
    require("../lib/api/fixture-jwt") as typeof import("../lib/api/fixture-jwt");
  setAuthToken(
    signFixtureToken({
      sub: user.id,
      role: user.role,
      tenantId: user.tenantId,
      practiceIds: user.practiceIds,
    }),
  );
}

export const FixtureAuthProvider: AuthProvider = {
  async signIn(role) {
    const user = fixtureUsers[role];
    publishFixtureToken(user);
    return user;
  },
  async restoreSession(user) {
    publishFixtureToken(user);
  },
  async signOut() {
    return;
  },
  async getIdToken() {
    return null;
  },
};

type ApiUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  imageUrl?: string;
};

type LoginResponse =
  | { user: ApiUser; token: string }
  | { mfaRequired?: true; mfaSetupRequired?: true; mfaToken: string };

// The mobile route groups know parent/clinician/admin; super admins use the
// admin surface.
function toMobileUser(u: ApiUser): User {
  const role: Role = u.role === "super_admin" ? "admin" : (u.role as Role);
  return { id: u.id, name: u.name, email: u.email, role };
}

async function persistSession(user: ApiUser, token: string) {
  await setIdToken(token);
  setAuthToken(token);
  return toMobileUser(user);
}

export const ApiAuthProvider: AuthProvider = {
  async signIn() {
    throw new Error(
      "Role-picker sign-in is fixture-only. Use signInWithCredentials in API mode.",
    );
  },

  async signInWithCredentials(email, password) {
    const res = await api.post<LoginResponse>("/auth/login", {
      email,
      password,
    });
    const data = res.data;
    if ("token" in data) {
      const user = await persistSession(data.user, data.token);
      return { kind: "session", user, token: data.token };
    }
    return data.mfaSetupRequired
      ? { kind: "mfa-setup-required", mfaToken: data.mfaToken }
      : { kind: "mfa-required", mfaToken: data.mfaToken };
  },

  async completeMfaChallenge(mfaToken, code) {
    const res = await api.post<{ user: ApiUser; token: string }>(
      "/auth/mfa/verify",
      { mfaToken, code },
    );
    const user = await persistSession(res.data.user, res.data.token);
    return { user, token: res.data.token };
  },

  async setupMfa(mfaToken) {
    const res = await api.post<MfaSetupInfo>(
      "/auth/mfa/setup",
      {},
      { headers: { Authorization: `Bearer ${mfaToken}` } },
    );
    return res.data;
  },

  async enableMfa(mfaToken, code) {
    const res = await api.post<{ user: ApiUser; token: string }>(
      "/auth/mfa/enable",
      { code },
      { headers: { Authorization: `Bearer ${mfaToken}` } },
    );
    const user = await persistSession(res.data.user, res.data.token);
    return { user, token: res.data.token };
  },

  async restoreSession() {
    const token = await getIdToken();
    if (token) setAuthToken(token);
  },

  async signOut() {
    await api.post("/auth/logout").catch(() => undefined);
    await clearIdToken();
  },

  getIdToken,
};

let active: AuthProvider = useApi() ? ApiAuthProvider : FixtureAuthProvider;

export function setActiveAuthProvider(next: AuthProvider): void {
  active = next;
}

export function getActiveAuthProvider(): AuthProvider {
  return active;
}
