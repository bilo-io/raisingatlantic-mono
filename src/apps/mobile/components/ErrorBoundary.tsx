import { AlertTriangle } from "lucide-react-native";
import React from "react";
import { Pressable, View } from "react-native";
import { captureHandledError } from "../lib/sentry/init";
import { lightTokens } from "../theme/tokens";
import { Text } from "./ui/Text";

type Props = {
  children: React.ReactNode;
  fallbackLabel?: string;
  onReset?: () => void;
};

type State = { error: Error | null };

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    captureHandledError(error, { componentStack: info.componentStack });
  }

  reset = (): void => {
    this.setState({ error: null });
    this.props.onReset?.();
  };

  render(): React.ReactNode {
    if (!this.state.error) return this.props.children;
    const tokens = lightTokens;
    return (
      <View
        accessibilityRole="alert"
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          gap: 12,
          backgroundColor: tokens.background,
        }}
      >
        <AlertTriangle size={36} color={tokens.destructive} />
        <Text variant="title" style={{ textAlign: "center" }}>
          {this.props.fallbackLabel ?? "Something went wrong"}
        </Text>
        <Text
          variant="muted"
          style={{ textAlign: "center", maxWidth: 320 }}
        >
          The screen ran into an unexpected problem. You can try again or use
          another tab.
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Try again"
          onPress={this.reset}
          style={{
            marginTop: 12,
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 12,
            backgroundColor: tokens.primary,
            minHeight: 44,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            variant="bodyStrong"
            style={{ color: tokens.primaryForeground }}
          >
            Try again
          </Text>
        </Pressable>
      </View>
    );
  }
}
