import type { Conversation, Message } from "@raising-atlantic/types";
import { fixtureClinicianId, fixtureParentId } from "./users";

// Canonical shapes live in @raising-atlantic/types; these aliases keep existing
// imports working without redefining the domain types inline (see MOBILE.md §M0.1).
export type FixtureMessage = Message;
export type FixtureConversation = Conversation;

const NOW_TS = Date.now();
const minutesAgo = (m: number) => new Date(NOW_TS - m * 60_000).toISOString();
const hoursAgo = (h: number) => new Date(NOW_TS - h * 3_600_000).toISOString();
const daysAgo = (d: number) => new Date(NOW_TS - d * 86_400_000).toISOString();

const CONV_A = "conv-00000001";
const CONV_B = "conv-00000002";

export const conversationsFixture: FixtureConversation[] = [
  {
    id: CONV_A,
    participantIds: [fixtureParentId, fixtureClinicianId],
    participantName: "Dr Sipho Ndlovu",
    participantRole: "clinician",
    lastMessageAt: minutesAgo(8),
    unreadCount: 2,
  },
  {
    id: CONV_B,
    participantIds: [fixtureParentId, fixtureClinicianId],
    participantName: "Atlantic Paediatrics — Sea Point",
    participantRole: "clinician",
    lastMessageAt: daysAgo(2),
    unreadCount: 0,
  },
];

export const messagesFixture: FixtureMessage[] = [
  {
    id: "msg-001",
    conversationId: CONV_A,
    senderId: fixtureClinicianId,
    body: "Hi Thandi, I reviewed Kabelo's last growth entry — everything is on track.",
    sentAt: hoursAgo(3),
  },
  {
    id: "msg-002",
    conversationId: CONV_A,
    senderId: fixtureParentId,
    body: "Thanks, doctor. Should we still come in next week for the 6-month check?",
    sentAt: hoursAgo(2),
  },
  {
    id: "msg-003",
    conversationId: CONV_A,
    senderId: fixtureClinicianId,
    body: "Yes — Tuesday 10am works. We'll do the next round of vaccines then.",
    sentAt: hoursAgo(1),
  },
  {
    id: "msg-004",
    conversationId: CONV_A,
    senderId: fixtureClinicianId,
    body: "Bring his Road to Health card with you please.",
    sentAt: minutesAgo(8),
  },
  {
    id: "msg-005",
    conversationId: CONV_B,
    senderId: fixtureParentId,
    body: "Hi, can I book a follow-up for Amani?",
    sentAt: daysAgo(3),
  },
  {
    id: "msg-006",
    conversationId: CONV_B,
    senderId: fixtureClinicianId,
    body: "Of course — what dates work?",
    sentAt: daysAgo(2),
  },
];
