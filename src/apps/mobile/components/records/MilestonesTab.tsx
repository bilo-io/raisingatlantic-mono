import type { Child, RecordSource } from "@raising-atlantic/types";
import { milestonesByAge } from "@raising-atlantic/clinical";
import { Check, Clock } from "lucide-react-native";
import React, { useRef } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Badge, Card, SectionHeader, Text } from "../ui";
import { useChildRecordsAll } from "../../lib/api/hooks/adapter-hooks";
import { useTheme } from "../../theme/useTheme";
import {
  MilestoneEntrySheet,
  type MilestoneEntrySheetHandle,
} from "./RecordEntrySheets";

type Props = {
  child: Child;
  source?: RecordSource;
};

export function MilestonesTab({ child, source }: Props) {
  const recordsQuery = useChildRecordsAll(child.id);
  const { tokens } = useTheme();
  const sheetRef = useRef<MilestoneEntrySheetHandle>(null);

  const completed = recordsQuery.data?.milestones ?? [];
  const completedMap = new Map(completed.map((m) => [m.milestoneId, m]));

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ gap: 16, paddingBottom: 24 }}>
        {milestonesByAge.map((group) => (
          <View key={group.age} style={{ gap: 8 }}>
            <SectionHeader title={group.age} />
            {group.milestones.map((ms: { id: string; category: string; description: string }) => {
              const completedEntry = completedMap.get(ms.id);
              const status: "verified" | "pending" | "open" = completedEntry
                ? completedEntry.status === "Pending Assessment"
                  ? "pending"
                  : "verified"
                : "open";
              return (
                <Card key={ms.id}>
                  <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
                    <View style={{ flex: 1, gap: 4 }}>
                      <Text variant="bodyStrong">{ms.description}</Text>
                      <Text variant="muted">{ms.category}</Text>
                      <View style={{ flexDirection: "row", gap: 8, marginTop: 6 }}>
                        {status === "verified" ? (
                          <Badge label="Verified" variant="primary" />
                        ) : status === "pending" ? (
                          <Badge label="Pending review" variant="muted" />
                        ) : (
                          <Pressable onPress={() => sheetRef.current?.open(ms.id)} hitSlop={6}>
                            <Text variant="bodyStrong" tone="primary">
                              Log this milestone
                            </Text>
                          </Pressable>
                        )}
                      </View>
                    </View>
                    <View>
                      {status === "verified" ? (
                        <Check size={20} color={tokens.primary} />
                      ) : status === "pending" ? (
                        <Clock size={20} color={tokens.mutedForeground} />
                      ) : null}
                    </View>
                  </View>
                </Card>
              );
            })}
          </View>
        ))}
      </ScrollView>

      <MilestoneEntrySheet ref={sheetRef} childId={child.id} source={source} />
    </View>
  );
}
