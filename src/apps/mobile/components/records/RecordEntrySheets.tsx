import { zodResolver } from "@hookform/resolvers/zod";
import type { RecordSource } from "@raising-atlantic/types";
import type { EpiVaccine } from "@raising-atlantic/clinical";
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { z } from "zod";
import {
  BottomSheet,
  BottomSheetRef,
  Button,
  FormDateField,
  FormField,
  Text,
  toast,
} from "../ui";
import {
  useCompletedVaccinationAdd,
  useGrowthRecordAdd,
  useMilestoneAdd,
} from "../../lib/api/hooks/adapter-hooks";

// Shared record-entry sheets used by both the parent records tabs (source
// "PARENT" → Pending Assessment) and the clinician records screen (source
// "CLINICIAN" → auto-verified). Keeping the forms here means the two surfaces
// never drift. Server-side status is authoritative (children.service.ts); the
// source is provenance the API honours for the mock/real toggle.

function savedCopy(source: RecordSource | undefined, noun: string) {
  return source === "CLINICIAN"
    ? { title: `${noun} recorded`, description: "Verified" }
    : { title: `${noun} logged`, description: "Pending clinician review" };
}

export type GrowthEntrySheetHandle = { open: () => void };

const growthSchema = z.object({
  date: z.string().min(1, "Date is required"),
  weight: z.string().optional(),
  height: z.string().optional(),
  headCircumference: z.string().optional(),
  notes: z.string().optional(),
});
type GrowthValues = z.infer<typeof growthSchema>;

export const GrowthEntrySheet = forwardRef<
  GrowthEntrySheetHandle,
  { childId: string; source?: RecordSource }
>(function GrowthEntrySheet({ childId, source }, ref) {
  const add = useGrowthRecordAdd(childId);
  const sheetRef = useRef<BottomSheetRef>(null);
  const form = useForm<GrowthValues>({
    resolver: zodResolver(growthSchema),
    mode: "onBlur",
    defaultValues: { date: "", weight: "", height: "", headCircumference: "", notes: "" },
  });

  useImperativeHandle(ref, () => ({
    open() {
      form.reset({ date: "", weight: "", height: "", headCircumference: "", notes: "" });
      sheetRef.current?.present();
    },
  }));

  async function onSubmit(values: GrowthValues) {
    try {
      await add.mutateAsync({
        date: values.date,
        weight: values.weight || undefined,
        height: values.height || undefined,
        headCircumference: values.headCircumference || undefined,
        notes: values.notes || undefined,
        source,
      });
      const copy = savedCopy(source, "Growth entry");
      toast.success(copy.title, { description: copy.description });
      sheetRef.current?.dismiss();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    }
  }

  return (
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
        <Button label="Save" onPress={form.handleSubmit(onSubmit)} loading={add.isPending} />
      </View>
    </BottomSheet>
  );
});

export type MilestoneEntrySheetHandle = { open: (milestoneId: string) => void };

const milestoneSchema = z.object({
  dateAchieved: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
});
type MilestoneValues = z.infer<typeof milestoneSchema>;

export const MilestoneEntrySheet = forwardRef<
  MilestoneEntrySheetHandle,
  { childId: string; source?: RecordSource }
>(function MilestoneEntrySheet({ childId, source }, ref) {
  const add = useMilestoneAdd(childId);
  const sheetRef = useRef<BottomSheetRef>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const form = useForm<MilestoneValues>({
    resolver: zodResolver(milestoneSchema),
    mode: "onBlur",
    defaultValues: { dateAchieved: "", notes: "" },
  });

  useImperativeHandle(ref, () => ({
    open(milestoneId: string) {
      setSelectedId(milestoneId);
      form.reset({ dateAchieved: "", notes: "" });
      sheetRef.current?.present();
    },
  }));

  async function onSubmit(values: MilestoneValues) {
    if (!selectedId) return;
    try {
      await add.mutateAsync({
        milestoneId: selectedId,
        dateAchieved: values.dateAchieved,
        notes: values.notes || undefined,
        source,
      });
      const copy = savedCopy(source, "Milestone");
      toast.success(copy.title, { description: copy.description });
      sheetRef.current?.dismiss();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    }
  }

  return (
    <BottomSheet ref={sheetRef} snapPoints={["60%", "90%"]}>
      <Text variant="heading" style={{ marginBottom: 12 }}>
        Log milestone
      </Text>
      <View style={{ gap: 12 }}>
        <FormDateField name="dateAchieved" control={form.control} label="Date achieved" />
        <FormField name="notes" control={form.control} label="Notes" multiline />
        <Button label="Save" onPress={form.handleSubmit(onSubmit)} loading={add.isPending} />
      </View>
    </BottomSheet>
  );
});

export type VaccinationEntrySheetHandle = { open: (vaccine: EpiVaccine) => void };

const vaccinationSchema = z.object({
  dateAdministered: z.string().min(1, "Date is required"),
  batchNumber: z.string().optional(),
  manufacturer: z.string().optional(),
  clinicName: z.string().optional(),
});
type VaccinationValues = z.infer<typeof vaccinationSchema>;

export const VaccinationEntrySheet = forwardRef<
  VaccinationEntrySheetHandle,
  { childId: string; source?: RecordSource }
>(function VaccinationEntrySheet({ childId, source }, ref) {
  const add = useCompletedVaccinationAdd(childId);
  const sheetRef = useRef<BottomSheetRef>(null);
  const [selected, setSelected] = useState<EpiVaccine | null>(null);
  const form = useForm<VaccinationValues>({
    resolver: zodResolver(vaccinationSchema),
    mode: "onBlur",
    defaultValues: { dateAdministered: "", batchNumber: "", manufacturer: "", clinicName: "" },
  });

  useImperativeHandle(ref, () => ({
    open(vaccine: EpiVaccine) {
      setSelected(vaccine);
      form.reset({ dateAdministered: "", batchNumber: "", manufacturer: "", clinicName: "" });
      sheetRef.current?.present();
    },
  }));

  async function onSubmit(values: VaccinationValues) {
    if (!selected) return;
    try {
      await add.mutateAsync({
        vaccineId: selected.id,
        dateAdministered: values.dateAdministered,
        batchNumber: values.batchNumber || undefined,
        manufacturer: values.manufacturer || undefined,
        clinicName: values.clinicName || undefined,
        source: source ?? "PARENT",
      });
      const copy = savedCopy(source, "Vaccination");
      toast.success(copy.title, { description: copy.description });
      sheetRef.current?.dismiss();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    }
  }

  return (
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
  );
});
