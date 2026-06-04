import type { Child, CreateChildInput } from "@raising-atlantic/types";
import React from "react";
import { View } from "react-native";
import { useAuth } from "../../auth/useAuth";
import { useChildCreate, useChildUpdate } from "../../lib/api/hooks/adapter-hooks";
import { childFormSchema, ChildFormValues } from "../../lib/forms/schemas/child";
import { useZodForm } from "../../lib/forms";
import { Button, FormDateField, FormField, FormSelect, Text, toast } from "../ui";

type Props = {
  existing?: Child;
  onSaved: (child: Child) => void;
  onCancel?: () => void;
};

export function ChildForm({ existing, onSaved, onCancel }: Props) {
  const { user } = useAuth();
  const create = useChildCreate();
  const update = useChildUpdate();

  const form = useZodForm<ChildFormValues>(childFormSchema, {
    defaultValues: existing
      ? {
          firstName: existing.firstName,
          lastName: existing.lastName,
          gender: existing.gender,
          dateOfBirth: existing.dateOfBirth,
          notes: existing.notes ?? "",
        }
      : { firstName: "", lastName: "", gender: "female", dateOfBirth: "", notes: "" },
  });

  async function onSubmit(values: ChildFormValues) {
    if (!user) {
      toast.error("Sign in first");
      return;
    }
    try {
      if (existing) {
        const updated = await update.mutateAsync({
          id: existing.id,
          patch: {
            name: `${values.firstName} ${values.lastName}`,
            firstName: values.firstName,
            lastName: values.lastName,
            gender: values.gender,
            dateOfBirth: values.dateOfBirth,
            notes: values.notes,
          },
        });
        onSaved(updated);
      } else {
        const dto: CreateChildInput = {
          parentId: user.id,
          name: `${values.firstName} ${values.lastName}`,
          firstName: values.firstName,
          lastName: values.lastName,
          gender: values.gender,
          dateOfBirth: values.dateOfBirth,
          notes: values.notes,
        };
        const created = await create.mutateAsync(dto);
        onSaved(created);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not save";
      toast.error(message);
    }
  }

  const submitting = create.isPending || update.isPending;

  return (
    <View style={{ gap: 14 }}>
      <Text variant="heading">{existing ? "Edit child" : "Add a child"}</Text>
      <FormField name="firstName" control={form.control} label="First name" autoCapitalize="words" />
      <FormField name="lastName" control={form.control} label="Last name" autoCapitalize="words" />
      <FormSelect
        name="gender"
        control={form.control}
        label="Sex assigned at birth"
        options={[
          { value: "female", label: "Female" },
          { value: "male", label: "Male" },
        ]}
      />
      <FormDateField name="dateOfBirth" control={form.control} label="Date of birth" />
      <FormField
        name="notes"
        control={form.control}
        label="Notes (optional)"
        multiline
      />
      <View style={{ flexDirection: "row", gap: 12, marginTop: 4 }}>
        {onCancel ? (
          <View style={{ flex: 1 }}>
            <Button label="Cancel" variant="outline" onPress={onCancel} />
          </View>
        ) : null}
        <View style={{ flex: 1 }}>
          <Button
            label={existing ? "Save changes" : "Add child"}
            onPress={form.handleSubmit(onSubmit)}
            loading={submitting}
          />
        </View>
      </View>
    </View>
  );
}
