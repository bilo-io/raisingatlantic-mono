import type { SystemComponentStatus } from "@raising-atlantic/types";
import { useRouter } from "expo-router";
import { Activity, ShieldCheck, UserPlus } from "lucide-react-native";
import React from "react";
import { Pressable, View } from "react-native";
import { useAuth } from "../auth/useAuth";
import { useActivity } from "../lib/api/hooks/activity";
import { useSystemHealth } from "../lib/api/hooks/system";
import { useUsers } from "../lib/api/hooks/users";
import {
  useVerificationsClinicians,
  useVerificationsRecords,
} from "../lib/api/hooks/verifications";
import { useTheme } from "../theme/useTheme";
import { Badge, type BadgeVariant, Card, Screen, Skeleton, Text } from "./ui";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const STATUS_VARIANT: Record<SystemComponentStatus, BadgeVariant> = {
  ok: "primary",
  degraded: "muted",
  down: "destructive",
};

const STATUS_LABEL: Record<SystemComponentStatus, string> = {
  ok: "Healthy",
  degraded: "Degraded",
  down: "Down",
};

const ADMIN_ACTION_TYPES = new Set<string>([
  "verification_state_change",
  "role_change",
  "tenant_created",
]);

export function DashboardHomeAdmin() {
  const { user } = useAuth();
  const router = useRouter();
  const health = useSystemHealth();
  const records = useVerificationsRecords();
  const clinicians = useVerificationsClinicians();
  const users = useUsers();
  const activity = useActivity();

  if (!user) return null;

  const pendingCount =
    (records.data?.length ?? 0) + (clinicians.data?.length ?? 0);

  const recentSignups = React.useMemo(() => {
    const cutoff = Date.now() - SEVEN_DAYS_MS;
    return (users.data ?? []).filter((u) => Date.parse(u.createdAt) >= cutoff).length;
  }, [users.data]);

  const recentAdminActions = React.useMemo(() => {
    return (activity.data ?? [])
      .filter((l) => ADMIN_ACTION_TYPES.has(l.type))
      .slice(0, 3);
  }, [activity.data]);

  return (
    <Screen scroll>
      <Text variant="label">Admin dashboard</Text>
      <Text variant="heading" style={{ marginTop: 4 }}>
        Hi, {user.name.split(" ")[0]} 👋
      </Text>
      <Text variant="body" tone="muted" style={{ marginTop: 8 }}>
        Oversee users, verifications and platform health.
      </Text>

      <View style={{ marginTop: 24, gap: 14 }}>
        <HealthCard
          loading={health.isLoading}
          status={health.data?.status}
          onPress={() => router.push("/(app)/(admin)/system")}
        />

        <StatCard
          Icon={ShieldCheck}
          label="Pending verifications"
          value={
            records.isLoading || clinicians.isLoading
              ? null
              : String(pendingCount)
          }
          hint={pendingCount === 0 ? "Queue clear" : "Tap to triage"}
          onPress={() => router.push("/(app)/(admin)/verifications")}
        />

        <StatCard
          Icon={UserPlus}
          label="User signups (7d)"
          value={users.isLoading ? null : String(recentSignups)}
          onPress={() => router.push("/(app)/(admin)/users")}
        />

        <Card>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Activity size={16} />
            <Text variant="title">Recent admin actions</Text>
          </View>
          <View style={{ marginTop: 12, gap: 10 }}>
            {activity.isLoading ? (
              <>
                <Skeleton height={36} />
                <Skeleton height={36} />
                <Skeleton height={36} />
              </>
            ) : recentAdminActions.length === 0 ? (
              <Text variant="muted">No admin actions in the recent feed.</Text>
            ) : (
              recentAdminActions.map((l) => (
                <View key={l.id} style={{ gap: 2 }}>
                  <Text variant="bodyStrong" numberOfLines={1}>
                    {l.message}
                  </Text>
                  <Text variant="muted">
                    {l.createdAt.slice(0, 16).replace("T", " ")}
                  </Text>
                </View>
              ))
            )}
          </View>
        </Card>
      </View>
    </Screen>
  );
}

function HealthCard({
  loading,
  status,
  onPress,
}: {
  loading: boolean;
  status?: SystemComponentStatus;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <Card>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text variant="title">Platform health</Text>
          {!loading && status ? (
            <Badge label={STATUS_LABEL[status]} variant={STATUS_VARIANT[status]} />
          ) : null}
        </View>
        <Text variant="muted" style={{ marginTop: 6 }}>
          {loading ? "Loading…" : "Tap for component breakdown"}
        </Text>
      </Card>
    </Pressable>
  );
}

function StatCard({
  Icon,
  label,
  value,
  hint,
  onPress,
}: {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  value: string | null;
  hint?: string;
  onPress: () => void;
}) {
  const { tokens } = useTheme();
  return (
    <Pressable onPress={onPress}>
      <Card>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Icon size={18} color={tokens.foreground} />
          <Text variant="title">{label}</Text>
        </View>
        <View style={{ marginTop: 10 }}>
          {value === null ? (
            <Skeleton height={28} width={80} />
          ) : (
            <Text variant="heading">{value}</Text>
          )}
        </View>
        {hint ? (
          <Text variant="muted" style={{ marginTop: 6 }}>
            {hint}
          </Text>
        ) : null}
      </Card>
    </Pressable>
  );
}
