import React from "react";
import { View } from "react-native";
import { useTheme } from "../theme/useTheme";
import BrandingLight from "../assets/branding/app-branding-light.svg";
import BrandingDark from "../assets/branding/app-branding-dark.svg";

type Props = { width?: number; height?: number };

export function Branding({ width = 220, height = 64 }: Props) {
  const { resolvedScheme } = useTheme();
  const Svg = resolvedScheme === "dark" ? BrandingDark : BrandingLight;
  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height} />
    </View>
  );
}
