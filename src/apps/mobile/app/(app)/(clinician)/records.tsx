import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";
import { useAuth } from "../../../auth/useAuth";
import { RecordsTabs } from "../../../components/records/RecordsTabs";
import { ListItem, Screen, Text } from "../../../components/ui";
import { useActivePractice } from "../../../context/ActivePracticeContext";
import { usePatients } from "../../../lib/api/hooks";

export default function ClinicianRecordsScreen() {
  const { childId } = useLocalSearchParams<{ childId?: string }>();
  const selected = typeof childId === "string" ? childId : null;

  if (!selected) return <PatientPicker />;
  return (
    <Screen scroll>
      <Text variant="heading">Records review</Text>
      <Text variant="muted" style={{ marginTop: 4 }}>
        Tap a record to approve, reject, or request more info.
      </Text>
      <View style={{ marginTop: 16 }}>
        <RecordsTabs childId={selected} mode="clinician" />
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
