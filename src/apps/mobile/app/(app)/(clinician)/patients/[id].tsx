import { router, useLocalSearchParams } from "expo-router";
import { CalendarPlus, FileText } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import {
  useAppointments,
  useChild,
} from "../../../../lib/api/hooks";
import { Badge, Button, Card, KeyValueRow, Screen, SectionHeader, Text } from "../../../../components/ui";

export default function PatientDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const childId = typeof id === "string" ? id : undefined;
  const { data: child, isLoading } = useChild(childId);
  const { data: appointments = [] } = useAppointments();

  if (isLoading) {
    return (
      <Screen scroll>
        <Text variant="muted">Loading patient…</Text>
      </Screen>
    );
  }
  if (!child) {
    return (
      <Screen scroll>
        <Text variant="heading">Patient not found</Text>
      </Screen>
    );
  }

  const childAppointments = appointments
    .filter((a) => a.childId === child.id)
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

  return (
    <Screen scroll>
      <Text variant="label">Patient</Text>
      <Text variant="heading" style={{ marginTop: 4 }}>
        {child.firstName} {child.lastName}
      </Text>
      <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
        <Badge label={child.status} variant={child.status === "Active" ? "primary" : "muted"} />
        <Badge label={child.gender} variant="muted" />
      </View>

      <Card style={{ marginTop: 18 }}>
        <KeyValueRow label="Date of birth" value={formatDate(child.dateOfBirth)} />
        <KeyValueRow label="Progress" value={`${child.progress}%`} />
        {child.notes ? <KeyValueRow label="Notes" value={child.notes} /> : null}
      </Card>

      <View style={{ marginTop: 24 }}>
        <SectionHeader title="Records" />
      </View>
      <Button
        label="Open records review"
        leftIcon={FileText}
        variant="outline"
        onPress={() => router.push(`/(app)/(clinician)/records?childId=${child.id}`)}
      />

      <View style={{ marginTop: 24 }}>
        <SectionHeader title="Upcoming appointments" />
      </View>
      {childAppointments.length === 0 ? (
        <Text variant="muted">No appointments scheduled.</Text>
      ) : (
        <View style={{ gap: 8 }}>
          {childAppointments.map((a) => (
            <Card key={a.id}>
              <Text variant="bodyStrong">{formatDateTime(a.scheduledAt)}</Text>
              <Text variant="muted" style={{ marginTop: 2 }}>
                {a.notes ?? a.status}
              </Text>
            </Card>
          ))}
        </View>
      )}
      <Button
        label="Schedule appointment"
        leftIcon={CalendarPlus}
        variant="ghost"
        style={{ marginTop: 12 }}
        onPress={() => router.push("/(app)/(clinician)/schedule")}
      />
    </Screen>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
