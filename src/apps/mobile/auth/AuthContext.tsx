import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { setAuthBridge, setAuthToken } from "../lib/api/auth-header";
import { signFixtureToken } from "../lib/api/fixture-jwt";
import { fixtureUsers } from "./fixtures";
import { clearUser, loadUser, saveUser } from "./storage";
import { Role, User } from "./types";

type AuthContextValue = {
  user: User | null;
  isHydrating: boolean;
  signInAs: (role: Role) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

function publishFixtureToken(user: User) {
  if (!__DEV__) return;
  const token = signFixtureToken({
    sub: user.id,
    role: user.role,
    tenantId: user.tenantId,
    practiceIds: user.practiceIds,
  });
  setAuthToken(token);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    loadUser()
      .then((u) => {
        setUser(u);
        setAuthBridge(u);
        if (u) publishFixtureToken(u);
      })
      .finally(() => setIsHydrating(false));
  }, []);

  const signInAs = useCallback(async (role: Role) => {
    const next = fixtureUsers[role];
    await saveUser(next);
    setUser(next);
    setAuthBridge(next);
    publishFixtureToken(next);
    // TODO(phase-8): after a successful sign-in, request notification
    // permissions, capture the Expo push token, and POST it to
    // /v1/users/me/push-tokens. The API-side wrapper (src/core/notifications)
    // is ready; this hook + the endpoint are what's left — see DEV.md §8.3.
  }, []);

  const signOut = useCallback(async () => {
    await clearUser();
    setUser(null);
    setAuthBridge(null);
    setAuthToken(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isHydrating, signInAs, signOut }),
    [user, isHydrating, signInAs, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
