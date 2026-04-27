import React from "react";
import { View } from "react-native";
import { useTheme } from "../theme/useTheme";
import BrandingLight from "../assets/branding/app-branding-light.svg";
import BrandingDark from "../assets/branding/app-branding-dark.svg";
import IconLight from "../assets/branding/app-icon-light.svg";
import IconDark from "../assets/branding/app-icon-dark.svg";

type Props = {
  width?: number;
  height?: number;
  variant?: "branding" | "icon";
};

export function Branding({ width = 220, height = 64, variant = "branding" }: Props) {
  const { resolvedScheme } = useTheme();
  const isDark = resolvedScheme === "dark";
  const Svg =
    variant === "icon"
      ? isDark
        ? IconDark
        : IconLight
      : isDark
        ? BrandingDark
        : BrandingLight;
  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height} />
    </View>
  );
}
