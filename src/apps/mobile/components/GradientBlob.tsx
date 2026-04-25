import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View } from "react-native";
import { useTheme } from "../theme/useTheme";

export function GradientBlob() {
  const { tokens } = useTheme();
  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: -120,
        right: -120,
        width: 420,
        height: 420,
        borderRadius: 210,
        opacity: 0.35,
        overflow: "hidden",
      }}
    >
      <LinearGradient
        colors={[tokens.primaryGradientFrom, tokens.primaryGradientTo, "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      />
    </View>
  );
}

export function GradientBlobBottom() {
  const { tokens } = useTheme();
  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        bottom: -160,
        left: -120,
        width: 380,
        height: 380,
        borderRadius: 190,
        opacity: 0.25,
        overflow: "hidden",
      }}
    >
      <LinearGradient
        colors={[tokens.primaryGradientTo, tokens.primaryGradientFrom, "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      />
    </View>
  );
}
