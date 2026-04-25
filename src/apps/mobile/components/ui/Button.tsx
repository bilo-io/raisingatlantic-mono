import { LinearGradient } from "expo-linear-gradient";
import { LucideIcon } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  View,
  ViewStyle,
} from "react-native";
import { useTheme } from "../../theme/useTheme";
import { Text } from "./Text";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive";

export type ButtonSize = "sm" | "md" | "lg";

type Props = Omit<PressableProps, "children"> & {
  label: string;
  description?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
};

const SIZE: Record<ButtonSize, { paddingVertical: number; paddingHorizontal: number; fontSize: number; iconSize: number }> = {
  sm: { paddingVertical: 8, paddingHorizontal: 12, fontSize: 13, iconSize: 16 },
  md: { paddingVertical: 12, paddingHorizontal: 16, fontSize: 15, iconSize: 18 },
  lg: { paddingVertical: 16, paddingHorizontal: 20, fontSize: 16, iconSize: 20 },
};

export function Button({
  label,
  description,
  variant = "primary",
  size = "md",
  fullWidth = true,
  loading = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  disabled,
  style,
  ...rest
}: Props) {
  const { tokens } = useTheme();
  const s = SIZE[size];

  const isPrimary = variant === "primary";
  const isDisabled = disabled || loading;

  const containerBase: ViewStyle = {
    borderRadius: 12,
    alignSelf: fullWidth ? "stretch" : "flex-start",
    overflow: "hidden",
    opacity: isDisabled ? 0.6 : 1,
  };

  const innerBase: ViewStyle = {
    paddingVertical: s.paddingVertical,
    paddingHorizontal: s.paddingHorizontal,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  };

  const renderContent = (textColor: string, iconColor: string) => (
    <>
      {loading ? (
        <ActivityIndicator color={iconColor} size="small" />
      ) : LeftIcon ? (
        <LeftIcon size={s.iconSize} color={iconColor} strokeWidth={2} />
      ) : null}
      <View style={{ alignItems: "center" }}>
        <Text
          variant="bodyStrong"
          style={{
            fontSize: s.fontSize,
            color: textColor,
          }}
        >
          {label}
        </Text>
        {description ? (
          <Text
            variant="muted"
            style={{ color: textColor, opacity: 0.85, marginTop: 2 }}
          >
            {description}
          </Text>
        ) : null}
      </View>
      {RightIcon ? (
        <RightIcon size={s.iconSize} color={iconColor} strokeWidth={2} />
      ) : null}
    </>
  );

  if (isPrimary) {
    return (
      <Pressable
        accessibilityRole="button"
        disabled={isDisabled}
        style={({ pressed }) => [
          containerBase,
          { opacity: isDisabled ? 0.6 : pressed ? 0.85 : 1 },
          typeof style === "function" ? undefined : style,
        ]}
        {...rest}
      >
        <LinearGradient
          colors={[tokens.primaryGradientFrom, tokens.primaryGradientTo]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={innerBase}
        >
          {renderContent(tokens.primaryForeground, tokens.primaryForeground)}
        </LinearGradient>
      </Pressable>
    );
  }

  const palette =
    variant === "secondary"
      ? { bg: tokens.secondary, fg: tokens.secondaryForeground, border: "transparent" }
      : variant === "outline"
        ? { bg: tokens.card, fg: tokens.cardForeground, border: tokens.border }
        : variant === "destructive"
          ? { bg: tokens.card, fg: tokens.destructive, border: tokens.border }
          : { bg: "transparent", fg: tokens.foreground, border: "transparent" };

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      style={({ pressed }) => [
        containerBase,
        innerBase,
        {
          backgroundColor: palette.bg,
          borderWidth: variant === "outline" || variant === "destructive" ? 1 : 0,
          borderColor: palette.border,
          opacity: isDisabled ? 0.6 : pressed ? 0.7 : 1,
        },
        typeof style === "function" ? undefined : style,
      ]}
      {...rest}
    >
      {renderContent(palette.fg, palette.fg)}
    </Pressable>
  );
}
