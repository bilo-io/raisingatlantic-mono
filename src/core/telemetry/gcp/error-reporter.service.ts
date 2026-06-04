import { IErrorReportingService } from '../interfaces/error-reporter.interface';

/**
 * Surface the adapter delegates to. `@sentry/nestjs` exports
 * `captureException(exception, hint?)` and `captureMessage(message, level?)`
 * with shapes compatible with this interface.
 */
export interface ErrorSink {
  captureException(exception: unknown, hint?: { extra?: Record<string, unknown> }): void;
  captureMessage(
    message: string,
    level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug',
    hint?: { extra?: Record<string, unknown> },
  ): void;
}

function defaultErrorSink(): ErrorSink {
  // Pre-Sentry-init fallback: stderr in structured JSON so Cloud Run captures it.
  const emit = (level: string, payload: Record<string, unknown>): void => {
    // eslint-disable-next-line no-console
    console.error(JSON.stringify({ severity: 'ERROR', errorLevel: level, ...payload }));
  };

  return {
    captureException(exception, hint) {
      const err = exception instanceof Error
        ? { message: exception.message, stack: exception.stack, name: exception.name }
        : { value: exception };
      emit('exception', { ...err, extra: hint?.extra });
    },
    captureMessage(message, level = 'error', hint) {
      emit(level, { message, extra: hint?.extra });
    },
  };
}

/**
 * GCP-bound implementation of `IErrorReportingService`. In production wired to
 * `@sentry/nestjs` via dependency injection. Sentry SDK forwards events to the
 * configured DSN; source-map upload and release tagging are handled by the CI
 * pipeline using the Git SHA as the release identifier.
 */
export class GcpErrorReportingService implements IErrorReportingService {
  private readonly sink: ErrorSink;

  constructor(sink?: ErrorSink) {
    this.sink = sink ?? defaultErrorSink();
  }

  report(error: Error | string, context?: unknown): void {
    const extra = this.toExtra(context);
    if (typeof error === 'string') {
      this.sink.captureMessage(error, 'error', { extra });
    } else {
      this.sink.captureException(error, { extra });
    }
  }

  reportException(exception: unknown, context?: unknown): void {
    this.sink.captureException(exception, { extra: this.toExtra(context) });
  }

  private toExtra(context: unknown): Record<string, unknown> | undefined {
    if (context === undefined || context === null) return undefined;
    if (typeof context === 'object') return { ...(context as Record<string, unknown>) };
    return { context };
  }
}
