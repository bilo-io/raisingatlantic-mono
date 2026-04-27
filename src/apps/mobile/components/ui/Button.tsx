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

const SIZE: Record<
  ButtonSize,
  { paddingVertical: number; paddingHorizontal: number; fontSize: number; iconSize: number }
> = {
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

  const palette =
    variant === "primary"
      ? { bg: "transparent", fg: tokens.primaryForeground, border: "transparent" }
      : variant === "secondary"
        ? { bg: tokens.secondary, fg: tokens.secondaryForeground, border: "transparent" }
        : variant === "outline"
          ? { bg: tokens.card, fg: tokens.cardForeground, border: tokens.border }
          : variant === "destructive"
            ? { bg: tokens.card, fg: tokens.destructive, border: tokens.destructive }
            : { bg: "transparent", fg: tokens.foreground, border: "transparent" };

  const hasBorder = variant === "outline" || variant === "destructive";

  const buttonStyle: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: fullWidth ? "stretch" : "flex-start",
    paddingVertical: s.paddingVertical,
    paddingHorizontal: s.paddingHorizontal,
    borderRadius: 12,
    backgroundColor: palette.bg,
    borderWidth: hasBorder ? 1 : 0,
    borderColor: palette.border,
    opacity: isDisabled ? 0.6 : 1,
    overflow: "hidden",
  };

  const Content = (
    <>
      <View
        style={{
          width: s.iconSize,
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        {loading ? (
          <ActivityIndicator color={palette.fg} size="small" />
        ) : LeftIcon ? (
          <LeftIcon size={s.iconSize} color={palette.fg} strokeWidth={2} />
        ) : null}
      </View>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 8,
        }}
      >
        <Text
          variant="bodyStrong"
          style={{ fontSize: s.fontSize, color: palette.fg, textAlign: "center" }}
        >
          {label}
        </Text>
        {description ? (
          <Text
            variant="muted"
            style={{
              color: palette.fg,
              opacity: 0.85,
              marginTop: 2,
              textAlign: "center",
            }}
          >
            {description}
          </Text>
        ) : null}
      </View>
      <View
        style={{
          width: s.iconSize,
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        {RightIcon ? (
          <RightIcon size={s.iconSize} color={palette.fg} strokeWidth={2} />
        ) : null}
      </View>
    </>
  );

  if (isPrimary) {
    return (
      <Pressable
        accessibilityRole="button"
        disabled={isDisabled}
        style={[
          {
            alignSelf: fullWidth ? "stretch" : "flex-start",
            borderRadius: 12,
            overflow: "hidden",
            opacity: isDisabled ? 0.6 : 1,
          },
          typeof style === "function" ? undefined : style,
        ]}
        {...rest}
      >
        <LinearGradient
          colors={[tokens.primaryGradientFrom, tokens.primaryGradientTo]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: s.paddingVertical,
            paddingHorizontal: s.paddingHorizontal,
            borderRadius: 12,
          }}
        >
          {Content}
        </LinearGradient>
      </Pressable>
    );
  }

  const externalStyle = typeof style === "function" ? undefined : style;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      style={externalStyle ? [buttonStyle, externalStyle] : buttonStyle}
      {...rest}
    >
      {Content}
    </Pressable>
  );
}
