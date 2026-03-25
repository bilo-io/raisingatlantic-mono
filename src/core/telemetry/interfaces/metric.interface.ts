export interface IMetricService {
  incrementCounter(name: string, value?: number, attributes?: Record<string, string | number | boolean>): void;
  recordValue(name: string, value: number, attributes?: Record<string, string | number | boolean>): void;
  recordHistogram(name: string, value: number, attributes?: Record<string, string | number | boolean>): void;
}
