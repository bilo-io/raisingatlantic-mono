import { Baby, ClipboardList } from "lucide-react-native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { EmptyState, Screen, Tabs, Text } from "../../../components/ui";
import { GrowthTab } from "../../../components/records/GrowthTab";
import { MilestonesTab } from "../../../components/records/MilestonesTab";
import { VaccinationsTab } from "../../../components/records/VaccinationsTab";
import { useActiveChild } from "../../../lib/active-child";

type TabValue = "growth" | "milestones" | "vaccinations";

export default function ParentRecordsScreen() {
  const { activeChild, isLoading } = useActiveChild();
  const router = useRouter();
  const [tab, setTab] = useState<TabValue>("growth");

  if (!isLoading && !activeChild) {
    return (
      <Screen>
        <EmptyState
          Icon={Baby}
          title="No active child"
          body="Add a child first to log growth, milestones and vaccinations."
          actionLabel="Go to Children"
          onAction={() => router.push("/(app)/(parent)/children")}
        />
      </Screen>
    );
  }

  return (
    <Screen padding={0} edges={["top"]}>
      <View style={{ padding: 20, paddingTop: 8, gap: 8 }}>
        <Text variant="title">Records</Text>
        {activeChild ? (
          <Text variant="muted">
            {activeChild.firstName} {activeChild.lastName} · {new Date(activeChild.dateOfBirth).toLocaleDateString()}
          </Text>
        ) : null}
      </View>
      <View style={{ paddingHorizontal: 20 }}>
        <Tabs<TabValue>
          options={[
            { value: "growth", label: "Growth" },
            { value: "milestones", label: "Milestones" },
            { value: "vaccinations", label: "Vaccinations" },
          ]}
          value={tab}
          onChange={setTab}
        />
      </View>
      <View style={{ flex: 1, padding: 20, paddingTop: 16 }}>
        {activeChild ? (
          tab === "growth" ? (
            <GrowthTab child={activeChild} />
          ) : tab === "milestones" ? (
            <MilestonesTab child={activeChild} />
          ) : (
            <VaccinationsTab child={activeChild} />
          )
        ) : (
          <EmptyState Icon={ClipboardList} title="Loading…" />
        )}
      </View>
    </Screen>
  );
}
