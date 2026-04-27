import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { setAuthBridge } from "../lib/api/auth-header";
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    loadUser()
      .then((u) => {
        setUser(u);
        setAuthBridge(u);
      })
      .finally(() => setIsHydrating(false));
  }, []);

  const signInAs = useCallback(async (role: Role) => {
    const next = fixtureUsers[role];
    await saveUser(next);
    setUser(next);
    setAuthBridge(next);
  }, []);

  const signOut = useCallback(async () => {
    await clearUser();
    setUser(null);
    setAuthBridge(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isHydrating, signInAs, signOut }),
    [user, isHydrating, signInAs, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
