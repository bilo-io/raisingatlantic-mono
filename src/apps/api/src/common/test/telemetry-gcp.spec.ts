import {
  GcpLoggerService,
  LoggerSink,
} from '@core/telemetry/gcp/logger.service';
import {
  GcpTracingService,
  SpanLike,
  TracerSink,
} from '@core/telemetry/gcp/tracer.service';
import {
  GcpMetricService,
  CounterLike,
  HistogramLike,
  MeterLike,
} from '@core/telemetry/gcp/metric.service';
import {
  GcpErrorReportingService,
  ErrorSink,
} from '@core/telemetry/gcp/error-reporter.service';

function makeLoggerSink(): jest.Mocked<LoggerSink> {
  return {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  };
}

describe('GcpLoggerService (Pino delegate)', () => {
  let sink: jest.Mocked<LoggerSink>;
  let logger: GcpLoggerService;

  beforeEach(() => {
    sink = makeLoggerSink();
    logger = new GcpLoggerService(sink);
  });

  it('log() forwards an empty object when no context is supplied', () => {
    logger.log('hello');
    expect(sink.info).toHaveBeenCalledWith({}, 'hello');
  });

  it('log() forwards a structured context object', () => {
    logger.log('with ctx', { userId: 'u-1' });
    expect(sink.info).toHaveBeenCalledWith({ userId: 'u-1' }, 'with ctx');
  });

  it('error() attaches the trace under the `trace` key', () => {
    logger.error('boom', 'stack-trace', { reqId: 'r-1' });
    expect(sink.error).toHaveBeenCalledWith(
      { reqId: 'r-1', trace: 'stack-trace' },
      'boom',
    );
  });

  it('warn() and debug() route to the right sink method', () => {
    logger.warn('careful');
    logger.debug('detail');
    expect(sink.warn).toHaveBeenCalledWith({}, 'careful');
    expect(sink.debug).toHaveBeenCalledWith({}, 'detail');
  });

  it('coerces a non-object context into a `context` field', () => {
    logger.log('plain', 'string-context' as unknown);
    expect(sink.info).toHaveBeenCalledWith(
      { context: 'string-context' },
      'plain',
    );
  });
});

describe('GcpTracingService (OTel delegate)', () => {
  let span: jest.Mocked<SpanLike>;
  let tracer: jest.Mocked<TracerSink>;
  let svc: GcpTracingService;

  beforeEach(() => {
    span = {
      end: jest.fn(),
      recordException: jest.fn(),
      setAttribute: jest.fn(),
    };
    tracer = { startSpan: jest.fn().mockReturnValue(span) };
    svc = new GcpTracingService(tracer);
  });

  it('startSpan delegates to the injected tracer', () => {
    const opts = { kind: 'server' };
    const result = svc.startSpan('UsersService.create', opts);
    expect(tracer.startSpan).toHaveBeenCalledWith('UsersService.create', opts);
    expect(result).toBe(span);
  });

  it('endSpan calls span.end()', () => {
    svc.endSpan(span);
    expect(span.end).toHaveBeenCalled();
  });

  it('recordException + setAttribute forward to the span', () => {
    const err = new Error('explode');
    svc.recordException(span, err);
    svc.setAttribute(span, 'user.id', 'abc');
    expect(span.recordException).toHaveBeenCalledWith(err);
    expect(span.setAttribute).toHaveBeenCalledWith('user.id', 'abc');
  });

  it('uses a no-op tracer by default (no throws)', () => {
    const fallback = new GcpTracingService();
    const s = fallback.startSpan('any');
    expect(() => {
      s.setAttribute('k', 'v');
      s.recordException(new Error('x'));
      fallback.endSpan(s);
    }).not.toThrow();
  });
});

describe('GcpMetricService (OTel delegate)', () => {
  let counter: jest.Mocked<CounterLike>;
  let histogram: jest.Mocked<HistogramLike>;
  let meter: jest.Mocked<MeterLike>;
  let svc: GcpMetricService;

  beforeEach(() => {
    counter = { add: jest.fn() };
    histogram = { record: jest.fn() };
    meter = {
      createCounter: jest.fn().mockReturnValue(counter),
      createHistogram: jest.fn().mockReturnValue(histogram),
    };
    svc = new GcpMetricService(meter);
  });

  it('incrementCounter defaults the delta to 1', () => {
    svc.incrementCounter('user.created');
    expect(meter.createCounter).toHaveBeenCalledWith('user.created');
    expect(counter.add).toHaveBeenCalledWith(1, undefined);
  });

  it('caches counters by name', () => {
    svc.incrementCounter('user.created', 1);
    svc.incrementCounter('user.created', 4, { tenant: 't-1' });
    expect(meter.createCounter).toHaveBeenCalledTimes(1);
    expect(counter.add).toHaveBeenNthCalledWith(2, 4, { tenant: 't-1' });
  });

  it('recordValue feeds a histogram', () => {
    svc.recordValue('latency.ms', 42, { route: '/v1/users' });
    expect(meter.createHistogram).toHaveBeenCalledWith('latency.ms');
    expect(histogram.record).toHaveBeenCalledWith(42, { route: '/v1/users' });
  });

  it('recordHistogram caches the histogram instrument', () => {
    svc.recordHistogram('h', 1);
    svc.recordHistogram('h', 2);
    expect(meter.createHistogram).toHaveBeenCalledTimes(1);
  });
});

describe('GcpErrorReportingService (Sentry delegate)', () => {
  let sink: jest.Mocked<ErrorSink>;
  let svc: GcpErrorReportingService;

  beforeEach(() => {
    sink = {
      captureException: jest.fn(),
      captureMessage: jest.fn(),
    };
    svc = new GcpErrorReportingService(sink);
  });

  it('report(string) goes to captureMessage at error level', () => {
    svc.report('something bad', { route: '/v1/x' });
    expect(sink.captureMessage).toHaveBeenCalledWith('something bad', 'error', {
      extra: { route: '/v1/x' },
    });
  });

  it('report(Error) goes to captureException with extras', () => {
    const err = new Error('boom');
    svc.report(err, { ctx: 'x' });
    expect(sink.captureException).toHaveBeenCalledWith(err, {
      extra: { ctx: 'x' },
    });
  });

  it('reportException forwards arbitrary exception objects', () => {
    const obj = { weird: true };
    svc.reportException(obj);
    expect(sink.captureException).toHaveBeenCalledWith(obj, {
      extra: undefined,
    });
  });
});
