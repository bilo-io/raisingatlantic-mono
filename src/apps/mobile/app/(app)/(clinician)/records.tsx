import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { useAuth } from "../../../auth/useAuth";
import { RecordsTabs } from "../../../components/records/RecordsTabs";
import { GrowthTab } from "../../../components/records/GrowthTab";
import { MilestonesTab } from "../../../components/records/MilestonesTab";
import { VaccinationsTab } from "../../../components/records/VaccinationsTab";
import { ListItem, Screen, Tabs, Text } from "../../../components/ui";
import { useActivePractice } from "../../../context/ActivePracticeContext";
import { useChild, usePatients } from "../../../lib/api/hooks";

type ScreenMode = "review" | "log";
type LogTab = "growth" | "milestones" | "vaccinations";

export default function ClinicianRecordsScreen() {
  const { childId } = useLocalSearchParams<{ childId?: string }>();
  const selected = typeof childId === "string" ? childId : null;

  if (!selected) return <PatientPicker />;
  return <RecordsForChild childId={selected} />;
}

function RecordsForChild({ childId }: { childId: string }) {
  const [mode, setMode] = useState<ScreenMode>("review");
  const [logTab, setLogTab] = useState<LogTab>("growth");
  const { data: child } = useChild(childId);

  return (
    <Screen scroll>
      <Text variant="heading">Records</Text>
      <Text variant="muted" style={{ marginTop: 4 }}>
        {mode === "review"
          ? "Tap a pending record to approve, reject, or request more info."
          : "Records you log here are auto-verified and attributed to you."}
      </Text>

      <View style={{ marginTop: 14 }}>
        <Tabs<ScreenMode>
          value={mode}
          onChange={setMode}
          options={[
            { value: "review", label: "Review" },
            { value: "log", label: "Log" },
          ]}
        />
      </View>

      <View style={{ marginTop: 16 }}>
        {mode === "review" ? (
          <RecordsTabs childId={childId} mode="clinician" />
        ) : !child ? (
          <Text variant="muted">Loading patient…</Text>
        ) : (
          <View style={{ gap: 14 }}>
            <Tabs<LogTab>
              value={logTab}
              onChange={setLogTab}
              options={[
                { value: "growth", label: "Growth" },
                { value: "milestones", label: "Milestones" },
                { value: "vaccinations", label: "Vaccinations" },
              ]}
            />
            {logTab === "growth" ? (
              <GrowthTab child={child} source="CLINICIAN" />
            ) : logTab === "milestones" ? (
              <MilestonesTab child={child} source="CLINICIAN" />
            ) : (
              <VaccinationsTab child={child} source="CLINICIAN" />
            )}
          </View>
        )}
      </View>
    </Screen>
  );
}

function PatientPicker() {
  const { user } = useAuth();
  const { practiceId } = useActivePractice();
  const { data = [] } = usePatients(
    user ? { clinicianId: user.id, practiceId: practiceId ?? undefined } : undefined,
  );
  const rows = user ? data.filter((p) => p.clinicianId === user.id) : data;

  return (
    <Screen scroll>
      <Text variant="heading">Records review</Text>
      <Text variant="muted" style={{ marginTop: 4 }}>
        Pick a patient to review their records.
      </Text>
      <View style={{ marginTop: 16, gap: 10 }}>
        {rows.length === 0 ? (
          <Text variant="muted">No patients assigned yet.</Text>
        ) : (
          rows.map((p) => (
            <ListItem
              key={p.id}
              title={`${p.firstName} ${p.lastName}`}
              subtitle={p.status}
              onPress={() =>
                router.push(`/(app)/(clinician)/records?childId=${p.id}`)
              }
            />
          ))
        )}
      </View>
    </Screen>
  );
}
