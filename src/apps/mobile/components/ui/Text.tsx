import React from "react";
import { Text as RNText, TextProps as RNTextProps, TextStyle } from "react-native";
import { useTheme } from "../../theme/useTheme";

export type TextVariant =
  | "heading"
  | "subheading"
  | "title"
  | "body"
  | "bodyStrong"
  | "muted"
  | "label"
  | "caption";

export type TextTone = "default" | "muted" | "primary" | "destructive" | "onPrimary";

type Props = RNTextProps & {
  variant?: TextVariant;
  tone?: TextTone;
};

const VARIANT_STYLE: Record<TextVariant, TextStyle> = {
  heading: { fontSize: 28, fontWeight: "700", lineHeight: 34 },
  subheading: { fontSize: 22, fontWeight: "700", lineHeight: 28 },
  title: { fontSize: 17, fontWeight: "600", lineHeight: 22 },
  body: { fontSize: 15, fontWeight: "400", lineHeight: 22 },
  bodyStrong: { fontSize: 15, fontWeight: "600", lineHeight: 22 },
  muted: { fontSize: 13, fontWeight: "400", lineHeight: 18 },
  label: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    lineHeight: 16,
  },
  caption: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
    lineHeight: 14,
  },
};

export function Text({
  variant = "body",
  tone,
  style,
  children,
  ...rest
}: Props) {
  const { tokens } = useTheme();
  const inferredTone: TextTone =
    tone ?? (variant === "muted" || variant === "label" || variant === "caption" ? "muted" : "default");
  const color =
    inferredTone === "muted"
      ? tokens.mutedForeground
      : inferredTone === "primary"
        ? tokens.primary
        : inferredTone === "destructive"
          ? tokens.destructive
          : inferredTone === "onPrimary"
            ? tokens.primaryForeground
            : tokens.foreground;

  return (
    <RNText style={[VARIANT_STYLE[variant], { color }, style]} {...rest}>
      {children}
    </RNText>
  );
}
