// Sentry edge runtime init (middleware + edge route handlers).
import * as Sentry from '@sentry/nextjs';

const dsn = process.env.SENTRY_DSN_WEB ?? process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    release: process.env.SENTRY_RELEASE ?? process.env.GIT_SHA,
    environment: process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? '0.1'),
  });
}
