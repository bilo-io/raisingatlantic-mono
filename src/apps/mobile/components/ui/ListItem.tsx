import { ChevronRight } from "lucide-react-native";
import React from "react";
import { Pressable, View } from "react-native";
import { useTheme } from "../../theme/useTheme";
import { Text } from "./Text";

type Props = {
  title: string;
  subtitle?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  showChevron?: boolean;
};

export function ListItem({
  title,
  subtitle,
  leading,
  trailing,
  onPress,
  disabled,
  showChevron = true,
}: Props) {
  const { tokens } = useTheme();
  const interactive = Boolean(onPress) && !disabled;

  return (
    <Pressable
      onPress={onPress}
      disabled={!interactive}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        backgroundColor: tokens.card,
        borderWidth: 1,
        borderColor: tokens.border,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        opacity: disabled ? 0.5 : pressed ? 0.7 : 1,
      })}
    >
      {leading}
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="bodyStrong" numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="muted" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing}
      {!trailing && interactive && showChevron ? (
        <ChevronRight size={18} color={tokens.mutedForeground} />
      ) : null}
    </Pressable>
  );
}
