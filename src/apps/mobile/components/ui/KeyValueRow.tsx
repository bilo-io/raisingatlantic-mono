import React from "react";
import { View } from "react-native";
import { useTheme } from "../../theme/useTheme";
import { Text } from "./Text";

type Props = {
  label: string;
  value?: string | null;
  fallback?: string;
};

export function KeyValueRow({ label, value, fallback = "—" }: Props) {
  const { tokens } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: tokens.border,
        gap: 12,
      }}
    >
      <Text variant="muted" style={{ flexShrink: 0 }}>
        {label}
      </Text>
      <Text
        variant="body"
        numberOfLines={2}
        style={{ flexShrink: 1, textAlign: "right" }}
      >
        {value || fallback}
      </Text>
    </View>
  );
}
