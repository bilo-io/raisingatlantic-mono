import React from "react";
import { ScrollView, View, ViewStyle } from "react-native";
import { Edge, SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../auth/useAuth";
import { useTheme } from "../../theme/useTheme";
import { TOP_BAR_TOTAL_HEIGHT } from "../TopBar";

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  padding?: number;
  edges?: Edge[];
  contentStyle?: ViewStyle;
};

export function Screen({
  children,
  scroll = false,
  padding = 20,
  edges = ["top"],
  contentStyle,
}: Props) {
  const { tokens } = useTheme();
  const { user } = useAuth();
  const topBarOffset = user ? TOP_BAR_TOTAL_HEIGHT + 12 : 0;

  const inner = (
    <View
      style={[
        { flex: scroll ? undefined : 1, padding, paddingTop: padding + topBarOffset },
        contentStyle,
      ]}
    >
      {children}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: tokens.background }}>
      <SafeAreaView style={{ flex: 1 }} edges={edges}>
        {scroll ? (
          <ScrollView
            contentContainerStyle={{
              padding,
              paddingTop: padding + topBarOffset,
              paddingBottom: 40,
              ...contentStyle,
            }}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          inner
        )}
      </SafeAreaView>
    </View>
  );
}
