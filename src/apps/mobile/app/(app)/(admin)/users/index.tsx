import type { UserRole } from "@raising-atlantic/types";
import { useRouter } from "expo-router";
import { Users as UsersIcon } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import {
  Avatar,
  Badge,
  ChipRow,
  EmptyState,
  ErrorState,
  ListItem,
  Screen,
  SearchBar,
  Skeleton,
  Text,
} from "../../../../components/ui";
import { useUsers } from "../../../../lib/api/hooks/users";

type RoleFilter = "all" | UserRole;

const ROLE_OPTIONS: { value: RoleFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "parent", label: "Parent" },
  { value: "clinician", label: "Clinician" },
  { value: "admin", label: "Admin" },
  { value: "super_admin", label: "Super admin" },
];

const ROLE_LABEL: Record<UserRole, string> = {
  parent: "Parent",
  clinician: "Clinician",
  admin: "Admin",
  super_admin: "Super admin",
};

export default function UsersScreen() {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [role, setRole] = React.useState<RoleFilter>("all");

  const users = useUsers(role === "all" ? undefined : { role });

  const filtered = React.useMemo(() => {
    const list = users.data ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  }, [users.data, search]);

  return (
    <Screen scroll>
      <Text variant="label">Admin</Text>
      <Text variant="heading" style={{ marginTop: 4 }}>
        Users
      </Text>
      <Text variant="body" tone="muted" style={{ marginTop: 8 }}>
        Triage and inspect platform users. RBAC edits stay on web.
      </Text>

      <View style={{ marginTop: 20, gap: 12 }}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search by name or email"
        />
        <ChipRow<RoleFilter> options={ROLE_OPTIONS} value={role} onChange={setRole} />
      </View>

      <View style={{ marginTop: 18, gap: 10 }}>
        {users.isLoading ? (
          <SkeletonList />
        ) : users.error ? (
          <ErrorState
            title="Couldn't load users"
            message={users.error.message}
            onRetry={() => users.refetch()}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            Icon={UsersIcon}
            title="No users match"
            body="Try clearing filters or searching by a different term."
          />
        ) : (
          filtered.map((u) => (
            <ListItem
              key={u.id}
              title={`${u.title ? `${u.title} ` : ""}${u.name}`}
              subtitle={u.email}
              leading={<Avatar name={u.name} size="md" />}
              trailing={<Badge label={ROLE_LABEL[u.role]} variant="muted" />}
              onPress={() => router.push(`/(app)/(admin)/users/${u.id}`)}
            />
          ))
        )}
      </View>
    </Screen>
  );
}

function SkeletonList() {
  return (
    <View style={{ gap: 10 }}>
      <Skeleton height={68} />
      <Skeleton height={68} />
      <Skeleton height={68} />
      <Skeleton height={68} />
    </View>
  );
}
