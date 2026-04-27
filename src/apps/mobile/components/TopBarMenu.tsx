import { useRouter } from "expo-router";
import {
  CircleHelp,
  HardDrive,
  LogOut,
  LucideIcon,
  Newspaper,
  Settings,
  Shield,
  Sparkles,
  X,
} from "lucide-react-native";
import React, { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../auth/useAuth";
import { Role } from "../auth/types";
import { useTheme } from "../theme/useTheme";
import { Branding } from "./Branding";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { IconButton, Text, toast } from "./ui";

type MenuItem = {
  label: string;
  Icon: LucideIcon;
  onPress: (router: ReturnType<typeof useRouter>) => void;
  destructive?: boolean;
};

const settingsItem: MenuItem = {
  label: "Settings",
  Icon: Settings,
  onPress: () => toast.info("Settings coming soon"),
};
const helpItem: MenuItem = {
  label: "Help & Support",
  Icon: CircleHelp,
  onPress: () => toast.info("Help is on the way"),
};
const whatsNewItem: MenuItem = {
  label: "What's new",
  Icon: Sparkles,
  onPress: () => toast.info("Release notes coming soon"),
};

const ROLE_ITEMS: Record<Role, MenuItem[]> = {
  parent: [whatsNewItem, settingsItem, helpItem],
  clinician: [
    whatsNewItem,
    settingsItem,
    {
      label: "Compliance",
      Icon: Shield,
      onPress: () => toast.info("Compliance area coming soon"),
    },
    helpItem,
  ],
  admin: [
    whatsNewItem,
    settingsItem,
    {
      label: "Blog management",
      Icon: Newspaper,
      onPress: () => toast.info("Blog management coming soon"),
    },
    {
      label: "System logs",
      Icon: HardDrive,
      onPress: () => toast.info("Logs view coming soon"),
    },
    helpItem,
  ],
};

const DRAWER_WIDTH = Math.min(320, Dimensions.get("window").width * 0.85);

type Props = {
  open: boolean;
  onClose: () => void;
  role: Role;
};

export function TopBarMenu({ open, onClose, role }: Props) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { tokens } = useTheme();
  const { user, signOut } = useAuth();

  const items = useMemo(() => ROLE_ITEMS[role] ?? [], [role]);

  const translate = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (open) {
      Animated.parallel([
        Animated.timing(translate, {
          toValue: 0,
          duration: 240,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(fade, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translate, {
          toValue: -DRAWER_WIDTH,
          duration: 200,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(fade, {
          toValue: 0,
          duration: 160,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [open, translate, fade]);

  const handleSignOut = async () => {
    onClose();
    await signOut();
    router.replace("/(auth)/login");
  };

  const handleItemPress = (item: MenuItem) => {
    onClose();
    setTimeout(() => item.onPress(router), 180);
  };

  return (
    <Modal
      visible={open}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: "rgba(0,0,0,0.45)", opacity: fade },
        ]}
      >
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          width: DRAWER_WIDTH,
          backgroundColor: tokens.background,
          borderRightWidth: 1,
          borderRightColor: tokens.border,
          transform: [{ translateX: translate }],
          shadowColor: "#000",
          shadowOffset: { width: 4, height: 0 },
          shadowOpacity: 0.25,
          shadowRadius: 12,
          elevation: 16,
        }}
      >
        <View
          style={{
            paddingTop: insets.top + 12,
            paddingHorizontal: 16,
            paddingBottom: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottomWidth: 1,
            borderBottomColor: tokens.border,
          }}
        >
          <Branding variant="icon" width={36} height={36} />
          <IconButton Icon={X} accessibilityLabel="Close menu" onPress={onClose} />
        </View>

        <ScrollView
          contentContainerStyle={{ paddingVertical: 8 }}
          showsVerticalScrollIndicator={false}
        >
          {user ? (
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 12,
                gap: 2,
              }}
            >
              <Text variant="bodyStrong">{user.name}</Text>
              <Text variant="muted">{user.email}</Text>
            </View>
          ) : null}

          <View style={{ height: 1, backgroundColor: tokens.border, marginVertical: 4 }} />

          {items.map((item) => (
            <MenuRow key={item.label} item={item} onPress={() => handleItemPress(item)} />
          ))}

          <View style={{ height: 1, backgroundColor: tokens.border, marginVertical: 8 }} />

          <View style={{ paddingHorizontal: 16, paddingVertical: 8, gap: 8 }}>
            <Text variant="label">Appearance</Text>
            <ThemeSwitcher />
          </View>

          <View style={{ height: 1, backgroundColor: tokens.border, marginTop: 8, marginBottom: 4 }} />

          <MenuRow
            item={{
              label: "Sign out",
              Icon: LogOut,
              destructive: true,
              onPress: () => {},
            }}
            onPress={handleSignOut}
          />
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

function MenuRow({ item, onPress }: { item: MenuItem; onPress: () => void }) {
  const { tokens } = useTheme();
  const color = item.destructive ? tokens.destructive : tokens.foreground;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={item.label}
      android_ripple={{ color: tokens.muted }}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 14,
      }}
    >
      <View style={{ width: 24, alignItems: "center", marginRight: 14 }}>
        <item.Icon size={20} color={color} strokeWidth={2} />
      </View>
      <Text variant="bodyStrong" style={{ color }}>
        {item.label}
      </Text>
    </Pressable>
  );
}

