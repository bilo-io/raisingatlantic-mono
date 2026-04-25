import React from "react";
import { View, ViewStyle } from "react-native";
import { useTheme } from "../../theme/useTheme";
import { Text } from "./Text";

export type BadgeVariant = "default" | "primary" | "muted" | "destructive";

type Props = {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
};

export function Badge({ label, variant = "muted", style }: Props) {
  const { tokens } = useTheme();
  const palette =
    variant === "primary"
      ? { bg: tokens.primary, fg: tokens.primaryForeground }
      : variant === "destructive"
        ? { bg: tokens.destructive, fg: tokens.destructiveForeground }
        : variant === "muted"
          ? { bg: tokens.muted, fg: tokens.mutedForeground }
          : { bg: tokens.secondary, fg: tokens.secondaryForeground };

  return (
    <View
      style={[
        {
          alignSelf: "flex-start",
          paddingHorizontal: 8,
          paddingVertical: 2,
          borderRadius: 6,
          backgroundColor: palette.bg,
        },
        style,
      ]}
    >
      <Text variant="caption" style={{ color: palette.fg }}>
        {label}
      </Text>
    </View>
  );
}
