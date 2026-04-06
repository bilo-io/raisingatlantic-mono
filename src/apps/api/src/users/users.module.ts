import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './users.model';
import { GcpLoggerService } from '@core/telemetry/gcp/logger.service';
import { GcpTracingService } from '@core/telemetry/gcp/tracer.service';
import { GcpMetricService } from '@core/telemetry/gcp/metric.service';
import { GcpErrorReportingService } from '@core/telemetry/gcp/error-reporter.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    { provide: 'ILoggerService', useClass: GcpLoggerService },
    { provide: 'ITracingService', useClass: GcpTracingService },
    { provide: 'IMetricService', useClass: GcpMetricService },
    { provide: 'IErrorReportingService', useClass: GcpErrorReportingService },
  ],
  exports: [UsersService],
})
export class UsersModule {}
