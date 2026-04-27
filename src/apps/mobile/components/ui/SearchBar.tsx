import { Search, X } from "lucide-react-native";
import React from "react";
import { Pressable, TextInput, View } from "react-native";
import { useTheme } from "../../theme/useTheme";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
};

export function SearchBar({ value, onChangeText, placeholder = "Search", autoFocus }: Props) {
  const { tokens } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        borderWidth: 1,
        borderColor: tokens.border,
        borderRadius: 12,
        backgroundColor: tokens.card,
        paddingHorizontal: 12,
      }}
    >
      <Search size={18} color={tokens.mutedForeground} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={tokens.mutedForeground}
        autoFocus={autoFocus}
        style={{
          flex: 1,
          paddingVertical: 12,
          color: tokens.foreground,
          fontSize: 15,
        }}
      />
      {value.length > 0 ? (
        <Pressable onPress={() => onChangeText("")} hitSlop={12}>
          <X size={18} color={tokens.mutedForeground} />
        </Pressable>
      ) : null}
    </View>
  );
}
