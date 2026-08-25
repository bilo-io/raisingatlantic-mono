import { Tabs } from "expo-router";
import {
  CalendarDays,
  ClipboardList,
  ShieldCheck,
  Stethoscope,
} from "lucide-react-native";
import { CenterLogoTab } from "../../../components/CenterLogoTab";
import { ErrorBoundary } from "../../../components/ErrorBoundary";
import { TabBarIcon } from "../../../components/TabBarIcon";
import { ActivePracticeProvider } from "../../../context/ActivePracticeContext";
import { useTheme } from "../../../theme/useTheme";

export default function ClinicianTabsLayout() {
  const { tokens } = useTheme();
  return (
    <ErrorBoundary fallbackLabel="The clinician area ran into a problem">
      <ActivePracticeProvider>
        <ClinicianTabs tokens={tokens} />
      </ActivePracticeProvider>
    </ErrorBoundary>
  );
}

function ClinicianTabs({ tokens }: { tokens: ReturnType<typeof useTheme>["tokens"] }) {
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
        name="schedule"
        options={{
          title: "Schedule",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon Icon={CalendarDays} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen name="profile" options={{ href: null }} />
      <Tabs.Screen name="patients/[id]" options={{ href: null }} />
    </Tabs>
  );
}
