import React from "react";
import { View } from "react-native";
import { useTheme } from "../../theme/useTheme";
import { Text } from "./Text";

type Props = {
  label?: string;
  orientation?: "horizontal" | "vertical";
};

export function Separator({ label, orientation = "horizontal" }: Props) {
  const { tokens } = useTheme();

  if (orientation === "vertical") {
    return <View style={{ width: 1, alignSelf: "stretch", backgroundColor: tokens.border }} />;
  }

  if (!label) {
    return <View style={{ height: 1, backgroundColor: tokens.border }} />;
  }

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
      }}
    >
      <View style={{ flex: 1, height: 1, backgroundColor: tokens.border }} />
      <Text variant="label" tone="muted">
        {label}
      </Text>
      <View style={{ flex: 1, height: 1, backgroundColor: tokens.border }} />
    </View>
  );
}
