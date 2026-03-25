import { ILoggerService } from '../interfaces/logger.interface';

/**
 * Concrete implementation for Google Cloud Logging
 * Ideally wraps @google-cloud/logging or pino with GCP transport
 */
export class GcpLoggerService implements ILoggerService {
  log(message: string, context?: any): void {
    console.log(`[GCP LOG] ${message}`, context || '');
  }

  error(message: string, trace?: string, context?: any): void {
    console.error(`[GCP ERROR] ${message}`, trace || '', context || '');
  }

  warn(message: string, context?: any): void {
    console.warn(`[GCP WARN] ${message}`, context || '');
  }

  debug(message: string, context?: any): void {
    console.debug(`[GCP DEBUG] ${message}`, context || '');
  }
}
