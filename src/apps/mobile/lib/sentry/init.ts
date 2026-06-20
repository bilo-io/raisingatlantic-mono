import Constants from "expo-constants";
import * as Sentry from "@sentry/react-native";
import { scrubSentryEvent, type SentryEventLike } from "./scrub";

let initialized = false;

export function initSentry(): void {
  if (initialized) return;
  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN ?? "";
  if (!dsn) {
    if (__DEV__) {
      console.info("[sentry] DSN not set, init skipped");
    }
    return;
  }

  Sentry.init({
    dsn,
    environment: __DEV__ ? "development" : "production",
    release: Constants.expoConfig?.version ?? "unknown",
    tracesSampleRate: 0,
    sendDefaultPii: false,
    beforeSend: (event) =>
      scrubSentryEvent(event as unknown as SentryEventLike) as unknown as typeof event,
  });

  initialized = true;
}

export function isSentryInitialized(): boolean {
  return initialized;
}

export function captureHandledError(
  err: unknown,
  context?: Record<string, unknown>,
): void {
  if (!initialized) return;
  Sentry.captureException(err, context ? { extra: context } : undefined);
}
