import { LinearGradient } from "expo-linear-gradient";
import { LucideIcon, Plus } from "lucide-react-native";
import React from "react";
import { Pressable, ViewStyle } from "react-native";
import { useTheme } from "../../theme/useTheme";

type Props = {
  Icon?: LucideIcon;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: ViewStyle;
  size?: number;
};

export function FAB({
  Icon = Plus,
  onPress,
  accessibilityLabel = "Add",
  style,
  size = 56,
}: Props) {
  const { tokens } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        {
          position: "absolute",
          bottom: 24,
          right: 24,
          width: size,
          height: size,
          borderRadius: size / 2,
          overflow: "hidden",
          shadowColor: tokens.primary,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.4,
          shadowRadius: 12,
          elevation: 10,
          opacity: pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={[tokens.primaryGradientFrom, tokens.primaryGradientTo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <Icon size={Math.round(size * 0.45)} color={tokens.primaryForeground} strokeWidth={2.25} />
      </LinearGradient>
    </Pressable>
  );
}
