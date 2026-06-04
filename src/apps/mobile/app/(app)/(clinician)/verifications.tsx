import type { VerifiableRecord } from "@raising-atlantic/types";
import { ShieldCheck } from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import {
  useDecideClinicianVerification,
  useDecideRecordVerification,
  useVerificationsClinicians,
  useVerificationsRecords,
} from "../../../lib/api/hooks";
import { Badge, Button, Card, EmptyState, Screen, Tabs, Text } from "../../../components/ui";

type TabKey = "records" | "clinicians";
type Outcome = "APPROVED" | "REJECTED" | "MORE_INFO";

export default function ClinicianVerificationsScreen() {
  const [tab, setTab] = useState<TabKey>("records");

  return (
    <Screen scroll>
      <Text variant="heading">Verifications</Text>
      <Text variant="muted" style={{ marginTop: 4 }}>
        Sign off parent-logged records and incoming clinicians.
      </Text>

      <View style={{ marginTop: 14 }}>
        <Tabs
          value={tab}
          onChange={setTab}
          options={[
            { value: "records", label: "Records" },
            { value: "clinicians", label: "Clinicians" },
          ]}
        />
      </View>

      <View style={{ marginTop: 14 }}>
        {tab === "records" ? <RecordsQueue /> : <CliniciansQueue />}
      </View>
    </Screen>
  );
}

function RecordsQueue() {
  const { data = [], isLoading } = useVerificationsRecords();
  const { mutate, isPending } = useDecideRecordVerification();

  if (isLoading) return <Text variant="muted">Loading queue…</Text>;
  if (data.length === 0) {
    return <EmptyState Icon={ShieldCheck} title="No records waiting" body="You're all caught up." />;
  }

  return (
    <ScrollView>
      <View style={{ gap: 10 }}>
        {data.map((r) => (
          <Card key={r.id}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text variant="bodyStrong" style={{ flex: 1 }}>
                {recordTitle(r)}
              </Text>
              <Badge label={r.type} variant="muted" />
            </View>
            <Text variant="muted" style={{ marginTop: 4 }}>
              {recordSubtitle(r)}
            </Text>
            <DecisionActions
              loading={isPending}
              onDecide={(outcome) => mutate({ id: r.id, decision: { outcome } })}
            />
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

function CliniciansQueue() {
  const { data = [], isLoading } = useVerificationsClinicians();
  const { mutate, isPending } = useDecideClinicianVerification();

  if (isLoading) return <Text variant="muted">Loading queue…</Text>;
  if (data.length === 0) {
    return (
      <EmptyState
        Icon={ShieldCheck}
        title="No clinicians waiting"
        body="No HPCSA/SANC reviews in your queue."
      />
    );
  }

  return (
    <ScrollView>
      <View style={{ gap: 10 }}>
        {data.map((c) => (
          <Card key={c.id}>
            <Text variant="bodyStrong">
              {c.title ? `${c.title} ` : ""}
              {c.name}
            </Text>
            <Text variant="muted" style={{ marginTop: 4 }}>
              {c.email}
              {c.phone ? ` · ${c.phone}` : ""}
            </Text>
            <DecisionActions
              loading={isPending}
              onDecide={(outcome) => mutate({ id: c.id, decision: { outcome } })}
            />
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

function DecisionActions({
  loading,
  onDecide,
}: {
  loading: boolean;
  onDecide: (outcome: Outcome) => void;
}) {
  return (
    <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
      <Button
        label="Approve"
        size="sm"
        variant="secondary"
        loading={loading}
        onPress={() => onDecide("APPROVED")}
      />
      <Button
        label="More info"
        size="sm"
        variant="outline"
        loading={loading}
        onPress={() => onDecide("MORE_INFO")}
      />
      <Button
        label="Reject"
        size="sm"
        variant="destructive"
        loading={loading}
        onPress={() => onDecide("REJECTED")}
      />
    </View>
  );
}

function recordTitle(r: VerifiableRecord) {
  if (r.type === "Growth") return `Growth entry · ${formatDate(r.date)}`;
  if (r.type === "Milestone") return `Milestone · ${r.milestoneId}`;
  return `Vaccination · ${r.vaccineId}`;
}

function recordSubtitle(r: VerifiableRecord) {
  if (r.type === "Growth") {
    const w = r.weight ? `${r.weight} kg` : "—";
    const h = r.height ? `${r.height} cm` : "—";
    return `${w} · ${h}${r.notes ? ` · ${r.notes}` : ""}`;
  }
  if (r.type === "Milestone") return `Achieved ${formatDate(r.dateAchieved)}`;
  return `Administered ${formatDate(r.dateAdministered)} · ${r.source ?? "PARENT"}`;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}
