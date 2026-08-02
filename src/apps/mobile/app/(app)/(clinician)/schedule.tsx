import type { Appointment, UpdateAppointmentInput } from "@raising-atlantic/types";
import { CalendarDays } from "lucide-react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useAuth } from "../../../auth/useAuth";
import {
  Badge,
  BottomSheet,
  BottomSheetRef,
  Button,
  Card,
  EmptyState,
  Input,
  KeyValueRow,
  Screen,
  Tabs,
  Text,
} from "../../../components/ui";
import { useActivePractice } from "../../../context/ActivePracticeContext";
import { useAppointments, useChild, useUpdateAppointment } from "../../../lib/api/hooks";

type ScheduleView = "day" | "week";

const NOW = "2026-01-15T10:00:00.000Z";

export default function ScheduleScreen() {
  const { user } = useAuth();
  const { practiceId, practice } = useActivePractice();
  const { data = [], isLoading } = useAppointments();
  const [view, setView] = useState<ScheduleView>("day");
  const [day, setDay] = useState<Date>(startOfDay(new Date(NOW)));
  const [selected, setSelected] = useState<Appointment | null>(null);
  const visitSheetRef = useRef<BottomSheetRef>(null);

  const scoped = useMemo(() => {
    if (!user) return [] as Appointment[];
    return data.filter(
      (a) => a.clinicianId === user.id && (!practiceId || a.practiceId === practiceId),
    );
  }, [data, user, practiceId]);

  function openVisit(appointment: Appointment) {
    setSelected(appointment);
    visitSheetRef.current?.present();
  }

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
          <DayView day={day} appointments={scoped} onOpen={openVisit} />
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

      <VisitNoteSheet sheetRef={visitSheetRef} appointment={selected} />
    </Screen>
  );
}

function DayView({
  day,
  appointments,
  onOpen,
}: {
  day: Date;
  appointments: Appointment[];
  onOpen: (appointment: Appointment) => void;
}) {
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
        rows.map((a) => <AppointmentCard key={a.id} appointment={a} onOpen={onOpen} />)
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

function AppointmentCard({
  appointment,
  onOpen,
}: {
  appointment: Appointment;
  onOpen: (appointment: Appointment) => void;
}) {
  const { data: child } = useChild(appointment.childId ?? undefined);
  return (
    <Pressable
      onPress={() => onOpen(appointment)}
      accessibilityRole="button"
      accessibilityLabel={`Open visit note for ${child ? `${child.firstName} ${child.lastName}` : "patient"}`}
      testID={`appointment-card-${appointment.id}`}
    >
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
    </Pressable>
  );
}

// Record-of-visit entry (M2.4): patient summary + a visit note that writes back to the
// appointment. Logging a note on a SCHEDULED visit marks it COMPLETED. Backed by the
// appointments controller (PATCH) via useUpdateAppointment.
function VisitNoteSheet({
  sheetRef,
  appointment,
}: {
  sheetRef: React.RefObject<BottomSheetRef | null>;
  appointment: Appointment | null;
}) {
  const { data: child } = useChild(appointment?.childId ?? undefined);
  const update = useUpdateAppointment();
  const [note, setNote] = useState("");

  useEffect(() => {
    setNote(appointment?.notes ?? "");
  }, [appointment?.id, appointment?.notes]);

  function save() {
    if (!appointment) return;
    const patch: UpdateAppointmentInput = {
      notes: note.trim() || undefined,
      status: appointment.status === "SCHEDULED" ? "COMPLETED" : appointment.status,
    };
    update.mutate(
      { id: appointment.id, patch },
      { onSuccess: () => sheetRef.current?.dismiss() },
    );
  }

  return (
    <BottomSheet ref={sheetRef} snapPoints={["55%", "85%"]}>
      {appointment ? (
        <View style={{ gap: 12 }}>
          <View>
            <Text variant="heading">Visit note</Text>
            <Text variant="muted" style={{ marginTop: 4 }}>
              {child ? `${child.firstName} ${child.lastName}` : "Patient TBC"} · {formatTime(appointment.scheduledAt)}
            </Text>
          </View>
          <View>
            <KeyValueRow label="Status" value={appointment.status} />
            {child ? (
              <KeyValueRow
                label="Date of birth"
                value={new Date(child.dateOfBirth).toLocaleDateString()}
              />
            ) : null}
          </View>
          <Input
            label="Record of visit"
            placeholder="Summarise the visit — findings, actions taken, follow-up."
            value={note}
            onChangeText={setNote}
            multiline
            testID="visit-note-input"
          />
          <Button
            label="Save visit note"
            onPress={save}
            loading={update.isPending}
            testID="visit-note-save"
          />
          <Badge label="Clinician-logged · auto-verified" variant="muted" />
        </View>
      ) : null}
    </BottomSheet>
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
