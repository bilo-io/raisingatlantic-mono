import type { SystemLog, SystemLogLevel } from "@raising-atlantic/types";
import { Activity as ActivityIcon } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import {
  Badge,
  type BadgeVariant,
  EmptyState,
  ErrorState,
  ListItem,
  Screen,
  Skeleton,
  Text,
} from "../../../components/ui";
import { useActivity } from "../../../lib/api/hooks/activity";

const HIGH_SIGNAL_TYPES = new Set<string>([
  "auth_failure",
  "verification_state_change",
  "role_change",
  "tenant_created",
  "password_reset",
]);

const TYPE_LABEL: Record<string, string> = {
  auth_failure: "Auth failure",
  verification_state_change: "Verification",
  role_change: "Role change",
  tenant_created: "Tenant created",
  password_reset: "Password reset",
};

const LEVEL_VARIANT: Record<SystemLogLevel, BadgeVariant> = {
  info: "muted",
  warn: "primary",
  error: "destructive",
  debug: "muted",
};

export default function ActivityScreen() {
  const activity = useActivity();

  const filtered = React.useMemo(() => {
    const list = activity.data ?? [];
    return list.filter((l) => HIGH_SIGNAL_TYPES.has(l.type));
  }, [activity.data]);

  return (
    <Screen scroll>
      <Text variant="label">Admin</Text>
      <Text variant="heading" style={{ marginTop: 4 }}>
        Activity
      </Text>
      <Text variant="body" tone="muted" style={{ marginTop: 8 }}>
        High-signal platform events. Spot-check from your phone — full audit on web.
      </Text>

      <View style={{ marginTop: 18, gap: 10 }}>
        {activity.isLoading ? (
          <SkeletonList />
        ) : activity.error ? (
          <ErrorState
            title="Couldn't load activity"
            message={activity.error.message}
            onRetry={() => activity.refetch()}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            Icon={ActivityIcon}
            title="No recent activity"
            body="Nothing of interest in the last batch of events."
          />
        ) : (
          filtered.map((log) => <ActivityRow key={log.id} log={log} />)
        )}
      </View>

      <Text variant="caption" tone="muted" style={{ marginTop: 18, textAlign: "center" }}>
        Full audit trail is available on web.
      </Text>
    </Screen>
  );
}

function ActivityRow({ log }: { log: SystemLog }) {
  const typeLabel = TYPE_LABEL[log.type] ?? log.type;
  const subtitle = `${log.createdAt.slice(0, 16).replace("T", " ")} · ${log.actorId ? `Actor ${log.actorId.slice(-4)}` : "System"}`;
  return (
    <ListItem
      title={log.message}
      subtitle={subtitle}
      leading={<Badge label={typeLabel} variant={LEVEL_VARIANT[log.level]} />}
      showChevron={false}
    />
  );
}

function SkeletonList() {
  return (
    <View style={{ gap: 10 }}>
      <Skeleton height={68} />
      <Skeleton height={68} />
      <Skeleton height={68} />
      <Skeleton height={68} />
      <Skeleton height={68} />
    </View>
  );
}
