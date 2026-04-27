import { LucideIcon } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { useTheme } from "../../theme/useTheme";
import { Button } from "./Button";
import { Text } from "./Text";

type Props = {
  Icon?: LucideIcon;
  title: string;
  body?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ Icon, title, body, actionLabel, onAction }: Props) {
  const { tokens } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 32,
        paddingVertical: 48,
      }}
    >
      {Icon ? (
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: tokens.muted,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <Icon size={32} color={tokens.mutedForeground} strokeWidth={1.75} />
        </View>
      ) : null}
      <Text variant="subheading" style={{ textAlign: "center", marginBottom: 6 }}>
        {title}
      </Text>
      {body ? (
        <Text variant="body" tone="muted" style={{ textAlign: "center", marginBottom: 20 }}>
          {body}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} fullWidth={false} size="md" />
      ) : null}
    </View>
  );
}
