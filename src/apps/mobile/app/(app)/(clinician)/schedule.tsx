import type { Appointment } from "@raising-atlantic/types";
import { CalendarDays } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useAuth } from "../../../auth/useAuth";
import { Card, EmptyState, Screen, Tabs, Text } from "../../../components/ui";
import { useActivePractice } from "../../../context/ActivePracticeContext";
import { useAppointments, useChild } from "../../../lib/api/hooks";

type ScheduleView = "day" | "week";

const NOW = "2026-01-15T10:00:00.000Z";

export default function ScheduleScreen() {
  const { user } = useAuth();
  const { practiceId, practice } = useActivePractice();
  const { data = [], isLoading } = useAppointments();
  const [view, setView] = useState<ScheduleView>("day");
  const [day, setDay] = useState<Date>(startOfDay(new Date(NOW)));

  const scoped = useMemo(() => {
    if (!user) return [] as Appointment[];
    return data.filter(
      (a) => a.clinicianId === user.id && (!practiceId || a.practiceId === practiceId),
    );
  }, [data, user, practiceId]);

  return (
    <Screen scroll>
      <Text variant="heading">Schedule</Text>
      <Text variant="muted" style={{ marginTop: 4 }}>
        {practice ? practice.name : "All practices"}
      </Text>

      <View style={{ marginTop: 14 }}>
        <Tabs
          value={view}
          onChange={setView}
          options={[
            { value: "day", label: "Day" },
            { value: "week", label: "Week" },
          ]}
        />
      </View>

      <View style={{ marginTop: 16 }}>
        {isLoading ? (
          <Text variant="muted">Loading schedule…</Text>
        ) : view === "day" ? (
          <DayView day={day} appointments={scoped} />
        ) : (
          <WeekView
            anchor={day}
            appointments={scoped}
            onPickDay={(d) => {
              setDay(d);
              setView("day");
            }}
          />
        )}
      </View>
    </Screen>
  );
}

function DayView({ day, appointments }: { day: Date; appointments: Appointment[] }) {
  const dayKey = day.toISOString().slice(0, 10);
  const rows = appointments
    .filter((a) => a.scheduledAt.slice(0, 10) === dayKey)
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

  return (
    <View style={{ gap: 10 }}>
      <Text variant="label">{formatDayHeading(day)}</Text>
      {rows.length === 0 ? (
        <EmptyState Icon={CalendarDays} title="No appointments" body="Nothing on the books for this day." />
      ) : (
        rows.map((a) => <AppointmentCard key={a.id} appointment={a} />)
      )}
    </View>
  );
}

function WeekView({
  anchor,
  appointments,
  onPickDay,
}: {
  anchor: Date;
  appointments: Appointment[];
  onPickDay: (d: Date) => void;
}) {
  const days = useMemo(() => weekDays(anchor), [anchor]);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={{ flexDirection: "row", gap: 10 }}>
        {days.map((d) => {
          const key = d.toISOString().slice(0, 10);
          const count = appointments.filter((a) => a.scheduledAt.slice(0, 10) === key).length;
          return (
            <Pressable key={key} onPress={() => onPickDay(d)}>
              <Card style={{ minWidth: 120 }}>
                <Text variant="label">
                  {d.toLocaleDateString(undefined, { weekday: "short" })}
                </Text>
                <Text variant="title" style={{ marginTop: 4 }}>
                  {d.getDate()}
                </Text>
                <Text variant="muted" style={{ marginTop: 6 }}>
                  {count === 0 ? "—" : `${count} appt${count === 1 ? "" : "s"}`}
                </Text>
              </Card>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const { data: child } = useChild(appointment.childId ?? undefined);
  return (
    <Card>
      <Text variant="bodyStrong">{formatTime(appointment.scheduledAt)}</Text>
      <Text variant="muted" style={{ marginTop: 4 }}>
        {child ? `${child.firstName} ${child.lastName}` : "Patient TBC"}
      </Text>
      {appointment.notes ? (
        <Text variant="body" style={{ marginTop: 4 }}>
          {appointment.notes}
        </Text>
      ) : null}
      <Text variant="caption" style={{ marginTop: 8 }}>
        {appointment.status}
      </Text>
    </Card>
  );
}

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function weekDays(anchor: Date) {
  const start = startOfDay(anchor);
  const dow = start.getDay();
  const monday = new Date(start);
  monday.setDate(start.getDate() - ((dow + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function formatTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function formatDayHeading(d: Date) {
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
