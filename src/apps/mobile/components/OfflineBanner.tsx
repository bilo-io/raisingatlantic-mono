import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import { WifiOff } from "lucide-react-native";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../theme/useTheme";
import { Text } from "./ui/Text";

function isOffline(state: NetInfoState): boolean {
  if (state.isConnected === false) return true;
  if (state.isInternetReachable === false) return true;
  return false;
}

export function OfflineBanner() {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setOffline(isOffline(state));
    });
    NetInfo.fetch()
      .then((state) => setOffline(isOffline(state)))
      .catch(() => undefined);
    return () => unsubscribe();
  }, []);

  if (!offline) return null;

  return (
    <View
      accessibilityRole="alert"
      accessibilityLabel="You are offline. Some actions may not work until you reconnect."
      style={{
        position: "absolute",
        top: insets.top,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: tokens.destructive,
        paddingVertical: 8,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
    >
      <WifiOff size={14} color={tokens.destructiveForeground} />
      <Text
        variant="bodyStrong"
        style={{
          color: tokens.destructiveForeground,
          fontSize: 13,
        }}
      >
        You're offline
      </Text>
    </View>
  );
}
