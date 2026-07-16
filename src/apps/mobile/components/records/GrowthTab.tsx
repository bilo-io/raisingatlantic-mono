import type { Child, RecordSource } from "@raising-atlantic/types";
import { Plus } from "lucide-react-native";
import React, { useRef } from "react";
import { ScrollView, View } from "react-native";
import { Button, EmptyState, ListItem, Tabs, Text } from "../ui";
import { useChildRecordsAll } from "../../lib/api/hooks/adapter-hooks";
import { GrowthChart } from "./GrowthChart";
import { GrowthEntrySheet, type GrowthEntrySheetHandle } from "./RecordEntrySheets";

type Props = {
  child: Child;
  source?: RecordSource;
};

export function GrowthTab({ child, source }: Props) {
  const recordsQuery = useChildRecordsAll(child.id);
  const sheetRef = useRef<GrowthEntrySheetHandle>(null);
  const [metric, setMetric] = React.useState<"weight-for-age" | "height-for-age">("weight-for-age");

  const growth = (recordsQuery.data?.growth ?? []).slice().sort((a, b) => b.date.localeCompare(a.date));

  return (
    <View style={{ flex: 1, gap: 12 }}>
      <Tabs<"weight-for-age" | "height-for-age">
        options={[
          { value: "weight-for-age", label: "Weight" },
          { value: "height-for-age", label: "Height" },
        ]}
        value={metric}
        onChange={setMetric}
      />
      <GrowthChart records={growth} dateOfBirth={child.dateOfBirth} sex={child.gender as "male" | "female"} metric={metric} />
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text variant="bodyStrong">Entries</Text>
        <Button label="Log entry" leftIcon={Plus} fullWidth={false} size="sm" onPress={() => sheetRef.current?.open()} />
      </View>
      {growth.length === 0 ? (
        <EmptyState title="No growth entries yet" body="Log a weight or height measurement to start the chart." />
      ) : (
        <ScrollView contentContainerStyle={{ gap: 6 }}>
          {growth.map((item) => (
            <ListItem
              key={item.id}
              title={`${item.weight ? `${item.weight} kg` : ""}${item.weight && item.height ? " · " : ""}${item.height ? `${item.height} cm` : ""}`}
              subtitle={`${new Date(item.date).toLocaleDateString()}${item.status === "Pending Assessment" ? " · Pending review" : ""}`}
              showChevron={false}
            />
          ))}
        </ScrollView>
      )}

      <GrowthEntrySheet ref={sheetRef} childId={child.id} source={source} />
    </View>
  );
}
