import { useRouter } from "expo-router";
import { MessageSquare } from "lucide-react-native";
import React from "react";
import { ScrollView, View } from "react-native";
import { Avatar, Badge, EmptyState, ListItem, Screen, Text } from "../../../components/ui";
import { useConversationsList } from "../../../lib/api/hooks/messages";

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default function ParentMessagesScreen() {
  const router = useRouter();
  const query = useConversationsList();
  const list = query.data ?? [];

  return (
    <Screen padding={0} edges={["top"]}>
      <View style={{ padding: 20, paddingTop: 8 }}>
        <Text variant="title">Messages</Text>
        <Text variant="muted">Conversations with your care team.</Text>
      </View>

      {!query.isLoading && list.length === 0 ? (
        <EmptyState
          Icon={MessageSquare}
          title="No conversations"
          body="When a clinician messages you, it will appear here."
        />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 0, gap: 10 }}>
          {list.map((item) => (
            <ListItem
              key={item.id}
              title={item.participantName}
              subtitle={`${item.participantRole === "clinician" ? "Clinician" : "Practice"} · ${formatRelative(item.lastMessageAt)}`}
              leading={<Avatar name={item.participantName} size="md" />}
              trailing={item.unreadCount > 0 ? <Badge label={String(item.unreadCount)} variant="primary" /> : undefined}
              onPress={() =>
                router.push({
                  pathname: "/(app)/(parent)/messages/[conversationId]",
                  params: { conversationId: item.id, name: item.participantName },
                })
              }
            />
          ))}
        </ScrollView>
      )}
    </Screen>
  );
}
