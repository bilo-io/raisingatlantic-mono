import type { SystemLog } from "@raising-atlantic/types";
import { useRouter } from "expo-router";
import { LogOut, ShieldCheck } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { useAuth } from "../auth/useAuth";
import { useActivity } from "../lib/api/hooks/activity";
import { useMe } from "../lib/api/hooks/users";
import { useTheme } from "../theme/useTheme";
import { Badge, Button, Card, Screen, Skeleton, Text } from "./ui";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function ProfileScreenAdmin() {
  const { tokens } = useTheme();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const me = useMe();
  const activity = useActivity();

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

  const isSuperAdmin = me.data?.role === "super_admin";
  const scopeLabel = isSuperAdmin ? "Super admin" : "Tenant admin";
  const scopeBlurb = isSuperAdmin
    ? "Cross-tenant scope. Use with care — actions touch every tenant."
    : "Scope limited to your tenant. Cross-tenant work stays on web.";

  const myActions = React.useMemo(() => {
    if (!me.data?.id) return [];
    return (activity.data ?? [])
      .filter((l) => l.actorId === me.data!.id)
      .slice(0, 5);
  }, [activity.data, me.data]);

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
          <View style={{ flexDirection: "row", gap: 6, marginTop: 4 }}>
            <Badge label="Admin" variant="muted" />
            <Badge label={scopeLabel} variant="primary" />
          </View>
        </View>
      </Card>

      <Card style={{ marginBottom: 22 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <ShieldCheck size={18} color={tokens.foreground} />
          <Text variant="title">Admin scope</Text>
        </View>
        <Text variant="muted" style={{ marginTop: 6 }}>
          {scopeBlurb}
        </Text>
      </Card>

      <Card style={{ marginBottom: 22 }}>
        <Text variant="title">My recent actions</Text>
        <View style={{ marginTop: 10, gap: 10 }}>
          {activity.isLoading ? (
            <>
              <Skeleton height={36} />
              <Skeleton height={36} />
            </>
          ) : myActions.length === 0 ? (
            <Text variant="muted">No actions attributed to you in the recent feed.</Text>
          ) : (
            myActions.map((l) => <ActionRow key={l.id} log={l} />)
          )}
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

function ActionRow({ log }: { log: SystemLog }) {
  return (
    <View style={{ gap: 2 }}>
      <Text variant="bodyStrong" numberOfLines={1}>
        {log.message}
      </Text>
      <Text variant="muted">{log.createdAt.slice(0, 16).replace("T", " ")}</Text>
    </View>
  );
}
