/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
/**
 * Observability bootstrap.
 *
 * Loaded as the very first import of `main.ts` so that:
 *  1. Sentry.init runs before any other module is required (its instrumentation
 *     hooks have to attach before Express / Nest are loaded).
 *  2. The OpenTelemetry NodeSDK starts next, attaching auto-instrumentations
 *     for HTTP, Express, Postgres, and pino.
 *
 * Behaviour is gated by environment so the file is safe to import in CI,
 * unit-test runs, and local dev without a live Sentry DSN or GCP credentials.
 */

const dsn = process.env.SENTRY_DSN_API ?? process.env.SENTRY_DSN;
const release = process.env.SENTRY_RELEASE ?? process.env.GIT_SHA;
const environment =
  process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV ?? 'development';

if (dsn) {
  // Require lazily so test runs that don't exercise this file don't pay the
  // import cost.
  const Sentry = require('@sentry/nestjs');
  const { nodeProfilingIntegration } = require('@sentry/profiling-node');
  Sentry.init({
    dsn,
    release,
    environment,
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? '0.1'),
    profilesSampleRate: Number(
      process.env.SENTRY_PROFILES_SAMPLE_RATE ?? '0.1',
    ),
    integrations: [nodeProfilingIntegration()],
  });
}

if (process.env.OTEL_ENABLED === 'true') {
  const { NodeSDK } = require('@opentelemetry/sdk-node');
  const {
    getNodeAutoInstrumentations,
  } = require('@opentelemetry/auto-instrumentations-node');
  const { Resource } = require('@opentelemetry/resources');
  const {
    SemanticResourceAttributes,
  } = require('@opentelemetry/semantic-conventions');
  const {
    TraceExporter,
  } = require('@google-cloud/opentelemetry-cloud-trace-exporter');
  const {
    MetricExporter,
  } = require('@google-cloud/opentelemetry-cloud-monitoring-exporter');
  const {
    PeriodicExportingMetricReader,
  } = require('@opentelemetry/sdk-metrics');

  const sdk = new NodeSDK({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]:
        process.env.OTEL_SERVICE_NAME ?? 'ra-api',
      [SemanticResourceAttributes.SERVICE_VERSION]: release ?? 'dev',
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: environment,
    }),
    traceExporter: new TraceExporter(),
    metricReader: new PeriodicExportingMetricReader({
      exporter: new MetricExporter(),
      exportIntervalMillis: 60_000,
    }),
    instrumentations: [
      getNodeAutoInstrumentations({
        '@opentelemetry/instrumentation-fs': { enabled: false },
      }),
    ],
  });

  sdk.start();

  process.on('SIGTERM', () => {
    sdk
      .shutdown()
      .catch(() => undefined)
      .finally(() => process.exit(0));
  });
}
