import "../global.css";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Toaster } from "sonner-native";
import { AuthProvider } from "../auth/AuthContext";
import { queryClient } from "../lib/api";
import { initSentry, Sentry } from "../lib/sentry";
import { ThemeProvider } from "../theme/ThemeProvider";
import { useTheme } from "../theme/useTheme";

initSentry();

function StatusBarThemed() {
  const { resolvedScheme } = useTheme();
  return <StatusBar style={resolvedScheme === "dark" ? "light" : "dark"} />;
}

function ThemedToaster() {
  const { tokens, resolvedScheme } = useTheme();
  return (
    <Toaster
      theme={resolvedScheme}
      richColors
      position="top-center"
      offset={50}
      toastOptions={{
        style: {
          backgroundColor: tokens.card,
          borderColor: tokens.border,
        },
      }}
    />
  );
}

function RootLayout() {
  // Surfaces the React Query cache in the Expo dev menu. The hook self-gates to
  // __DEV__ and is a no-op in production builds.
  useReactQueryDevTools(queryClient);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <BottomSheetModalProvider>
                <StatusBarThemed />
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="index" />
                  <Stack.Screen name="(auth)" />
                  <Stack.Screen name="(app)" />
                </Stack>
                <ThemedToaster />
              </BottomSheetModalProvider>
            </AuthProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

// Wrap with Sentry to attach the root-level ErrorBoundary + tracing
// instrumentation. When DSN is unset, init is a no-op so the wrapper is inert.
export default Sentry.wrap(RootLayout);
