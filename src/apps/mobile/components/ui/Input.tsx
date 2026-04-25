import { LucideIcon } from "lucide-react-native";
import React, { forwardRef } from "react";
import { TextInput, TextInputProps, View } from "react-native";
import { useTheme } from "../../theme/useTheme";
import { Text } from "./Text";

type Props = TextInputProps & {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
};

export const Input = forwardRef<TextInput, Props>(function Input(
  { label, hint, error, leftIcon: LeftIcon, rightIcon: RightIcon, style, ...rest },
  ref,
) {
  const { tokens } = useTheme();
  const borderColor = error ? tokens.destructive : tokens.border;

  return (
    <View style={{ gap: 6 }}>
      {label ? (
        <Text variant="label" tone="muted">
          {label}
        </Text>
      ) : null}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor,
          borderRadius: 12,
          backgroundColor: tokens.background,
          paddingHorizontal: 12,
          gap: 8,
        }}
      >
        {LeftIcon ? <LeftIcon size={18} color={tokens.mutedForeground} /> : null}
        <TextInput
          ref={ref}
          placeholderTextColor={tokens.mutedForeground}
          style={[
            {
              flex: 1,
              paddingVertical: 12,
              color: tokens.foreground,
              fontSize: 15,
            },
            style,
          ]}
          {...rest}
        />
        {RightIcon ? <RightIcon size={18} color={tokens.mutedForeground} /> : null}
      </View>
      {error ? (
        <Text variant="muted" tone="destructive">
          {error}
        </Text>
      ) : hint ? (
        <Text variant="muted">{hint}</Text>
      ) : null}
    </View>
  );
});
