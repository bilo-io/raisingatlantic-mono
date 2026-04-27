import { Image } from "expo-image";
import React from "react";
import { View, ViewStyle } from "react-native";
import { useTheme } from "../../theme/useTheme";
import { Text } from "./Text";

type Size = "sm" | "md" | "lg" | "xl";

const SIZE: Record<Size, { box: number; font: number }> = {
  sm: { box: 32, font: 12 },
  md: { box: 44, font: 15 },
  lg: { box: 56, font: 18 },
  xl: { box: 80, font: 26 },
};

type Props = {
  name?: string;
  imageUrl?: string;
  size?: Size;
  style?: ViewStyle;
};

function initials(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Avatar({ name, imageUrl, size = "md", style }: Props) {
  const { tokens } = useTheme();
  const s = SIZE[size];
  return (
    <View
      style={[
        {
          width: s.box,
          height: s.box,
          borderRadius: s.box / 2,
          backgroundColor: tokens.primary,
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        },
        style,
      ]}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={{ width: s.box, height: s.box }}
          contentFit="cover"
          transition={150}
        />
      ) : (
        <Text
          variant="bodyStrong"
          style={{ color: tokens.primaryForeground, fontSize: s.font }}
        >
          {initials(name)}
        </Text>
      )}
    </View>
  );
}
