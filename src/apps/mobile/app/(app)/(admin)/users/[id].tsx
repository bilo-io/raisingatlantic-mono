import type { UserRole } from "@raising-atlantic/types";
import { useLocalSearchParams } from "expo-router";
import { Info } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import {
  Avatar,
  Badge,
  Card,
  ErrorState,
  KeyValueRow,
  Screen,
  Skeleton,
  Text,
} from "../../../../components/ui";
import { useUserById } from "../../../../lib/api/hooks/users";

const ROLE_LABEL: Record<UserRole, string> = {
  parent: "Parent",
  clinician: "Clinician",
  admin: "Admin",
  super_admin: "Super admin",
};

export default function UserDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const userQuery = useUserById(params.id);

  if (userQuery.isLoading) {
    return (
      <Screen scroll>
        <Skeleton height={120} />
        <View style={{ height: 16 }} />
        <Skeleton height={240} />
      </Screen>
    );
  }

  if (userQuery.error || !userQuery.data) {
    return (
      <Screen>
        <ErrorState
          title="Couldn't load user"
          message={userQuery.error?.message ?? "User not found."}
          onRetry={() => userQuery.refetch()}
        />
      </Screen>
    );
  }

  const user = userQuery.data;

  return (
    <Screen scroll>
      <View style={{ alignItems: "center", gap: 12, marginBottom: 20 }}>
        <Avatar name={user.name} size="xl" />
        <View style={{ alignItems: "center", gap: 6 }}>
          <Text variant="heading">
            {user.title ? `${user.title} ` : ""}
            {user.name}
          </Text>
          <Badge label={ROLE_LABEL[user.role]} variant="primary" />
        </View>
      </View>

      <Card>
        <Text variant="title">Account</Text>
        <View style={{ marginTop: 8 }}>
          <KeyValueRow label="Email" value={user.email} />
          <KeyValueRow label="Phone" value={user.phone} />
          <KeyValueRow label="User ID" value={user.id.slice(-12)} />
          <KeyValueRow label="Created" value={user.createdAt.slice(0, 10)} />
          <KeyValueRow label="Updated" value={user.updatedAt.slice(0, 10)} />
        </View>
      </Card>

      <Card style={{ marginTop: 14 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Info size={16} />
          <Text variant="bodyStrong">RBAC editing lives on web</Text>
        </View>
        <Text variant="muted" style={{ marginTop: 6 }}>
          Use the desktop admin console to change role assignments, practice
          affiliations, or tenant scope. Mobile is a read-only triage view.
        </Text>
      </Card>
    </Screen>
  );
}
