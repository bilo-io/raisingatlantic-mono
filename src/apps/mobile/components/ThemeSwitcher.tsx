import React from "react";
import { Pressable, View } from "react-native";
import { SchemePreference } from "../theme/ThemeProvider";
import { useTheme } from "../theme/useTheme";
import { Text } from "./ui";

const OPTIONS: { value: SchemePreference; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

export function ThemeSwitcher() {
  const { scheme, setScheme, tokens } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: tokens.muted,
        borderRadius: 12,
        padding: 4,
      }}
    >
      {OPTIONS.map((opt) => {
        const active = scheme === opt.value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => setScheme(opt.value)}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 9,
              backgroundColor: active ? tokens.card : "transparent",
              alignItems: "center",
            }}
          >
            <Text
              variant={active ? "bodyStrong" : "body"}
              tone={active ? "default" : "muted"}
              style={{ fontSize: 14 }}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
