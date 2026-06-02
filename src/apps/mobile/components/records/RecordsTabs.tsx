import type { CompletedVaccination, Vaccination } from "@raising-atlantic/types";
import { standardVaccinationSchedule } from "@raising-atlantic/types";
import { Activity, Baby, Check, ShieldQuestion, Syringe, X } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { useGrowthRecords, useMilestones, useVaccinations } from "../../lib/api/hooks";
import { useDecideRecordVerification } from "../../lib/api/hooks/verification-decisions";
import { useTheme } from "../../theme/useTheme";
import { Badge, Button, Card, EmptyState, Skeleton, Tabs, Text } from "../ui";

type Mode = "parent" | "clinician";

type Props = {
  childId: string;
  mode: Mode;
};

type TabKey = "growth" | "milestones" | "vaccinations";

export function RecordsTabs({ childId, mode }: Props) {
  const [tab, setTab] = useState<TabKey>("growth");

  return (
    <View style={{ gap: 14 }}>
      <Tabs
        value={tab}
        onChange={setTab}
        options={[
          { value: "growth", label: "Growth" },
          { value: "milestones", label: "Milestones" },
          { value: "vaccinations", label: "Vaccinations" },
        ]}
      />
      {tab === "growth" ? <GrowthList childId={childId} mode={mode} /> : null}
      {tab === "milestones" ? <MilestonesList childId={childId} mode={mode} /> : null}
      {tab === "vaccinations" ? <VaccinationsList childId={childId} mode={mode} /> : null}
    </View>
  );
}

function GrowthList({ childId, mode }: { childId: string; mode: Mode }) {
  const { data, isLoading } = useGrowthRecords(childId);
  if (isLoading) return <SkeletonStack />;
  const rows = data ?? [];
  if (rows.length === 0) {
    return <EmptyState Icon={Activity} title="No growth entries yet" />;
  }
  return (
    <View style={{ gap: 10 }}>
      {rows.map((g) => (
        <Card key={g.id}>
          <RowHeader title={formatDate(g.date)} status={g.status} />
          <Text variant="body" style={{ marginTop: 6 }}>
            {g.weight ? `${g.weight} kg` : "—"} · {g.height ? `${g.height} cm` : "—"}
            {g.headCircumference ? ` · ${g.headCircumference} cm head` : ""}
          </Text>
          {g.notes ? (
            <Text variant="muted" style={{ marginTop: 4 }}>
              {g.notes}
            </Text>
          ) : null}
          {mode === "clinician" && g.status === "Pending Assessment" ? (
            <VerificationActions recordId={g.id} />
          ) : null}
        </Card>
      ))}
    </View>
  );
}

function MilestonesList({ childId, mode }: { childId: string; mode: Mode }) {
  const { data, isLoading } = useMilestones(childId);
  if (isLoading) return <SkeletonStack />;
  const rows = data ?? [];
  if (rows.length === 0) {
    return <EmptyState Icon={Baby} title="No milestones logged yet" />;
  }
  return (
    <View style={{ gap: 10 }}>
      {rows.map((m) => (
        <Card key={m.id}>
          <RowHeader title={prettyMilestoneId(m.milestoneId)} status={m.status} />
          <Text variant="muted" style={{ marginTop: 4 }}>
            Achieved {formatDate(m.dateAchieved)}
          </Text>
          {mode === "clinician" && m.status === "Pending Assessment" ? (
            <VerificationActions recordId={m.id} />
          ) : null}
        </Card>
      ))}
    </View>
  );
}

function VaccinationsList({ childId, mode }: { childId: string; mode: Mode }) {
  const { data, isLoading } = useVaccinations(childId);
  if (isLoading) return <SkeletonStack />;
  const completed = data ?? [];

  const groups = useMemo(() => bucketEpiSchedule(completed), [completed]);

  return (
    <View style={{ gap: 14 }}>
      {(["due", "overdue", "complete"] as const).map((bucket) => {
        const items = groups[bucket];
        if (items.length === 0) return null;
        return (
          <View key={bucket} style={{ gap: 8 }}>
            <Text variant="label">{BUCKET_LABEL[bucket]}</Text>
            {items.map((v) => (
              <Card key={v.vaccine.id}>
                <RowHeader
                  title={v.vaccine.name}
                  status={v.completed?.status ?? null}
                  fallbackBadge={bucket === "complete" ? null : bucket}
                />
                <Text variant="muted" style={{ marginTop: 4 }}>
                  {v.vaccine.recommendedAge} · {v.vaccine.doseInfo}
                </Text>
                {v.completed?.dateAdministered ? (
                  <Text variant="muted" style={{ marginTop: 2 }}>
                    Administered {formatDate(v.completed.dateAdministered)}
                  </Text>
                ) : null}
                {mode === "clinician" &&
                v.completed?.status === "Pending Assessment" ? (
                  <VerificationActions recordId={v.completed.id} />
                ) : null}
              </Card>
            ))}
          </View>
        );
      })}
      {completed.length === 0 && groups.due.length === 0 ? (
        <EmptyState Icon={Syringe} title="No vaccinations on record yet" />
      ) : null}
    </View>
  );
}

function VerificationActions({ recordId }: { recordId: string }) {
  const { mutate, isPending } = useDecideRecordVerification();
  return (
    <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
      <Button
        label="Approve"
        size="sm"
        variant="secondary"
        leftIcon={Check}
        loading={isPending}
        onPress={() =>
          mutate({ id: recordId, decision: { outcome: "APPROVED" } })
        }
      />
      <Button
        label="More info"
        size="sm"
        variant="outline"
        leftIcon={ShieldQuestion}
        loading={isPending}
        onPress={() =>
          mutate({ id: recordId, decision: { outcome: "MORE_INFO" } })
        }
      />
      <Button
        label="Reject"
        size="sm"
        variant="destructive"
        leftIcon={X}
        loading={isPending}
        onPress={() =>
          mutate({ id: recordId, decision: { outcome: "REJECTED" } })
        }
      />
    </View>
  );
}

function RowHeader({
  title,
  status,
  fallbackBadge,
}: {
  title: string;
  status: string | null;
  fallbackBadge?: "due" | "overdue" | null;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
      <Text variant="bodyStrong" style={{ flex: 1 }}>
        {title}
      </Text>
      <StatusBadge status={status} fallbackBadge={fallbackBadge} />
    </View>
  );
}

function StatusBadge({
  status,
  fallbackBadge,
}: {
  status: string | null;
  fallbackBadge?: "due" | "overdue" | null;
}) {
  if (status === "Pending Assessment") return <Badge label="Pending review" variant="muted" />;
  if (status === "Active") return <Badge label="Verified" variant="primary" />;
  if (status === "Archived") return <Badge label="Archived" variant="muted" />;
  if (fallbackBadge === "overdue") return <Badge label="Overdue" variant="destructive" />;
  if (fallbackBadge === "due") return <Badge label="Due now" variant="muted" />;
  return null;
}

function SkeletonStack() {
  return (
    <View style={{ gap: 10 }}>
      <Skeleton height={80} radius={12} />
      <Skeleton height={80} radius={12} />
      <Skeleton height={80} radius={12} />
    </View>
  );
}

const BUCKET_LABEL: Record<"due" | "overdue" | "complete", string> = {
  overdue: "Overdue",
  due: "Due now",
  complete: "Complete",
};

type ScheduleRow = {
  vaccine: Vaccination;
  completed: CompletedVaccination | null;
};

function bucketEpiSchedule(completed: CompletedVaccination[]) {
  const byId = new Map(completed.map((c) => [c.vaccineId, c]));
  const out: Record<"due" | "overdue" | "complete", ScheduleRow[]> = {
    overdue: [],
    due: [],
    complete: [],
  };
  for (const vaccine of standardVaccinationSchedule) {
    const match = byId.get(vaccine.id) ?? null;
    if (match && match.status !== "Pending Assessment") {
      out.complete.push({ vaccine, completed: match });
    } else if (match) {
      out.due.push({ vaccine, completed: match });
    } else {
      out.due.push({ vaccine, completed: null });
    }
  }
  return out;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function prettyMilestoneId(id: string) {
  const [category, slug] = id.split(".");
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  return slug ? `${cap(category)} — ${cap(slug.replace(/-/g, " "))}` : cap(id);
}
