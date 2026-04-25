import { Tabs } from "expo-router";
import {
  ClipboardList,
  ShieldCheck,
  Stethoscope,
  UserCircle,
} from "lucide-react-native";
import React from "react";
import { CenterLogoTab } from "../../../components/CenterLogoTab";
import { TabBarIcon } from "../../../components/TabBarIcon";
import { useTheme } from "../../../theme/useTheme";

export default function ClinicianTabsLayout() {
  const { tokens } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: tokens.primary,
        tabBarInactiveTintColor: tokens.mutedForeground,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        tabBarStyle: {
          backgroundColor: tokens.card,
          borderTopColor: tokens.border,
          height: 84,
          paddingTop: 8,
          paddingBottom: 24,
        },
      }}
    >
      <Tabs.Screen
        name="patients"
        options={{
          title: "Patients",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon Icon={Stethoscope} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="verifications"
        options={{
          title: "Verifications",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon Icon={ShieldCheck} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "",
          tabBarButton: (props) => (
            <CenterLogoTab onPress={props.onPress} onLongPress={props.onLongPress} />
          ),
        }}
      />
      <Tabs.Screen
        name="records"
        options={{
          title: "Records",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon Icon={ClipboardList} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon Icon={UserCircle} color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
