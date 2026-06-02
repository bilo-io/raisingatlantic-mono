import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Child } from "@raising-atlantic/types";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useChildrenList } from "../api/hooks/adapter-hooks";
import { useAuth } from "../../auth/useAuth";

const STORAGE_KEY = "@ra/active-child";

type ActiveChildContextValue = {
  activeChildId: string | null;
  setActiveChildId: (id: string | null) => void;
  activeChild: Child | null;
  childrenList: Child[];
  isLoading: boolean;
};

const ActiveChildContext = createContext<ActiveChildContextValue | undefined>(undefined);

export function ActiveChildProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const parentId = user?.role === "parent" ? user.id : undefined;
  const childrenQuery = useChildrenList(parentId ? { parentId } : undefined);
  const [activeChildId, setActiveChildIdState] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => setActiveChildIdState(stored))
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const list = childrenQuery.data ?? [];
    if (list.length === 0) {
      if (activeChildId !== null) setActiveChildIdState(null);
      return;
    }
    const stillPresent = activeChildId && list.some((c) => c.id === activeChildId);
    if (!stillPresent) {
      setActiveChildIdState(list[0].id);
    }
  }, [hydrated, childrenQuery.data, activeChildId]);

  const setActiveChildId = (id: string | null) => {
    setActiveChildIdState(id);
    if (id) {
      AsyncStorage.setItem(STORAGE_KEY, id).catch(() => undefined);
    } else {
      AsyncStorage.removeItem(STORAGE_KEY).catch(() => undefined);
    }
  };

  const value = useMemo<ActiveChildContextValue>(() => {
    const list = childrenQuery.data ?? [];
    const activeChild = list.find((c) => c.id === activeChildId) ?? null;
    return {
      activeChildId,
      setActiveChildId,
      activeChild,
      childrenList: list,
      isLoading: childrenQuery.isLoading || !hydrated,
    };
  }, [childrenQuery.data, childrenQuery.isLoading, activeChildId, hydrated]);

  return <ActiveChildContext.Provider value={value}>{children}</ActiveChildContext.Provider>;
}

export function useActiveChild(): ActiveChildContextValue {
  const ctx = useContext(ActiveChildContext);
  if (!ctx) throw new Error("useActiveChild must be used within an ActiveChildProvider");
  return ctx;
}
