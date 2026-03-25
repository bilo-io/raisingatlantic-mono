import { IMetricService } from '../interfaces/metric.interface';

/**
 * Concrete implementation for Google Cloud Monitoring
 */
export class GcpMetricService implements IMetricService {
  incrementCounter(name: string, value: number = 1, attributes?: Record<string, string | number | boolean>): void {
    console.log(`[GCP METRIC] Incrementing counter: ${name} by ${value}`, attributes || '');
  }

  recordValue(name: string, value: number, attributes?: Record<string, string | number | boolean>): void {
    console.log(`[GCP METRIC] Recording value for ${name}: ${value}`, attributes || '');
  }

  recordHistogram(name: string, value: number, attributes?: Record<string, string | number | boolean>): void {
    console.log(`[GCP METRIC] Recording histogram for ${name}: ${value}`, attributes || '');
  }
}
