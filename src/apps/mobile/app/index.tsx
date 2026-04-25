import { Redirect } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../auth/useAuth";
import { useTheme } from "../theme/useTheme";

export default function Index() {
  const { user, isHydrating } = useAuth();
  const { tokens } = useTheme();

  if (isHydrating) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: tokens.background,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color={tokens.primary} />
      </View>
    );
  }

  if (!user) return <Redirect href="/(auth)/login" />;
  return <Redirect href={`/(app)/(${user.role})/dashboard` as any} />;
}
