import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View } from "react-native";
import { useTheme } from "../../theme/useTheme";

type Props = {
  value: number;
  max?: number;
  height?: number;
  variant?: "primary" | "muted";
};

export function ProgressBar({ value, max = 100, height = 8, variant = "primary" }: Props) {
  const { tokens } = useTheme();
  const pct = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <View
      style={{
        height,
        borderRadius: height / 2,
        backgroundColor: tokens.muted,
        overflow: "hidden",
      }}
    >
      {variant === "primary" ? (
        <LinearGradient
          colors={[tokens.primaryGradientFrom, tokens.primaryGradientTo]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ width: `${pct}%`, height: "100%" }}
        />
      ) : (
        <View
          style={{
            width: `${pct}%`,
            height: "100%",
            backgroundColor: tokens.foreground,
          }}
        />
      )}
    </View>
  );
}
