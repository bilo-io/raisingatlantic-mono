import { Tabs } from "expo-router";
import { Activity, Settings, ShieldCheck, Users } from "lucide-react-native";
import React from "react";
import { CenterLogoTab } from "../../../components/CenterLogoTab";
import { TabBarIcon } from "../../../components/TabBarIcon";
import { useTheme } from "../../../theme/useTheme";

export default function AdminTabsLayout() {
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
        name="users"
        options={{
          title: "Users",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon Icon={Users} color={color} focused={focused} />
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
        name="system"
        options={{
          title: "System",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon Icon={Settings} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: "Activity",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon Icon={Activity} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen name="profile" options={{ href: null }} />
    </Tabs>
  );
}
