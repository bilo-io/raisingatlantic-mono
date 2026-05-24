import { GcpLoggerService } from '@core/telemetry/gcp/logger.service';
import { GcpTracingService } from '@core/telemetry/gcp/tracer.service';
import { GcpMetricService } from '@core/telemetry/gcp/metric.service';
import { GcpErrorReportingService } from '@core/telemetry/gcp/error-reporter.service';

describe('GcpLoggerService', () => {
  let logger: GcpLoggerService;
  let log: jest.SpyInstance;
  let error: jest.SpyInstance;
  let warn: jest.SpyInstance;
  let debug: jest.SpyInstance;

  beforeEach(() => {
    logger = new GcpLoggerService();
    log = jest.spyOn(console, 'log').mockImplementation(() => {});
    error = jest.spyOn(console, 'error').mockImplementation(() => {});
    warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    debug = jest.spyOn(console, 'debug').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('log() writes a [GCP LOG] prefixed line', () => {
    logger.log('hello');
    expect(log).toHaveBeenCalledWith('[GCP LOG] hello', '');
  });

  it('log() forwards context object when present', () => {
    logger.log('with ctx', { userId: 'u-1' });
    expect(log).toHaveBeenCalledWith('[GCP LOG] with ctx', { userId: 'u-1' });
  });

  it('error() includes trace + context', () => {
    logger.error('boom', 'stack-trace', { req: 'x' });
    expect(error).toHaveBeenCalledWith('[GCP ERROR] boom', 'stack-trace', {
      req: 'x',
    });
  });

  it('warn() and debug() route to the right console method', () => {
    logger.warn('careful');
    logger.debug('detail');
    expect(warn).toHaveBeenCalledWith('[GCP WARN] careful', '');
    expect(debug).toHaveBeenCalledWith('[GCP DEBUG] detail', '');
  });
});

describe('GcpTracingService', () => {
  let tracer: GcpTracingService;
  let log: jest.SpyInstance;

  beforeEach(() => {
    tracer = new GcpTracingService();
    log = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('startSpan returns a span with name + startTime', () => {
    const span = tracer.startSpan('Service.method');
    expect(span.name).toBe('Service.method');
    expect(typeof span.startTime).toBe('number');
    expect(log).toHaveBeenCalledWith(
      '[GCP TRACE] Started span: Service.method',
    );
  });

  it('endSpan logs duration', () => {
    const span = tracer.startSpan('s');
    span.startTime -= 25; // simulate elapsed time
    tracer.endSpan(span);
    expect(log).toHaveBeenCalledWith(
      expect.stringMatching(/\[GCP TRACE\] Ended span: s \(Duration: \d+ms\)/),
    );
  });

  it('recordException logs the message but does not throw', () => {
    const span = tracer.startSpan('s');
    expect(() => tracer.recordException(span, new Error('x'))).not.toThrow();
    expect(log).toHaveBeenCalledWith(
      '[GCP TRACE] Exception recorded on span s: x',
    );
  });

  it('setAttribute logs the key/value pair', () => {
    const span = tracer.startSpan('s');
    tracer.setAttribute(span, 'user.id', 'abc');
    expect(log).toHaveBeenCalledWith(
      '[GCP TRACE] Set attribute on span s: user.id = abc',
    );
  });
});

describe('GcpMetricService', () => {
  let metric: GcpMetricService;
  let log: jest.SpyInstance;

  beforeEach(() => {
    metric = new GcpMetricService();
    log = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('incrementCounter defaults the value to 1', () => {
    metric.incrementCounter('user.created');
    expect(log).toHaveBeenCalledWith(
      '[GCP METRIC] Incrementing counter: user.created by 1',
      '',
    );
  });

  it('incrementCounter forwards explicit value + attributes', () => {
    metric.incrementCounter('user.created', 5, { tenant: 't-1' });
    expect(log).toHaveBeenCalledWith(
      '[GCP METRIC] Incrementing counter: user.created by 5',
      { tenant: 't-1' },
    );
  });

  it('recordValue and recordHistogram emit prefixed logs', () => {
    metric.recordValue('latency.ms', 42, { route: '/v1/users' });
    metric.recordHistogram('latency.histogram', 100);
    expect(log).toHaveBeenCalledWith(
      '[GCP METRIC] Recording value for latency.ms: 42',
      { route: '/v1/users' },
    );
    expect(log).toHaveBeenCalledWith(
      '[GCP METRIC] Recording histogram for latency.histogram: 100',
      '',
    );
  });
});

describe('GcpErrorReportingService', () => {
  let reporter: GcpErrorReportingService;
  let error: jest.SpyInstance;

  beforeEach(() => {
    reporter = new GcpErrorReportingService();
    error = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('report() handles a string error', () => {
    reporter.report('something bad');
    expect(error).toHaveBeenCalledWith(
      '[GCP ERROR REPORT] Reported: something bad',
      '',
    );
  });

  it('report() unwraps an Error instance to message', () => {
    reporter.report(new Error('boom'), { ctx: 'x' });
    expect(error).toHaveBeenCalledWith('[GCP ERROR REPORT] Reported: boom', {
      ctx: 'x',
    });
  });

  it('reportException logs the exception object', () => {
    const ex = new Error('explode');
    reporter.reportException(ex, { trace: 'abc' });
    expect(error).toHaveBeenCalledWith(
      '[GCP EXCEPTION REPORT] Reported Exception',
      ex,
      { trace: 'abc' },
    );
  });
});
