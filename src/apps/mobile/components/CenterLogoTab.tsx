import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, View } from "react-native";
import { useTheme } from "../theme/useTheme";
import LogoLight from "../assets/branding/app-icon-light.svg";
import LogoDark from "../assets/branding/app-icon-dark.svg";

type Props = {
  onPress?: ((e: any) => void) | null;
  onLongPress?: ((e: any) => void) | null;
  accessibilityLabel?: string;
  testID?: string;
};

export function CenterLogoTab({ onPress, onLongPress, accessibilityLabel, testID }: Props) {
  const { tokens, resolvedScheme } = useTheme();
  const Logo = resolvedScheme === "dark" ? LogoDark : LogoLight;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityLabel={accessibilityLabel ?? "Dashboard"}
      accessibilityRole="button"
      testID={testID}
      style={{
        top: -22,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: 68,
          height: 68,
          borderRadius: 34,
          padding: 3,
          shadowColor: tokens.primary,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.35,
          shadowRadius: 10,
          elevation: 8,
        }}
      >
        <LinearGradient
          colors={[tokens.primaryGradientFrom, tokens.primaryGradientTo]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            flex: 1,
            borderRadius: 31,
            padding: 3,
          }}
        >
          <View
            style={{
              flex: 1,
              borderRadius: 28,
              backgroundColor: tokens.card,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Logo width={64} height={64} />
          </View>
        </LinearGradient>
      </View>
    </Pressable>
  );
}
