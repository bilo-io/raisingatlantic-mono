import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Practice } from "@raising-atlantic/types";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "../auth/useAuth";
import { usePractices } from "../lib/api/hooks";

const STORAGE_KEY = "ra.activePracticeId";

type Value = {
  practiceId: string | null;
  practice: Practice | null;
  practices: Practice[];
  setActivePracticeId: (id: string) => void;
  isReady: boolean;
};

const ActivePracticeContext = createContext<Value | null>(null);

export function ActivePracticeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { data: allPractices = [] } = usePractices();
  const [practiceId, setPracticeId] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const practices = useMemo(() => {
    if (!user?.practiceIds?.length) return allPractices;
    return allPractices.filter((p) => user.practiceIds!.includes(p.id));
  }, [allPractices, user?.practiceIds]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored) setPracticeId(stored);
      })
      .finally(() => setIsHydrated(true));
  }, []);

  useEffect(() => {
    if (!isHydrated || practices.length === 0) return;
    if (!practiceId || !practices.some((p) => p.id === practiceId)) {
      setPracticeId(practices[0].id);
    }
  }, [isHydrated, practices, practiceId]);

  const setActivePracticeId = useCallback((id: string) => {
    setPracticeId(id);
    void AsyncStorage.setItem(STORAGE_KEY, id);
  }, []);

  const practice = useMemo(
    () => practices.find((p) => p.id === practiceId) ?? null,
    [practices, practiceId],
  );

  const value = useMemo<Value>(
    () => ({
      practiceId,
      practice,
      practices,
      setActivePracticeId,
      isReady: isHydrated && practices.length > 0,
    }),
    [practiceId, practice, practices, setActivePracticeId, isHydrated],
  );

  return (
    <ActivePracticeContext.Provider value={value}>{children}</ActivePracticeContext.Provider>
  );
}

export function useActivePractice() {
  const ctx = useContext(ActivePracticeContext);
  if (!ctx) {
    throw new Error("useActivePractice must be used within an ActivePracticeProvider");
  }
  return ctx;
}
