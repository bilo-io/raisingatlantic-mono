import type { Conversation, Message } from "@raising-atlantic/types";
import { api } from "../client";
import { useApi } from "../data-source";
import { conversationsFixture, messagesFixture } from "../fixtures/messages";

export async function listConversations(): Promise<Conversation[]> {
  if (useApi()) {
    const res = await api.get<Conversation[]>("/conversations");
    return res.data;
  }
  return conversationsFixture
    .slice()
    .sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt));
}

export async function listConversationMessages(
  conversationId: string,
): Promise<Message[]> {
  if (useApi()) {
    const res = await api.get<Message[]>(
      `/conversations/${conversationId}/messages`,
    );
    return res.data;
  }
  return messagesFixture
    .filter((m) => m.conversationId === conversationId)
    .sort((a, b) => a.sentAt.localeCompare(b.sentAt));
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  body: string,
): Promise<Message> {
  if (useApi()) {
    // The server derives the sender from the auth token — never send senderId.
    const res = await api.post<Message>(
      `/conversations/${conversationId}/messages`,
      { body },
    );
    return res.data;
  }
  return {
    id: `msg-${Date.now()}`,
    conversationId,
    senderId,
    body,
    sentAt: new Date().toISOString(),
  };
}
