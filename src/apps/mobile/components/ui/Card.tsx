import React from "react";
import { View, ViewProps } from "react-native";
import { useTheme } from "../../theme/useTheme";

type Padding = "none" | "sm" | "md" | "lg";

const PADDING: Record<Padding, number> = {
  none: 0,
  sm: 12,
  md: 18,
  lg: 24,
};

type Props = ViewProps & {
  padding?: Padding;
  bordered?: boolean;
  elevated?: boolean;
};

export function Card({
  padding = "md",
  bordered = true,
  elevated = false,
  style,
  children,
  ...rest
}: Props) {
  const { tokens } = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: tokens.card,
          borderRadius: 16,
          padding: PADDING[padding],
          borderWidth: bordered ? 1 : 0,
          borderColor: tokens.border,
          ...(elevated
            ? {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.18,
                shadowRadius: 24,
                elevation: 12,
              }
            : null),
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
