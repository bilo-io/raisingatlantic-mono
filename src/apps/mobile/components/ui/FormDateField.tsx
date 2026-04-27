import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Calendar } from "lucide-react-native";
import React, { useState } from "react";
import {
  Controller,
  FieldPath,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";
import { Platform, Pressable, View } from "react-native";
import { useTheme } from "../../theme/useTheme";
import { Text } from "./Text";

type Props<TFieldValues extends FieldValues> = UseControllerProps<TFieldValues> & {
  label?: string;
  placeholder?: string;
  mode?: "date" | "time" | "datetime";
};

function formatDate(iso?: string) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString();
}

export function FormDateField<TFieldValues extends FieldValues>({
  name,
  control,
  rules,
  defaultValue,
  label,
  placeholder = "Select a date",
  mode = "date",
}: Props<TFieldValues>) {
  const { tokens } = useTheme();
  const [show, setShow] = useState(false);

  return (
    <Controller
      name={name as FieldPath<TFieldValues>}
      control={control}
      rules={rules}
      defaultValue={defaultValue}
      render={({ field, fieldState }) => {
        const errorColor = fieldState.error ? tokens.destructive : tokens.border;
        const formatted = formatDate(field.value);

        const handleChange = (_e: DateTimePickerEvent, date?: Date) => {
          if (Platform.OS === "android") setShow(false);
          if (date) field.onChange(date.toISOString());
        };

        return (
          <View style={{ gap: 6 }}>
            {label ? (
              <Text variant="label" tone="muted">
                {label}
              </Text>
            ) : null}
            <Pressable
              onPress={() => setShow(true)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: errorColor,
                borderRadius: 12,
                backgroundColor: tokens.background,
                paddingHorizontal: 12,
                paddingVertical: 12,
                gap: 8,
              }}
            >
              <Calendar size={18} color={tokens.mutedForeground} />
              <Text
                variant="body"
                style={{ flex: 1, color: formatted ? tokens.foreground : tokens.mutedForeground }}
              >
                {formatted ?? placeholder}
              </Text>
            </Pressable>
            {fieldState.error?.message ? (
              <Text variant="muted" tone="destructive">
                {fieldState.error.message}
              </Text>
            ) : null}
            {show ? (
              <DateTimePicker
                mode={mode}
                value={field.value ? new Date(field.value) : new Date()}
                onChange={handleChange}
                display={Platform.OS === "ios" ? "spinner" : "default"}
              />
            ) : null}
            {Platform.OS === "ios" && show ? (
              <Pressable onPress={() => setShow(false)} hitSlop={6} style={{ alignSelf: "flex-end" }}>
                <Text variant="bodyStrong" tone="primary">
                  Done
                </Text>
              </Pressable>
            ) : null}
          </View>
        );
      }}
    />
  );
}
