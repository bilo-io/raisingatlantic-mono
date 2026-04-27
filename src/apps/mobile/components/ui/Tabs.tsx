import React from "react";
import { Pressable, View } from "react-native";
import { useTheme } from "../../theme/useTheme";
import { Text } from "./Text";

type Props<T extends string> = {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
};

export function Tabs<T extends string>({ options, value, onChange }: Props<T>) {
  const { tokens } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: tokens.muted,
        borderRadius: 12,
        padding: 4,
      }}
    >
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 9,
              backgroundColor: active ? tokens.card : "transparent",
              alignItems: "center",
            }}
          >
            <Text
              variant={active ? "bodyStrong" : "body"}
              tone={active ? "default" : "muted"}
              style={{ fontSize: 14 }}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
