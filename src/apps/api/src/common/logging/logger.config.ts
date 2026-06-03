import { randomUUID } from 'crypto';
import type { IncomingMessage, ServerResponse } from 'http';
import type { Params } from 'nestjs-pino';
import { PII_REDACT_PATHS, REDACTION_CENSOR } from './redact-paths';

const CORRELATION_HEADER = 'x-request-id';

function isProd(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Build the nestjs-pino `Params` configuration.
 *
 * - In prod: pino's default JSON-to-stdout. Cloud Run captures stdout and
 *   Cloud Logging auto-parses JSON severity / message fields, so we get
 *   structured log entries without a custom transport.
 * - In dev: `pino-pretty` for human-readable colourised output.
 *
 * Every request is tagged with a UUID `reqId` — pulled from the incoming
 * `X-Request-Id` header if present, otherwise generated. The same id is set on
 * the response so downstream consumers can correlate.
 */
export function buildLoggerConfig(): Params {
  const prod = isProd();

  return {
    pinoHttp: {
      level: process.env.LOG_LEVEL ?? (prod ? 'info' : 'debug'),
      // Map pino's numeric levels to Cloud Logging's `severity` field so the
      // ingest auto-classifies entries without a server-side regex.
      formatters: {
        level(label: string) {
          const sev: Record<string, string> = {
            trace: 'DEBUG',
            debug: 'DEBUG',
            info: 'INFO',
            warn: 'WARNING',
            error: 'ERROR',
            fatal: 'CRITICAL',
          };
          return { severity: sev[label] ?? 'DEFAULT', level: label };
        },
      },
      messageKey: 'message',
      genReqId: (req: IncomingMessage, res: ServerResponse) => {
        const headerId = req.headers[CORRELATION_HEADER];
        const id =
          (Array.isArray(headerId) ? headerId[0] : headerId) ?? randomUUID();
        res.setHeader(CORRELATION_HEADER, id);
        return id;
      },
      customLogLevel: (_req, res, err) => {
        if (err || res.statusCode >= 500) return 'error';
        if (res.statusCode >= 400) return 'warn';
        return 'info';
      },
      redact: {
        paths: [...PII_REDACT_PATHS],
        censor: REDACTION_CENSOR,
        remove: false,
      },
      // Drop verbose default serializers; keep only what we want.
      serializers: {
        req(req: { id: string; method: string; url: string }) {
          return { id: req.id, method: req.method, url: req.url };
        },
        res(res: { statusCode: number }) {
          return { statusCode: res.statusCode };
        },
      },
      transport: prod
        ? undefined
        : {
            target: 'pino-pretty',
            options: {
              colorize: true,
              singleLine: true,
              translateTime: 'SYS:standard',
              ignore: 'pid,hostname',
            },
          },
    },
  };
}

export { CORRELATION_HEADER };
