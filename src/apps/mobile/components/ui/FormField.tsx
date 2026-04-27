import { LucideIcon } from "lucide-react-native";
import React from "react";
import {
  Controller,
  FieldPath,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";
import { TextInputProps } from "react-native";
import { Input } from "./Input";

type Props<TFieldValues extends FieldValues> = UseControllerProps<TFieldValues> &
  Omit<TextInputProps, "value" | "onChangeText" | "onBlur"> & {
    label?: string;
    hint?: string;
    leftIcon?: LucideIcon;
    rightIcon?: LucideIcon;
  };

export function FormField<TFieldValues extends FieldValues>({
  name,
  control,
  rules,
  defaultValue,
  label,
  hint,
  leftIcon,
  rightIcon,
  ...inputProps
}: Props<TFieldValues>) {
  return (
    <Controller
      name={name as FieldPath<TFieldValues>}
      control={control}
      rules={rules}
      defaultValue={defaultValue}
      render={({ field, fieldState }) => (
        <Input
          {...inputProps}
          value={field.value ?? ""}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          label={label}
          hint={hint}
          error={fieldState.error?.message}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
        />
      )}
    />
  );
}
