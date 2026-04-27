import { AlertCircle, RefreshCw } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { useTheme } from "../../theme/useTheme";
import { Button } from "./Button";
import { Text } from "./Text";

type Props = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

export function ErrorState({
  title = "Something went wrong",
  message = "Please check your connection and try again.",
  onRetry,
}: Props) {
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
        <AlertCircle size={32} color={tokens.destructive} strokeWidth={1.75} />
      </View>
      <Text variant="subheading" style={{ textAlign: "center", marginBottom: 6 }}>
        {title}
      </Text>
      <Text variant="body" tone="muted" style={{ textAlign: "center", marginBottom: 20 }}>
        {message}
      </Text>
      {onRetry ? (
        <Button
          label="Retry"
          variant="outline"
          leftIcon={RefreshCw}
          onPress={onRetry}
          fullWidth={false}
        />
      ) : null}
    </View>
  );
}
