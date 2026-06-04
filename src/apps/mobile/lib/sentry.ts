import * as Sentry from "@sentry/react-native";

let initialised = false;

/**
 * Initialise Sentry once per app boot. DSN is read from
 * `EXPO_PUBLIC_SENTRY_DSN`; if unset, init is skipped so dev / preview builds
 * stay inert. Release identifier is the Git SHA injected by EAS Build.
 */
export function initSentry(): void {
  if (initialised) return;
  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
  if (!dsn) return;

  Sentry.init({
    dsn,
    release: process.env.EXPO_PUBLIC_SENTRY_RELEASE,
    environment:
      process.env.EXPO_PUBLIC_SENTRY_ENVIRONMENT ?? process.env.NODE_ENV ?? "development",
    tracesSampleRate: Number(process.env.EXPO_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? "0.1"),
    enableNativeFramesTracking: true,
    attachStacktrace: true,
  });
  initialised = true;
}

export { Sentry };
