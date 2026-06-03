// Next.js instrumentation hook — fires once per worker before any request is
// served. Delegates to the runtime-specific Sentry config so server and edge
// contexts each initialise their own SDK instance.
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

export const onRequestError = async (...args: unknown[]): Promise<void> => {
  // Lazy import so prod bundles that don't include Sentry still type-check.
  const { captureRequestError } = await import('@sentry/nextjs');
  // @ts-expect-error — `captureRequestError` accepts the Next.js error hook signature
  return captureRequestError(...args);
};
