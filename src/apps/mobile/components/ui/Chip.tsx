import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useTheme } from "../../theme/useTheme";
import { Text } from "./Text";

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function Chip({ label, selected, onPress }: ChipProps) {
  const { tokens } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: selected ? tokens.primary : tokens.border,
        backgroundColor: selected ? tokens.primary : tokens.card,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Text
        variant="bodyStrong"
        style={{
          fontSize: 13,
          color: selected ? tokens.primaryForeground : tokens.foreground,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

type ChipRowProps<T extends string> = {
  options: { value: T; label: string }[];
  value: T | T[] | null;
  onChange: (value: T) => void;
  scrollable?: boolean;
};

export function ChipRow<T extends string>({
  options,
  value,
  onChange,
  scrollable = true,
}: ChipRowProps<T>) {
  const isSelected = (v: T) => (Array.isArray(value) ? value.includes(v) : value === v);

  const inner = (
    <View style={{ flexDirection: "row", gap: 8 }}>
      {options.map((o) => (
        <Chip
          key={o.value}
          label={o.label}
          selected={isSelected(o.value)}
          onPress={() => onChange(o.value)}
        />
      ))}
    </View>
  );

  if (!scrollable) return inner;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 0 }}
    >
      {inner}
    </ScrollView>
  );
}
