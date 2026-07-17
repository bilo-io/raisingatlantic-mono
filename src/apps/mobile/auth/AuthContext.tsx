import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { setAuthBridge, setAuthToken } from "../lib/api/auth-header";
import { setSignOutHandler } from "../lib/api/sign-out-bridge";
import {
  deregisterDevice,
  registerDeviceForRole,
} from "../lib/push/usePushRegistration";
import { getActiveAuthProvider } from "./provider";
import type { CredentialSignInResult, MfaSetupInfo } from "./provider";
import { clearUser, loadUser, saveUser } from "./storage";
import { Role, User } from "./types";

export type PendingMfa = {
  mfaToken: string;
  setupRequired: boolean;
};

type AuthContextValue = {
  user: User | null;
  isHydrating: boolean;
  pendingMfa: PendingMfa | null;
  signInAs: (role: Role) => Promise<void>;
  signInWithPassword: (
    email: string,
    password: string,
  ) => Promise<"session" | "mfa">;
  completeMfaSignIn: (code: string) => Promise<void>;
  startMfaSetup: () => Promise<MfaSetupInfo>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);
  const [pendingMfa, setPendingMfa] = useState<PendingMfa | null>(null);

  useEffect(() => {
    (async () => {
      const u = await loadUser();
      if (!u) return;
      // Fixture mode republishes the dev token; API mode restores the real
      // JWT from the keychain. Expired tokens surface as a 401 → sign-out.
      await getActiveAuthProvider().restoreSession?.(u);
      setUser(u);
      setAuthBridge(u);
    })()
      .catch(() => undefined)
      .finally(() => setIsHydrating(false));
  }, []);

  const adoptUser = useCallback(async (next: User) => {
    await saveUser(next);
    setUser(next);
    setAuthBridge(next);
    setPendingMfa(null);
    registerDeviceForRole(next.role).catch(() => undefined);
  }, []);

  const signInAs = useCallback(
    async (role: Role) => {
      const next = await getActiveAuthProvider().signIn(role);
      await adoptUser(next);
    },
    [adoptUser],
  );

  const signInWithPassword = useCallback(
    async (email: string, password: string) => {
      const provider = getActiveAuthProvider();
      if (!provider.signInWithCredentials) {
        throw new Error("Password sign-in is unavailable in fixture mode");
      }
      const result: CredentialSignInResult =
        await provider.signInWithCredentials(email, password);
      if (result.kind === "session") {
        await adoptUser(result.user);
        return "session" as const;
      }
      setPendingMfa({
        mfaToken: result.mfaToken,
        setupRequired: result.kind === "mfa-setup-required",
      });
      return "mfa" as const;
    },
    [adoptUser],
  );

  const completeMfaSignIn = useCallback(
    async (code: string) => {
      const provider = getActiveAuthProvider();
      if (!pendingMfa) throw new Error("No MFA sign-in in progress");
      const complete = pendingMfa.setupRequired
        ? provider.enableMfa
        : provider.completeMfaChallenge;
      if (!complete) throw new Error("MFA is unavailable in fixture mode");
      const { user: next } = await complete(pendingMfa.mfaToken, code);
      await adoptUser(next);
    },
    [adoptUser, pendingMfa],
  );

  const startMfaSetup = useCallback(async () => {
    const provider = getActiveAuthProvider();
    if (!pendingMfa || !provider.setupMfa) {
      throw new Error("No MFA enrolment in progress");
    }
    return provider.setupMfa(pendingMfa.mfaToken);
  }, [pendingMfa]);

  const signOut = useCallback(async () => {
    // Independent network calls — run them together so sign-out latency is
    // the slower of the two, not the sum.
    await Promise.all([
      deregisterDevice().catch(() => undefined),
      getActiveAuthProvider()
        .signOut()
        .catch(() => undefined),
    ]);
    await clearUser();
    setUser(null);
    setPendingMfa(null);
    setAuthBridge(null);
    setAuthToken(null);
  }, []);

  useEffect(() => {
    setSignOutHandler(signOut);
    return () => setSignOutHandler(null);
  }, [signOut]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isHydrating,
      pendingMfa,
      signInAs,
      signInWithPassword,
      completeMfaSignIn,
      startMfaSetup,
      signOut,
    }),
    [
      user,
      isHydrating,
      pendingMfa,
      signInAs,
      signInWithPassword,
      completeMfaSignIn,
      startMfaSetup,
      signOut,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
