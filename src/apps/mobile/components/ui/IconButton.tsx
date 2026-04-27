import { LucideIcon } from "lucide-react-native";
import React from "react";
import { Pressable, ViewStyle } from "react-native";
import { useTheme } from "../../theme/useTheme";

type Variant = "ghost" | "outline" | "filled";

type Props = {
  Icon: LucideIcon;
  onPress?: () => void;
  size?: number;
  variant?: Variant;
  accessibilityLabel: string;
  disabled?: boolean;
  style?: ViewStyle;
  tone?: "default" | "destructive" | "primary";
};

export function IconButton({
  Icon,
  onPress,
  size = 40,
  variant = "ghost",
  accessibilityLabel,
  disabled,
  style,
  tone = "default",
}: Props) {
  const { tokens } = useTheme();
  const palette =
    tone === "destructive"
      ? tokens.destructive
      : tone === "primary"
        ? tokens.primary
        : tokens.foreground;

  const bg =
    variant === "filled" ? tokens.muted : variant === "outline" ? tokens.card : "transparent";
  const borderWidth = variant === "outline" ? 1 : 0;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={6}
      style={({ pressed }) => [
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: bg,
          borderWidth,
          borderColor: tokens.border,
          opacity: disabled ? 0.5 : pressed ? 0.6 : 1,
        },
        style,
      ]}
    >
      <Icon size={Math.round(size * 0.5)} color={palette} strokeWidth={2} />
    </Pressable>
  );
}
