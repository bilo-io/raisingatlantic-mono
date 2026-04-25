import { LucideIcon } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { useTheme } from "../theme/useTheme";
import { Screen, Text } from "./ui";

type Props = {
  title: string;
  Icon?: LucideIcon;
  blurb?: string;
};

export function ComingSoon({ title, Icon, blurb = "Coming soon" }: Props) {
  const { tokens } = useTheme();
  return (
    <Screen
      contentStyle={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 32,
      }}
    >
      {Icon ? (
        <View
          style={{
            width: 88,
            height: 88,
            borderRadius: 44,
            backgroundColor: tokens.muted,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <Icon size={40} color={tokens.primary} strokeWidth={1.75} />
        </View>
      ) : null}
      <Text variant="heading" style={{ textAlign: "center", marginBottom: 8 }}>
        {title}
      </Text>
      <Text variant="body" tone="muted" style={{ textAlign: "center" }}>
        {blurb}
      </Text>
    </Screen>
  );
}
