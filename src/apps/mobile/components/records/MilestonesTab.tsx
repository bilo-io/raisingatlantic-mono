import { zodResolver } from "@hookform/resolvers/zod";
import type { Child } from "@raising-atlantic/types";
import { milestonesByAge } from "@raising-atlantic/clinical";
import { Check, Clock } from "lucide-react-native";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Pressable, ScrollView, View } from "react-native";
import { z } from "zod";
import {
  Badge,
  BottomSheet,
  BottomSheetRef,
  Button,
  Card,
  FormDateField,
  FormField,
  SectionHeader,
  Text,
  toast,
} from "../ui";
import { useChildRecordsAll, useMilestoneAdd } from "../../lib/api/hooks/adapter-hooks";
import { useTheme } from "../../theme/useTheme";

const schema = z.object({
  dateAchieved: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

type Props = {
  child: Child;
};

export function MilestonesTab({ child }: Props) {
  const recordsQuery = useChildRecordsAll(child.id);
  const addMilestone = useMilestoneAdd(child.id);
  const { tokens } = useTheme();
  const sheetRef = useRef<BottomSheetRef>(null);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);

  const completed = recordsQuery.data?.milestones ?? [];
  const completedMap = new Map(completed.map((m) => [m.milestoneId, m]));

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: { dateAchieved: "", notes: "" },
  });

  function openLog(milestoneId: string) {
    setSelectedMilestoneId(milestoneId);
    form.reset({ dateAchieved: "", notes: "" });
    sheetRef.current?.present();
  }

  async function onSubmit(values: FormValues) {
    if (!selectedMilestoneId) return;
    try {
      await addMilestone.mutateAsync({
        milestoneId: selectedMilestoneId,
        dateAchieved: values.dateAchieved,
        notes: values.notes || undefined,
      });
      toast.success("Milestone logged", { description: "Pending clinician review" });
      sheetRef.current?.dismiss();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    }
  }

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
                          <Pressable onPress={() => openLog(ms.id)} hitSlop={6}>
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

      <BottomSheet ref={sheetRef} snapPoints={["60%", "90%"]}>
        <Text variant="heading" style={{ marginBottom: 12 }}>
          Log milestone
        </Text>
        <View style={{ gap: 12 }}>
          <FormDateField name="dateAchieved" control={form.control} label="Date achieved" />
          <FormField name="notes" control={form.control} label="Notes" multiline />
          <Button label="Save" onPress={form.handleSubmit(onSubmit)} loading={addMilestone.isPending} />
        </View>
      </BottomSheet>
    </View>
  );
}
