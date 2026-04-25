import { LucideIcon } from "lucide-react-native";
import React from "react";
import { View } from "react-native";

type Props = {
  Icon: LucideIcon;
  color: string;
  focused: boolean;
};

export function TabBarIcon({ Icon, color, focused }: Props) {
  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Icon size={24} color={color} strokeWidth={focused ? 2.25 : 1.75} />
    </View>
  );
}
