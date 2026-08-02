import { z } from "zod";

// The "other participant" role as surfaced to the caller. `super_admin` users
// are collapsed to `admin` for display (the mobile UI only distinguishes
// clinician from everything-else).
export const conversationParticipantRoleSchema = z.enum([
  "parent",
  "clinician",
  "admin",
]);

export type ConversationParticipantRole = z.infer<
  typeof conversationParticipantRoleSchema
>;

export const messageSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  senderId: z.string(),
  body: z.string(),
  sentAt: z.string(),
});

export type Message = z.infer<typeof messageSchema>;

// Caller-relative view of a conversation: `participantName`/`participantRole`
// describe the OTHER party, and `unreadCount` is computed for the caller.
export const conversationSchema = z.object({
  id: z.string(),
  participantIds: z.array(z.string()),
  participantName: z.string(),
  participantRole: conversationParticipantRoleSchema,
  lastMessageAt: z.string(),
  unreadCount: z.number(),
});

export type Conversation = z.infer<typeof conversationSchema>;

export const createConversationSchema = z.object({
  participantIds: z.array(z.string().min(1)).min(1),
});

export type CreateConversationInput = z.infer<typeof createConversationSchema>;

export const sendMessageSchema = z.object({
  body: z.string().min(1),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
