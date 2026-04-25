import React from "react";
import { ScrollView, View, ViewStyle } from "react-native";
import { Edge, SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../theme/useTheme";

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

  const inner = (
    <View style={[{ flex: scroll ? undefined : 1, padding }, contentStyle]}>
      {children}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: tokens.background }}>
      <SafeAreaView style={{ flex: 1 }} edges={edges}>
        {scroll ? (
          <ScrollView
            contentContainerStyle={{ padding, paddingBottom: 40, ...contentStyle }}
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
