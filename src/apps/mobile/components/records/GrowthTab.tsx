import { zodResolver } from "@hookform/resolvers/zod";
import type { Child } from "@raising-atlantic/types";
import { Plus } from "lucide-react-native";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, View } from "react-native";
import { z } from "zod";
import { BottomSheet, BottomSheetRef, Button, EmptyState, FormDateField, FormField, ListItem, Tabs, Text, toast } from "../ui";
import { useGrowthRecordAdd, useChildRecordsAll } from "../../lib/api/hooks/adapter-hooks";
import { GrowthChart } from "./GrowthChart";

const schema = z.object({
  date: z.string().min(1, "Date is required"),
  weight: z.string().optional(),
  height: z.string().optional(),
  headCircumference: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  child: Child;
};

export function GrowthTab({ child }: Props) {
  const recordsQuery = useChildRecordsAll(child.id);
  const addGrowth = useGrowthRecordAdd(child.id);
  const sheetRef = useRef<BottomSheetRef>(null);
  const [metric, setMetric] = React.useState<"weight-for-age" | "height-for-age">("weight-for-age");

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: { date: "", weight: "", height: "", headCircumference: "", notes: "" },
  });

  async function onSubmit(values: FormValues) {
    try {
      await addGrowth.mutateAsync({
        date: values.date,
        weight: values.weight || undefined,
        height: values.height || undefined,
        headCircumference: values.headCircumference || undefined,
        notes: values.notes || undefined,
      });
      toast.success("Growth entry logged", { description: "Pending clinician review" });
      form.reset({ date: "", weight: "", height: "", headCircumference: "", notes: "" });
      sheetRef.current?.dismiss();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    }
  }

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
        <Button label="Log entry" leftIcon={Plus} fullWidth={false} size="sm" onPress={() => sheetRef.current?.present()} />
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

      <BottomSheet ref={sheetRef} snapPoints={["75%", "95%"]}>
        <Text variant="heading" style={{ marginBottom: 12 }}>
          Log growth entry
        </Text>
        <View style={{ gap: 12 }}>
          <FormDateField name="date" control={form.control} label="Date" />
          <FormField name="weight" control={form.control} label="Weight (kg)" keyboardType="decimal-pad" testID="growth-weight" />
          <FormField name="height" control={form.control} label="Height (cm)" keyboardType="decimal-pad" />
          <FormField name="headCircumference" control={form.control} label="Head circumference (cm)" keyboardType="decimal-pad" />
          <FormField name="notes" control={form.control} label="Notes" multiline />
          <Button label="Save" onPress={form.handleSubmit(onSubmit)} loading={addGrowth.isPending} />
        </View>
      </BottomSheet>
    </View>
  );
}
