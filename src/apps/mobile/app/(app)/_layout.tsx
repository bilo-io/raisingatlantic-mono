import { Redirect, Stack } from "expo-router";
import React from "react";
import { useAuth } from "../../auth/useAuth";

export default function AppLayout() {
  const { user, isHydrating } = useAuth();
  if (isHydrating) return null;
  if (!user) return <Redirect href="/(auth)/login" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
