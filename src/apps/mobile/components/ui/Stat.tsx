import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { useTheme } from "../../theme/useTheme";
import { Card } from "./Card";
import { Text } from "./Text";

type Props = {
  label: string;
  value: string | number;
  Icon?: LucideIcon;
  trend?: { direction: "up" | "down"; label: string };
};

export function Stat({ label, value, Icon, trend }: Props) {
  const { tokens } = useTheme();
  return (
    <Card padding="md" style={{ flex: 1 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        {Icon ? <Icon size={16} color={tokens.mutedForeground} strokeWidth={2} /> : null}
        <Text variant="muted" numberOfLines={1}>
          {label}
        </Text>
      </View>
      <Text variant="heading" style={{ marginTop: 6 }}>
        {value}
      </Text>
      {trend ? (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
          {trend.direction === "up" ? (
            <TrendingUp size={14} color={tokens.primary} />
          ) : (
            <TrendingDown size={14} color={tokens.destructive} />
          )}
          <Text
            variant="muted"
            style={{
              color: trend.direction === "up" ? tokens.primary : tokens.destructive,
            }}
          >
            {trend.label}
          </Text>
        </View>
      ) : null}
    </Card>
  );
}
