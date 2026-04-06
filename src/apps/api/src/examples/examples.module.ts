import { Module } from '@nestjs/common';
import { ExamplesController } from './examples.controller';
import { ExamplesService } from './examples.service';
import { GcpLoggerService } from '@core/telemetry/gcp/logger.service';
import { GcpTracingService } from '@core/telemetry/gcp/tracer.service';
import { GcpMetricService } from '@core/telemetry/gcp/metric.service';
import { GcpErrorReportingService } from '@core/telemetry/gcp/error-reporter.service';

@Module({
  controllers: [ExamplesController],
  providers: [
    ExamplesService,
    { provide: 'ILoggerService', useClass: GcpLoggerService },
    { provide: 'ITracingService', useClass: GcpTracingService },
    { provide: 'IMetricService', useClass: GcpMetricService },
    { provide: 'IErrorReportingService', useClass: GcpErrorReportingService },
  ],
})
export class ExamplesModule {}
