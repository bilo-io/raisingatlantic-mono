import { useLocalSearchParams } from "expo-router";
import { Send } from "lucide-react-native";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, TextInput, View } from "react-native";
import { useAuth } from "../../../../auth/useAuth";
import { Header, Screen, Text } from "../../../../components/ui";
import {
  useConversationThread,
  useSendMessage,
} from "../../../../lib/api/hooks/messages";
import { useTheme } from "../../../../theme/useTheme";

export default function ConversationThreadScreen() {
  const { conversationId, name } = useLocalSearchParams<{ conversationId: string; name?: string }>();
  const { user } = useAuth();
  const { tokens } = useTheme();
  const thread = useConversationThread(conversationId);
  const send = useSendMessage(conversationId);
  const [draft, setDraft] = useState("");

  function submit() {
    if (!draft.trim() || !user) return;
    send.mutate({ senderId: user.id, body: draft.trim() });
    setDraft("");
  }

  const messages = thread.data ?? [];

  return (
    <Screen padding={0} edges={["top"]}>
      <Header title={name ?? "Conversation"} />
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 8 }}>
          {messages.map((item) => {
            const isMe = item.senderId === user?.id;
            return (
              <View
                key={item.id}
                style={{
                  alignSelf: isMe ? "flex-end" : "flex-start",
                  maxWidth: "80%",
                  backgroundColor: isMe ? tokens.primary : tokens.card,
                  borderWidth: isMe ? 0 : 1,
                  borderColor: tokens.border,
                  borderRadius: 14,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                }}
              >
                <Text variant="body" style={{ color: isMe ? tokens.primaryForeground : tokens.foreground }}>
                  {item.body}
                </Text>
                <Text
                  variant="caption"
                  style={{
                    color: isMe ? tokens.primaryForeground : tokens.mutedForeground,
                    opacity: 0.7,
                    marginTop: 4,
                  }}
                >
                  {new Date(item.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </Text>
              </View>
            );
          })}
        </ScrollView>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 12,
            borderTopWidth: 1,
            borderTopColor: tokens.border,
            backgroundColor: tokens.background,
            gap: 8,
          }}
        >
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Write a message"
            placeholderTextColor={tokens.mutedForeground}
            multiline
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: tokens.border,
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 8,
              color: tokens.foreground,
              maxHeight: 100,
            }}
          />
          <Pressable
            onPress={submit}
            disabled={!draft.trim()}
            style={({ pressed }) => ({
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: draft.trim() ? tokens.primary : tokens.muted,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Send size={18} color={tokens.primaryForeground} />
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}
