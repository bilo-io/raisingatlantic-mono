import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { useTheme } from "../../theme/useTheme";
import { IconButton } from "./IconButton";
import { Text } from "./Text";

type Props = {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  rightSlot?: React.ReactNode;
  onBack?: () => void;
};

export function Header({ title, subtitle, showBack = true, rightSlot, onBack }: Props) {
  const router = useRouter();
  const { tokens } = useTheme();

  const handleBack = onBack ?? (() => router.back());

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 16,
        paddingTop: 4,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: tokens.border,
        backgroundColor: tokens.background,
      }}
    >
      {showBack ? (
        <IconButton Icon={ChevronLeft} onPress={handleBack} accessibilityLabel="Back" />
      ) : (
        <View style={{ width: 40 }} />
      )}
      <View style={{ flex: 1, alignItems: "center" }}>
        {title ? (
          <Text variant="bodyStrong" numberOfLines={1}>
            {title}
          </Text>
        ) : null}
        {subtitle ? (
          <Text variant="muted" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={{ width: 40, alignItems: "flex-end" }}>{rightSlot}</View>
    </View>
  );
}
