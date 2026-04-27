import { Redirect, Stack } from "expo-router";
import React from "react";
import { View } from "react-native";
import { useAuth } from "../../auth/useAuth";
import { TopBar } from "../../components/TopBar";

export default function AppLayout() {
  const { user, isHydrating } = useAuth();
  if (isHydrating) return null;
  if (!user) return <Redirect href="/(auth)/login" />;
  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
      <TopBar />
    </View>
  );
}
