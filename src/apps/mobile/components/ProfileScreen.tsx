import { useRouter } from "expo-router";
import { LogOut } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { useAuth } from "../auth/useAuth";
import { Role } from "../auth/types";
import { useTheme } from "../theme/useTheme";
import { Badge, Button, Card, Screen, Text } from "./ui";
import { ThemeSwitcher } from "./ThemeSwitcher";

const ROLE_LABEL: Record<Role, string> = {
  parent: "Parent",
  clinician: "Clinician",
  admin: "Admin",
};

export function ProfileScreen() {
  const { tokens } = useTheme();
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/login");
  };

  if (!user) return null;
  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Screen scroll>
      <Text variant="heading" style={{ marginBottom: 20 }}>
        Profile
      </Text>

      <Card style={{ flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 22 }}>
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: tokens.primary,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text variant="title" tone="onPrimary" style={{ fontSize: 18 }}>
            {initials}
          </Text>
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <Text variant="title">{user.name}</Text>
          <Text variant="muted">{user.email}</Text>
          <Badge label={ROLE_LABEL[user.role]} variant="muted" style={{ marginTop: 4 }} />
        </View>
      </Card>

      <Text variant="label" style={{ marginBottom: 10 }}>
        Appearance
      </Text>
      <ThemeSwitcher />

      <Text variant="label" style={{ marginTop: 28, marginBottom: 10 }}>
        Account
      </Text>
      <Button
        label="Sign out"
        variant="destructive"
        leftIcon={LogOut}
        onPress={handleSignOut}
      />
    </Screen>
  );
}
