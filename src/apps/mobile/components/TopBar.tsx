import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Menu } from "lucide-react-native";
import React, { useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../auth/useAuth";
import { Role } from "../auth/types";
import { useTheme } from "../theme/useTheme";
import { Avatar, Badge, IconButton } from "./ui";
import { TopBarMenu } from "./TopBarMenu";

const ROLE_LABEL: Record<Role, string> = {
  parent: "Parent",
  clinician: "Clinician",
  admin: "Admin",
};

const BAR_HEIGHT = 56;
const BAR_HORIZONTAL_MARGIN = 12;
const BAR_TOP_MARGIN = 8;

export const TOP_BAR_TOTAL_HEIGHT = BAR_HEIGHT + BAR_TOP_MARGIN;

export function TopBar() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { tokens, resolvedScheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) return null;

  const handleProfilePress = () => {
    router.push(`/(app)/(${user.role})/profile` as never);
  };

  const blurTint = resolvedScheme === "dark" ? "dark" : "light";
  const supportsBlur = Platform.OS === "ios" || Platform.OS === "android";

  return (
    <>
      <View
        pointerEvents="box-none"
        style={{
          position: "absolute",
          top: insets.top + BAR_TOP_MARGIN,
          left: BAR_HORIZONTAL_MARGIN,
          right: BAR_HORIZONTAL_MARGIN,
          height: BAR_HEIGHT,
          zIndex: 50,
          elevation: 12,
        }}
      >
        <View
          style={{
            flex: 1,
            borderRadius: BAR_HEIGHT / 2,
            overflow: "hidden",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: resolvedScheme === "dark" ? 0.4 : 0.12,
            shadowRadius: 12,
            borderWidth: 1,
            borderColor: tokens.border,
          }}
        >
          {supportsBlur ? (
            <BlurView
              tint={blurTint}
              intensity={Platform.OS === "android" ? 80 : 40}
              style={StyleSheet.absoluteFill}
            />
          ) : null}
          <LinearGradient
            colors={
              resolvedScheme === "dark"
                ? ["rgba(38,36,33,0.65)", "rgba(31,29,27,0.85)"]
                : ["rgba(252,250,246,0.65)", "rgba(243,241,233,0.85)"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 8,
            }}
          >
            <IconButton
              Icon={Menu}
              accessibilityLabel="Open menu"
              onPress={() => setMenuOpen(true)}
              size={40}
            />
            <View style={{ flex: 1 }} />
            <Pressable
              onPress={handleProfilePress}
              accessibilityRole="button"
              accessibilityLabel={`${user.name}, ${ROLE_LABEL[user.role]}. Open profile.`}
              hitSlop={6}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingLeft: 10,
                paddingRight: 4,
                paddingVertical: 4,
                borderRadius: 28,
              }}
            >
              <Badge
                label={ROLE_LABEL[user.role]}
                variant="primary"
                style={{
                  alignSelf: "center",
                  borderRadius: 999,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  marginRight: 8,
                }}
              />
              <Avatar name={user.name} size="sm" />
            </Pressable>
          </View>
        </View>
      </View>
      <TopBarMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        role={user.role}
      />
    </>
  );
}
