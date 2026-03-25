export interface ITracingService {
  startSpan(name: string, options?: any): any;
  endSpan(span: any): void;
  recordException(span: any, error: Error): void;
  setAttribute(span: any, key: string, value: string | number | boolean): void;
}
