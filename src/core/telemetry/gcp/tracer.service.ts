import { ITracingService } from '../interfaces/tracer.interface';

/**
 * Concrete implementation for Google Cloud Trace
 */
export class GcpTracingService implements ITracingService {
  startSpan(name: string, options?: any): any {
    console.log(`[GCP TRACE] Started span: ${name}`);
    return { name, startTime: Date.now() };
  }

  endSpan(span: any): void {
    const duration = Date.now() - span.startTime;
    console.log(`[GCP TRACE] Ended span: ${span.name} (Duration: ${duration}ms)`);
  }

  recordException(span: any, error: Error): void {
    console.log(`[GCP TRACE] Exception recorded on span ${span.name}: ${error.message}`);
  }

  setAttribute(span: any, key: string, value: string | number | boolean): void {
    console.log(`[GCP TRACE] Set attribute on span ${span.name}: ${key} = ${value}`);
  }
}
