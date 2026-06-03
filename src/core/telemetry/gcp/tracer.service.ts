import { ITracingService } from '../interfaces/tracer.interface';

/**
 * Span surface the adapter operates against. Designed to be satisfied by
 * OpenTelemetry's `Span` (each method maps 1:1) and trivially mockable.
 */
export interface SpanLike {
  end(): void;
  recordException(error: Error): void;
  setAttribute(key: string, value: string | number | boolean): void;
}

export interface TracerSink {
  startSpan(name: string, options?: Record<string, unknown>): SpanLike;
}

function noopSpan(name: string): SpanLike & { name: string; startTime: number } {
  return {
    name,
    startTime: Date.now(),
    end() {
      /* no-op until OTel is wired */
    },
    recordException(_error: Error) {
      /* no-op */
    },
    setAttribute(_key: string, _value: string | number | boolean) {
      /* no-op */
    },
  };
}

function defaultTracerSink(): TracerSink {
  return {
    startSpan(name: string) {
      return noopSpan(name);
    },
  };
}

/**
 * GCP-bound implementation of `ITracingService`. In production this is wired
 * to an OpenTelemetry tracer (see `instrumentation.ts`) whose `Tracer.startSpan`
 * shape is compatible with `TracerSink.startSpan`. The Cloud Trace exporter
 * batches spans and ships them to GCP.
 */
export class GcpTracingService implements ITracingService {
  private readonly sink: TracerSink;

  constructor(sink?: TracerSink) {
    this.sink = sink ?? defaultTracerSink();
  }

  startSpan(name: string, options?: Record<string, unknown>): SpanLike {
    return this.sink.startSpan(name, options);
  }

  endSpan(span: SpanLike): void {
    span.end();
  }

  recordException(span: SpanLike, error: Error): void {
    span.recordException(error);
  }

  setAttribute(span: SpanLike, key: string, value: string | number | boolean): void {
    span.setAttribute(key, value);
  }
}
