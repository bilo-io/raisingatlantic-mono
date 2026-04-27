import React from "react";
import { Pressable, View } from "react-native";
import { Text } from "./Text";

type Props = {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function SectionHeader({ title, actionLabel, onAction }: Props) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
      }}
    >
      <Text variant="label">{title}</Text>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} hitSlop={6}>
          <Text variant="bodyStrong" tone="primary" style={{ fontSize: 13 }}>
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
