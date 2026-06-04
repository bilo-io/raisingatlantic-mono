import { useApi } from "../data-source";
import {
  conversationsFixture,
  type FixtureConversation,
  type FixtureMessage,
  messagesFixture,
} from "../fixtures/messages";

// NOTE: messages backend does not exist yet (MOBILE.md §M1.4 — Tier 3 / deferred).
// Real-API branches throw deliberately so any accidental EXPO_PUBLIC_USE_API=true call
// surfaces fast instead of silently returning empty data.
const BACKEND_MISSING =
  "Messages backend not available — see docs/GO_LIVE/MOBILE.md §M1.4";

export async function listConversations(): Promise<FixtureConversation[]> {
  if (useApi()) throw new Error(BACKEND_MISSING);
  return conversationsFixture
    .slice()
    .sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt));
}

export async function listConversationMessages(
  conversationId: string,
): Promise<FixtureMessage[]> {
  if (useApi()) throw new Error(BACKEND_MISSING);
  return messagesFixture
    .filter((m) => m.conversationId === conversationId)
    .sort((a, b) => a.sentAt.localeCompare(b.sentAt));
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  body: string,
): Promise<FixtureMessage> {
  if (useApi()) throw new Error(BACKEND_MISSING);
  return {
    id: `msg-${Date.now()}`,
    conversationId,
    senderId,
    body,
    sentAt: new Date().toISOString(),
  };
}
