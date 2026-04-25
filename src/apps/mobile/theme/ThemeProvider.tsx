import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SystemUI from "expo-system-ui";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme, View } from "react-native";
import { vars } from "nativewind";
import { darkTokens, lightTokens, Tokens, tokensToVars } from "./tokens";

export type SchemePreference = "light" | "dark" | "system";
export type ResolvedScheme = "light" | "dark";

type ThemeContextValue = {
  scheme: SchemePreference;
  resolvedScheme: ResolvedScheme;
  tokens: Tokens;
  setScheme: (next: SchemePreference) => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "@ra/theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [scheme, setSchemeState] = useState<SchemePreference>("system");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((v) => {
        if (v === "light" || v === "dark" || v === "system") {
          setSchemeState(v);
        }
      })
      .finally(() => setHydrated(true));
  }, []);

  const resolvedScheme: ResolvedScheme = useMemo(() => {
    if (scheme === "system") return systemScheme === "dark" ? "dark" : "light";
    return scheme;
  }, [scheme, systemScheme]);

  const tokens = resolvedScheme === "dark" ? darkTokens : lightTokens;

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(tokens.background).catch(() => {});
  }, [tokens.background]);

  const setScheme = useCallback((next: SchemePreference) => {
    setSchemeState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ scheme, resolvedScheme, tokens, setScheme }),
    [scheme, resolvedScheme, tokens, setScheme],
  );

  if (!hydrated) return null;

  return (
    <ThemeContext.Provider value={value}>
      <View
        style={[{ flex: 1 }, vars(tokensToVars(tokens))]}
        className={resolvedScheme === "dark" ? "dark" : ""}
      >
        {children}
      </View>
    </ThemeContext.Provider>
  );
}
