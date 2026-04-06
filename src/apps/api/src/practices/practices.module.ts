import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Practice } from './practices.model';
import { GcpLoggerService } from '@core/telemetry/gcp/logger.service';
import { GcpTracingService } from '@core/telemetry/gcp/tracer.service';
import { GcpMetricService } from '@core/telemetry/gcp/metric.service';
import { GcpErrorReportingService } from '@core/telemetry/gcp/error-reporter.service';

import { PracticesService } from './practices.service';
import { PracticesController } from './practices.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Practice])],
  controllers: [PracticesController],
  providers: [
    PracticesService,
    { provide: 'ILoggerService', useClass: GcpLoggerService },
    { provide: 'ITracingService', useClass: GcpTracingService },
    { provide: 'IMetricService', useClass: GcpMetricService },
    { provide: 'IErrorReportingService', useClass: GcpErrorReportingService },
  ],
  exports: [PracticesService],
})
export class PracticesModule {}
