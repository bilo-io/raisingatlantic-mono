import { ILoggerService } from '../interfaces/logger.interface';

/**
 * Minimal logger surface this adapter delegates to. Designed to be satisfied
 * by `nestjs-pino`'s `PinoLogger` in production (`info/warn/error/debug` all
 * accept `(obj, msg)`), and trivially mockable in unit tests.
 */
export interface LoggerSink {
  info(obj: Record<string, unknown> | string, msg?: string): void;
  warn(obj: Record<string, unknown> | string, msg?: string): void;
  error(obj: Record<string, unknown> | string, msg?: string): void;
  debug(obj: Record<string, unknown> | string, msg?: string): void;
}

/**
 * Structured-JSON fallback used when no sink is injected (e.g. unit tests,
 * standalone scripts, or contexts outside the Nest container). Output goes to
 * stdout/stderr in a shape Cloud Logging can parse if the process is captured
 * by Cloud Run / GKE.
 */
function defaultConsoleSink(): LoggerSink {
  const emit = (
    stream: 'log' | 'warn' | 'error' | 'debug',
    level: 'info' | 'warn' | 'error' | 'debug',
    obj: Record<string, unknown> | string,
    msg?: string,
  ): void => {
    const ctx = typeof obj === 'object' && obj !== null ? obj : { context: obj };
    const line = JSON.stringify({
      severity: level.toUpperCase(),
      message: msg,
      ...ctx,
    });
    // eslint-disable-next-line no-console
    console[stream](line);
  };

  return {
    info: (obj, msg) => emit('log', 'info', obj, msg),
    warn: (obj, msg) => emit('warn', 'warn', obj, msg),
    error: (obj, msg) => emit('error', 'error', obj, msg),
    debug: (obj, msg) => emit('debug', 'debug', obj, msg),
  };
}

/**
 * GCP-bound implementation of `ILoggerService`. In production it is wired up to
 * `nestjs-pino` (whose `PinoLogger` is shape-compatible with `LoggerSink`),
 * which in turn streams structured JSON to stdout → Cloud Logging.
 *
 * Field-level redaction of POPIA-sensitive data is handled by pino's
 * `redact` option configured in `src/apps/api/src/common/logging/logger.config.ts`.
 */
export class GcpLoggerService implements ILoggerService {
  private readonly sink: LoggerSink;

  constructor(sink?: LoggerSink) {
    this.sink = sink ?? defaultConsoleSink();
  }

  log(message: string, context?: unknown): void {
    this.sink.info(this.toRecord(context), message);
  }

  error(message: string, trace?: string, context?: unknown): void {
    const record = this.toRecord(context);
    if (trace) record.trace = trace;
    this.sink.error(record, message);
  }

  warn(message: string, context?: unknown): void {
    this.sink.warn(this.toRecord(context), message);
  }

  debug(message: string, context?: unknown): void {
    this.sink.debug(this.toRecord(context), message);
  }

  private toRecord(context: unknown): Record<string, unknown> {
    if (context === undefined || context === null) return {};
    if (typeof context === 'object') return { ...(context as Record<string, unknown>) };
    return { context };
  }
}
