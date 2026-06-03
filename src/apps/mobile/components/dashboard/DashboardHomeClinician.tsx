import type { Appointment } from "@raising-atlantic/types";
import { router } from "expo-router";
import { CalendarDays, ClipboardCheck, ShieldCheck, Users } from "lucide-react-native";
import React, { useMemo } from "react";
import { Pressable, View } from "react-native";
import { useAuth } from "../../auth/useAuth";
import {
  useAppointments,
  useVerificationsClinicians,
  useVerificationsRecords,
} from "../../lib/api/hooks";
import { recentVerificationActivity } from "../../lib/api/hooks/verification-decisions";
import { useActivePractice } from "../../context/ActivePracticeContext";
import { Card, Screen, Stat, Text } from "../ui";

export function DashboardHomeClinician() {
  const { user } = useAuth();
  const { practice } = useActivePractice();
  const { data: pendingRecords = [] } = useVerificationsRecords();
  const { data: pendingClinicians = [] } = useVerificationsClinicians();
  const { data: appointments = [] } = useAppointments();

  const scoped = useMemo<Appointment[]>(() => {
    if (!user) return [];
    return appointments.filter((a) => a.clinicianId === user.id);
  }, [appointments, user]);

  const today = new Date().toISOString().slice(0, 10);
  const todays = scoped.filter((a) => a.scheduledAt.slice(0, 10) === today);

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const seenThisWeek = scoped.filter(
    (a) => a.status === "COMPLETED" && new Date(a.scheduledAt).getTime() >= weekAgo.getTime(),
  );

  const pendingTotal = pendingRecords.length + pendingClinicians.length;
  const recent = recentVerificationActivity();

  if (!user) return null;

  return (
    <Screen scroll>
      <Text variant="label">Clinician dashboard</Text>
      <Text variant="heading" style={{ marginTop: 4 }}>
        Hi, {user.name.split(" ")[0]} 👋
      </Text>
      {practice ? (
        <Text variant="muted" style={{ marginTop: 8 }}>
          {practice.name}
        </Text>
      ) : null}

      <View style={{ flexDirection: "row", gap: 10, marginTop: 18 }}>
        <Pressable
          style={{ flex: 1 }}
          onPress={() => router.push("/(app)/(clinician)/verifications")}
        >
          <Stat label="Pending reviews" value={pendingTotal} Icon={ShieldCheck} />
        </Pressable>
        <Pressable
          style={{ flex: 1 }}
          onPress={() => router.push("/(app)/(clinician)/schedule")}
        >
          <Stat label="Today" value={todays.length} Icon={CalendarDays} />
        </Pressable>
      </View>

      <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
        <Pressable style={{ flex: 1 }} onPress={() => router.push("/(app)/(clinician)/patients")}>
          <Stat label="Seen this week" value={seenThisWeek.length} Icon={Users} />
        </Pressable>
        <Pressable style={{ flex: 1 }} onPress={() => router.push("/(app)/(clinician)/records")}>
          <Stat label="Decisions logged" value={recent.length} Icon={ClipboardCheck} />
        </Pressable>
      </View>

      <View style={{ marginTop: 24, gap: 10 }}>
        <Text variant="label">Today's appointments</Text>
        {todays.length === 0 ? (
          <Card>
            <Text variant="muted">No appointments today.</Text>
          </Card>
        ) : (
          todays
            .slice(0, 3)
            .map((a) => (
              <Card key={a.id}>
                <Text variant="bodyStrong">{formatTime(a.scheduledAt)}</Text>
                <Text variant="muted" style={{ marginTop: 2 }}>
                  {a.notes ?? a.status}
                </Text>
              </Card>
            ))
        )}
      </View>

      <View style={{ marginTop: 24, gap: 10 }}>
        <Text variant="label">Recent activity</Text>
        {recent.length === 0 ? (
          <Card>
            <Text variant="muted">No recent decisions yet.</Text>
          </Card>
        ) : (
          recent.map((r) => (
            <Card key={r.id}>
              <Text variant="bodyStrong">
                {r.kind === "record" ? "Record" : "Clinician"} · {r.outcome}
              </Text>
              <Text variant="muted" style={{ marginTop: 2 }}>
                {formatDateTime(r.at)}
              </Text>
            </Card>
          ))
        )}
      </View>
    </Screen>
  );
}

function formatTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
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
