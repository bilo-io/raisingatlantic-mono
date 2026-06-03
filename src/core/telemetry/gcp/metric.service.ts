import { IMetricService } from '../interfaces/metric.interface';

type AttrMap = Record<string, string | number | boolean>;

export interface CounterLike {
  add(value: number, attributes?: AttrMap): void;
}

export interface HistogramLike {
  record(value: number, attributes?: AttrMap): void;
}

export interface MeterLike {
  createCounter(name: string): CounterLike;
  createHistogram(name: string): HistogramLike;
}

function noopMeter(): MeterLike {
  return {
    createCounter() {
      return { add() {} };
    },
    createHistogram() {
      return { record() {} };
    },
  };
}

/**
 * GCP-bound implementation of `IMetricService`. In production this delegates
 * to an OpenTelemetry meter (see `instrumentation.ts`) whose metrics are
 * exported to Cloud Monitoring via
 * `@google-cloud/opentelemetry-cloud-monitoring-exporter`.
 *
 * Counters and histograms are cached per metric name so the underlying
 * instrument is only created once.
 */
export class GcpMetricService implements IMetricService {
  private readonly meter: MeterLike;
  private readonly counters = new Map<string, CounterLike>();
  private readonly histograms = new Map<string, HistogramLike>();

  constructor(meter?: MeterLike) {
    this.meter = meter ?? noopMeter();
  }

  incrementCounter(name: string, value: number = 1, attributes?: AttrMap): void {
    this.counter(name).add(value, attributes);
  }

  recordValue(name: string, value: number, attributes?: AttrMap): void {
    // Cloud Monitoring distinguishes gauges (recordValue) from histograms only
    // by instrument type; for non-aggregating point-in-time values we feed a
    // histogram which preserves percentile fidelity downstream.
    this.histogram(name).record(value, attributes);
  }

  recordHistogram(name: string, value: number, attributes?: AttrMap): void {
    this.histogram(name).record(value, attributes);
  }

  private counter(name: string): CounterLike {
    let c = this.counters.get(name);
    if (!c) {
      c = this.meter.createCounter(name);
      this.counters.set(name, c);
    }
    return c;
  }

  private histogram(name: string): HistogramLike {
    let h = this.histograms.get(name);
    if (!h) {
      h = this.meter.createHistogram(name);
      this.histograms.set(name, h);
    }
    return h;
  }
}
