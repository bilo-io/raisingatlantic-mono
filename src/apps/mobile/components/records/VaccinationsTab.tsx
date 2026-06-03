import { zodResolver } from "@hookform/resolvers/zod";
import type { Child } from "@raising-atlantic/types";
import { bucketVaccine, epiSchedule, type EpiVaccine } from "@raising-atlantic/clinical";
import { Check, Clock, AlertTriangle } from "lucide-react-native";
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
import { useChildRecordsAll, useCompletedVaccinationAdd } from "../../lib/api/hooks/adapter-hooks";
import { useTheme } from "../../theme/useTheme";

const schema = z.object({
  dateAdministered: z.string().min(1, "Date is required"),
  batchNumber: z.string().optional(),
  manufacturer: z.string().optional(),
  clinicName: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

type Props = {
  child: Child;
};

export function VaccinationsTab({ child }: Props) {
  const recordsQuery = useChildRecordsAll(child.id);
  const add = useCompletedVaccinationAdd(child.id);
  const { tokens } = useTheme();
  const sheetRef = useRef<BottomSheetRef>(null);
  const [selected, setSelected] = useState<EpiVaccine | null>(null);

  const completedIds = new Set((recordsQuery.data?.vaccinations ?? []).map((v) => v.vaccineId));
  const completed = recordsQuery.data?.vaccinations ?? [];

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: { dateAdministered: "", batchNumber: "", manufacturer: "", clinicName: "" },
  });

  function openLog(vaccine: EpiVaccine) {
    setSelected(vaccine);
    form.reset({ dateAdministered: "", batchNumber: "", manufacturer: "", clinicName: "" });
    sheetRef.current?.present();
  }

  async function onSubmit(values: FormValues) {
    if (!selected) return;
    try {
      await add.mutateAsync({
        vaccineId: selected.id,
        dateAdministered: values.dateAdministered,
        batchNumber: values.batchNumber || undefined,
        manufacturer: values.manufacturer || undefined,
        clinicName: values.clinicName || undefined,
        source: "PARENT",
      });
      toast.success("Vaccination logged", { description: "Pending clinician review" });
      sheetRef.current?.dismiss();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    }
  }

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
                    <Pressable onPress={() => openLog(v)} hitSlop={6}>
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

      <BottomSheet ref={sheetRef} snapPoints={["75%", "95%"]}>
        <Text variant="heading" style={{ marginBottom: 4 }}>
          Log vaccination
        </Text>
        {selected ? (
          <Text variant="muted" style={{ marginBottom: 12 }}>
            {selected.name} · {selected.doseInfo}
          </Text>
        ) : null}
        <View style={{ gap: 12 }}>
          <FormDateField name="dateAdministered" control={form.control} label="Date administered" />
          <FormField name="batchNumber" control={form.control} label="Batch number (optional)" />
          <FormField name="manufacturer" control={form.control} label="Manufacturer (optional)" />
          <FormField name="clinicName" control={form.control} label="Clinic (optional)" />
          <Button label="Save" onPress={form.handleSubmit(onSubmit)} loading={add.isPending} />
        </View>
      </BottomSheet>
    </View>
  );
}
