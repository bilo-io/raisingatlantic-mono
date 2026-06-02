import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listConversationMessages,
  listConversations,
  sendMessage,
} from "../adapters/message.adapter";
import type { FixtureConversation, FixtureMessage } from "../fixtures/messages";

const keys = {
  list: ["messages", "conversations"] as const,
  thread: (id: string) => ["messages", "thread", id] as const,
};

export function useConversationsList() {
  return useQuery<FixtureConversation[], Error>({
    queryKey: keys.list,
    queryFn: () => listConversations(),
    refetchInterval: 30_000,
  });
}

export function useConversationThread(id: string | undefined | null) {
  return useQuery<FixtureMessage[], Error>({
    queryKey: keys.thread(id ?? ""),
    queryFn: () => listConversationMessages(id as string),
    enabled: !!id,
    refetchInterval: 15_000,
  });
}

export function useSendMessage(conversationId: string | undefined | null) {
  const qc = useQueryClient();
  return useMutation<FixtureMessage, Error, { senderId: string; body: string }>({
    mutationFn: ({ senderId, body }) =>
      sendMessage(conversationId as string, senderId, body),
    onSuccess: (msg) => {
      if (!conversationId) return;
      qc.setQueryData<FixtureMessage[]>(keys.thread(conversationId), (prev) =>
        prev ? [...prev, msg] : [msg],
      );
    },
  });
}
