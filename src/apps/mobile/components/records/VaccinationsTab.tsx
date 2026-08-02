import type { Child, RecordSource } from "@raising-atlantic/types";
import { bucketVaccine, epiSchedule, type EpiVaccine } from "@raising-atlantic/clinical";
import { Check, Clock, AlertTriangle } from "lucide-react-native";
import React, { useRef } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Badge, Card, SectionHeader, Text } from "../ui";
import { useChildRecordsAll } from "../../lib/api/hooks/adapter-hooks";
import { useTheme } from "../../theme/useTheme";
import {
  VaccinationEntrySheet,
  type VaccinationEntrySheetHandle,
} from "./RecordEntrySheets";

type Props = {
  child: Child;
  source?: RecordSource;
};

export function VaccinationsTab({ child, source }: Props) {
  const recordsQuery = useChildRecordsAll(child.id);
  const { tokens } = useTheme();
  const sheetRef = useRef<VaccinationEntrySheetHandle>(null);

  const completedIds = new Set((recordsQuery.data?.vaccinations ?? []).map((v) => v.vaccineId));
  const completed = recordsQuery.data?.vaccinations ?? [];

  const buckets = {
    overdue: [] as EpiVaccine[],
    due: [] as EpiVaccine[],
    upcoming: [] as EpiVaccine[],
    complete: [] as EpiVaccine[],
  };
  for (const v of epiSchedule) {
    const b = bucketVaccine(v, child.dateOfBirth, completedIds);
    buckets[b].push(v);
  }

  const completedById = new Map(completed.map((c) => [c.vaccineId, c]));

  function Section({ title, list, icon }: { title: string; list: EpiVaccine[]; icon: React.ReactNode }) {
    if (list.length === 0) return null;
    return (
      <View style={{ gap: 8 }}>
        <SectionHeader title={`${title} (${list.length})`} />
        {list.map((v) => {
          const c = completedById.get(v.id);
          const pendingReview = c?.status === "Pending Assessment";
          return (
            <Card key={v.id}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text variant="bodyStrong">{v.name}</Text>
                  <Text variant="muted">
                    {v.recommendedAge} · {v.doseInfo}
                  </Text>
                  {pendingReview ? (
                    <View style={{ marginTop: 4 }}>
                      <Badge label="Pending review" variant="muted" />
                    </View>
                  ) : null}
                </View>
                <View style={{ alignItems: "flex-end", gap: 6 }}>
                  {icon}
                  {!c ? (
                    <Pressable onPress={() => sheetRef.current?.open(v)} hitSlop={6}>
                      <Text variant="bodyStrong" tone="primary">
                        Log
                      </Text>
                    </Pressable>
                  ) : null}
                </View>
              </View>
            </Card>
          );
        })}
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ gap: 18, paddingBottom: 24 }}>
        <Section
          title="Overdue"
          list={buckets.overdue}
          icon={<AlertTriangle size={20} color={tokens.destructive} />}
        />
        <Section
          title="Due now"
          list={buckets.due}
          icon={<Clock size={20} color={tokens.primary} />}
        />
        <Section
          title="Complete"
          list={buckets.complete}
          icon={<Check size={20} color={tokens.primary} />}
        />
        <Section
          title="Upcoming"
          list={buckets.upcoming}
          icon={<Clock size={20} color={tokens.mutedForeground} />}
        />
      </ScrollView>

      <VaccinationEntrySheet ref={sheetRef} childId={child.id} source={source} />
    </View>
  );
}
