import { IErrorReportingService } from '../interfaces/error-reporter.interface';

/**
 * Concrete implementation for Google Cloud Error Reporting
 */
export class GcpErrorReportingService implements IErrorReportingService {
  report(error: Error | string, context?: any): void {
    const errorMessage = typeof error === 'string' ? error : error.message;
    console.error(`[GCP ERROR REPORT] Reported: ${errorMessage}`, context || '');
  }

  reportException(exception: any, context?: any): void {
    console.error(`[GCP EXCEPTION REPORT] Reported Exception`, exception, context || '');
  }
}
