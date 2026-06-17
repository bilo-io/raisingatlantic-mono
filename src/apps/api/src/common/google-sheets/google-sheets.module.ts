import { Global, Module } from '@nestjs/common';
import { GoogleSheetsService } from './google-sheets.service';
import { GcpLoggerService } from '@core/telemetry/gcp/logger.service';
import { GcpErrorReportingService } from '@core/telemetry/gcp/error-reporter.service';

/**
 * Provides the shared GoogleSheetsService. Global so feature modules
 * (feature-requests, leads) can inject it without re-importing.
 */
@Global()
@Module({
  providers: [
    GoogleSheetsService,
    { provide: 'ILoggerService', useClass: GcpLoggerService },
    { provide: 'IErrorReportingService', useClass: GcpErrorReportingService },
  ],
  exports: [GoogleSheetsService],
})
export class GoogleSheetsModule {}
