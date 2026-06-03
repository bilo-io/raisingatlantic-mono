import "../global.css";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Toaster } from "sonner-native";
import { AuthProvider } from "../auth/AuthContext";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { OfflineBanner } from "../components/OfflineBanner";
import { queryClient } from "../lib/api";
import { useDeepLinkGate } from "../lib/linking/useDeepLinkGate";
import { configureNotificationHandler } from "../lib/push/handler";
import { initSentry } from "../lib/sentry/init";
import { ThemeProvider } from "../theme/ThemeProvider";
import { useTheme } from "../theme/useTheme";

initSentry();
configureNotificationHandler();

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

function DeepLinkGate() {
  useDeepLinkGate();
  return null;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
              <AuthProvider>
                <BottomSheetModalProvider>
                  <StatusBarThemed />
                  <DeepLinkGate />
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="(auth)" />
                    <Stack.Screen name="(app)" />
                  </Stack>
                  <OfflineBanner />
                  <ThemedToaster />
                </BottomSheetModalProvider>
              </AuthProvider>
            </QueryClientProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
