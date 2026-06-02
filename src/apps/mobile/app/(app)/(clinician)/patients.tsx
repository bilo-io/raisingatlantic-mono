import type { Child } from "@raising-atlantic/types";
import { router } from "expo-router";
import { Stethoscope } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { useAuth } from "../../../auth/useAuth";
import { useActivePractice } from "../../../context/ActivePracticeContext";
import { usePatients } from "../../../lib/api/hooks";
import { Badge, ChipRow, EmptyState, ListItem, Screen, SearchBar, Text } from "../../../components/ui";

type Filter = "all" | "pending" | "recent" | "archived";

const FILTER_OPTIONS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Awaiting verification" },
  { value: "recent", label: "Recently seen" },
  { value: "archived", label: "Archived" },
];

export default function PatientsScreen() {
  const { user } = useAuth();
  const { practice, practices, setActivePracticeId, practiceId } = useActivePractice();
  const { data, isLoading } = usePatients(user ? { clinicianId: user.id } : undefined);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const rows = useMemo(() => {
    let list = (data ?? []) as Child[];
    // Defence in depth — never render a patient whose clinicianId doesn't match the current clinician.
    if (user) list = list.filter((c) => c.clinicianId === user.id);
    if (filter === "pending") list = list.filter((c) => c.status === "Pending Assessment");
    if (filter === "archived") list = list.filter((c) => c.status === "Archived");
    if (filter === "recent") {
      list = [...list].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((c) =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(q),
      );
    }
    return list;
  }, [data, user, filter, query]);

  return (
    <Screen scroll>
      <Text variant="heading">Patients</Text>
      {practice ? (
        <Text variant="muted" style={{ marginTop: 4 }}>
          {practice.name} · {practice.city}
        </Text>
      ) : null}

      {practices.length > 1 ? (
        <View style={{ marginTop: 14 }}>
          <ChipRow
            value={practiceId}
            onChange={(id) => setActivePracticeId(id)}
            options={practices.map((p) => ({ value: p.id, label: practiceShortLabel(p.name) }))}
          />
        </View>
      ) : null}

      <View style={{ marginTop: 16, gap: 12 }}>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search by name" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <ChipRow value={filter} onChange={setFilter} options={FILTER_OPTIONS} />
        </ScrollView>
      </View>

      <View style={{ marginTop: 16, gap: 10 }}>
        {isLoading ? (
          <Text variant="muted">Loading patients…</Text>
        ) : rows.length === 0 ? (
          <EmptyState
            Icon={Stethoscope}
            title="No patients to show"
            body={
              filter === "all"
                ? "You're not assigned to any patients yet."
                : "No patients match this filter."
            }
          />
        ) : (
          rows.map((p) => (
            <ListItem
              key={p.id}
              title={`${p.firstName} ${p.lastName}`}
              subtitle={`${formatAge(p.dateOfBirth)} · ${p.status}`}
              trailing={
                p.status === "Pending Assessment" ? (
                  <Badge label="Awaiting" variant="muted" />
                ) : undefined
              }
              onPress={() => router.push(`/(app)/(clinician)/patients/${p.id}`)}
            />
          ))
        )}
      </View>
    </Screen>
  );
}

function practiceShortLabel(name: string) {
  const parts = name.split("—");
  return (parts[1] ?? parts[0] ?? name).trim();
}

function formatAge(dob: string) {
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return "—";
  const now = new Date();
  const months =
    (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  if (months < 24) return `${Math.max(months, 0)} mo`;
  return `${Math.floor(months / 12)} yr`;
}
