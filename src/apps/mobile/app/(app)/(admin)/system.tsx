import type {
  FeatureFlag,
  SystemComponentStatus,
  SystemHealth,
  TenantSummary,
} from "@raising-atlantic/types";
import React from "react";
import { View } from "react-native";
import {
  Badge,
  type BadgeVariant,
  Card,
  ErrorState,
  KeyValueRow,
  Screen,
  Skeleton,
  Text,
} from "../../../components/ui";
import {
  useFeatureFlags,
  useSystemHealth,
  useTenantSummaries,
} from "../../../lib/api/hooks/system";

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

export default function SystemScreen() {
  const health = useSystemHealth();
  const flags = useFeatureFlags();
  const tenants = useTenantSummaries();

  return (
    <Screen scroll>
      <Text variant="label">Admin</Text>
      <Text variant="heading" style={{ marginTop: 4 }}>
        System
      </Text>
      <Text variant="body" tone="muted" style={{ marginTop: 8 }}>
        Read-only platform health summary. Full configuration is on web.
      </Text>

      <View style={{ marginTop: 20, gap: 14 }}>
        <HealthCard query={health} />
        <FlagsCard query={flags} />
        <TenantsCard query={tenants} />
      </View>

      <Text variant="caption" tone="muted" style={{ marginTop: 18, textAlign: "center" }}>
        Full system configuration is available on web.
      </Text>
    </Screen>
  );
}

type QueryShape<T> = {
  data: T | undefined;
  isLoading: boolean;
  error: { message: string } | null;
  refetch: () => void;
};

function HealthCard({ query }: { query: QueryShape<SystemHealth> }) {
  if (query.isLoading) return <Skeleton height={160} />;
  if (query.error || !query.data) {
    return (
      <Card>
        <ErrorState
          title="Couldn't load health"
          message={query.error?.message ?? "Unknown error"}
          onRetry={() => query.refetch()}
        />
      </Card>
    );
  }
  const h = query.data;
  return (
    <Card>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Text variant="title">Platform health</Text>
        <Badge label={STATUS_LABEL[h.status]} variant={STATUS_VARIANT[h.status]} />
      </View>
      <Text variant="muted" style={{ marginTop: 6 }}>
        Last checked {h.lastCheckedAt.slice(0, 16).replace("T", " ")}
      </Text>
      <View style={{ marginTop: 10 }}>
        <ComponentRow label="API" status={h.components.api} />
        <ComponentRow label="Database" status={h.components.db} />
        <ComponentRow label="Queue" status={h.components.queue} />
      </View>
    </Card>
  );
}

function ComponentRow({ label, status }: { label: string; status: SystemComponentStatus }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 8,
      }}
    >
      <Text variant="body">{label}</Text>
      <Badge label={STATUS_LABEL[status]} variant={STATUS_VARIANT[status]} />
    </View>
  );
}

function FlagsCard({ query }: { query: QueryShape<FeatureFlag[]> }) {
  if (query.isLoading) return <Skeleton height={200} />;
  if (query.error || !query.data) {
    return (
      <Card>
        <ErrorState
          title="Couldn't load flags"
          message={query.error?.message ?? "Unknown error"}
          onRetry={() => query.refetch()}
        />
      </Card>
    );
  }
  return (
    <Card>
      <Text variant="title">Feature flags</Text>
      <Text variant="muted" style={{ marginTop: 6 }}>
        Read-only. Toggle on web.
      </Text>
      <View style={{ marginTop: 10 }}>
        {query.data.map((f) => (
          <View
            key={f.key}
            style={{
              paddingVertical: 10,
              borderBottomWidth: 1,
              borderBottomColor: "rgba(0,0,0,0.06)",
              gap: 6,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <Text variant="bodyStrong" numberOfLines={1} style={{ flex: 1 }}>
                {f.label}
              </Text>
              <Badge
                label={f.enabled ? "On" : "Off"}
                variant={f.enabled ? "primary" : "muted"}
              />
            </View>
            <Text variant="muted" numberOfLines={1}>
              {f.key}
              {typeof f.rolloutPercent === "number" ? ` · ${f.rolloutPercent}% rollout` : ""}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

function TenantsCard({ query }: { query: QueryShape<TenantSummary[]> }) {
  if (query.isLoading) return <Skeleton height={140} />;
  if (query.error || !query.data) {
    return (
      <Card>
        <ErrorState
          title="Couldn't load tenants"
          message={query.error?.message ?? "Unknown error"}
          onRetry={() => query.refetch()}
        />
      </Card>
    );
  }
  return (
    <Card>
      <Text variant="title">Tenants</Text>
      <Text variant="muted" style={{ marginTop: 6 }}>
        {query.data.length} active
      </Text>
      <View style={{ marginTop: 8 }}>
        {query.data.map((t) => (
          <KeyValueRow
            key={t.id}
            label={t.name}
            value={`${t.userCount} users · ${t.practiceCount} practices`}
          />
        ))}
      </View>
    </Card>
  );
}
