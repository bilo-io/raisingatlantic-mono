import { api } from "../client";
import { useApi } from "../data-source";
import type { PushTopic } from "../../push/topics";

export type Platform = "ios" | "android" | "web";

export type RegisterPushTokenInput = {
  token: string;
  platform: Platform;
  topics: PushTopic[];
};

export type RegisteredPushToken = {
  id: string;
  token: string;
  platform: Platform;
  topics: PushTopic[];
  createdAt: string;
};

const mockStore = new Map<string, RegisteredPushToken>();

export async function registerPushToken(
  input: RegisterPushTokenInput,
): Promise<RegisteredPushToken> {
  if (useApi()) {
    const res = await api.post<RegisteredPushToken>(
      "/users/me/push-tokens",
      input,
    );
    return res.data;
  }
  const entry: RegisteredPushToken = {
    id: `mock-${input.token.slice(-8)}`,
    token: input.token,
    platform: input.platform,
    topics: input.topics,
    createdAt: new Date().toISOString(),
  };
  mockStore.set(input.token, entry);
  if (__DEV__) {
    console.info("[push] mock register", {
      platform: input.platform,
      topics: input.topics,
      tokenSuffix: input.token.slice(-6),
    });
  }
  return entry;
}

export async function deregisterPushToken(token: string): Promise<void> {
  if (useApi()) {
    await api.delete(`/users/me/push-tokens/${encodeURIComponent(token)}`);
    return;
  }
  mockStore.delete(token);
  if (__DEV__) {
    console.info("[push] mock deregister", { tokenSuffix: token.slice(-6) });
  }
}
