import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Check, ChevronDown } from "lucide-react-native";
import React, { useRef } from "react";
import {
  Controller,
  FieldPath,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";
import { Pressable, View } from "react-native";
import { useTheme } from "../../theme/useTheme";
import { BottomSheet } from "./BottomSheet";
import { Text } from "./Text";

type Option<V extends string> = { value: V; label: string };

type Props<TFieldValues extends FieldValues, V extends string = string> =
  UseControllerProps<TFieldValues> & {
    label?: string;
    placeholder?: string;
    options: Option<V>[];
  };

export function FormSelect<TFieldValues extends FieldValues, V extends string = string>({
  name,
  control,
  rules,
  defaultValue,
  label,
  placeholder = "Select…",
  options,
}: Props<TFieldValues, V>) {
  const { tokens } = useTheme();
  const sheetRef = useRef<BottomSheetModal>(null);

  return (
    <Controller
      name={name as FieldPath<TFieldValues>}
      control={control}
      rules={rules}
      defaultValue={defaultValue}
      render={({ field, fieldState }) => {
        const selected = options.find((o) => o.value === field.value);
        const errorColor = fieldState.error ? tokens.destructive : tokens.border;
        return (
          <View style={{ gap: 6 }}>
            {label ? (
              <Text variant="label" tone="muted">
                {label}
              </Text>
            ) : null}
            <Pressable
              onPress={() => sheetRef.current?.present()}
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
              <Text
                variant="body"
                style={{ flex: 1, color: selected ? tokens.foreground : tokens.mutedForeground }}
              >
                {selected?.label ?? placeholder}
              </Text>
              <ChevronDown size={18} color={tokens.mutedForeground} />
            </Pressable>
            {fieldState.error?.message ? (
              <Text variant="muted" tone="destructive">
                {fieldState.error.message}
              </Text>
            ) : null}
            <BottomSheet ref={sheetRef} snapPoints={["50%", "90%"]}>
              {label ? (
                <Text variant="subheading" style={{ marginBottom: 12 }}>
                  {label}
                </Text>
              ) : null}
              {options.map((opt) => {
                const active = opt.value === field.value;
                return (
                  <Pressable
                    key={opt.value}
                    onPress={() => {
                      field.onChange(opt.value);
                      sheetRef.current?.dismiss();
                    }}
                    style={({ pressed }) => ({
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 14,
                      borderBottomWidth: 1,
                      borderBottomColor: tokens.border,
                      opacity: pressed ? 0.6 : 1,
                    })}
                  >
                    <Text variant="body" style={{ flex: 1 }}>
                      {opt.label}
                    </Text>
                    {active ? <Check size={18} color={tokens.primary} /> : null}
                  </Pressable>
                );
              })}
            </BottomSheet>
          </View>
        );
      }}
    />
  );
}
