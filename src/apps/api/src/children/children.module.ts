import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Child, GrowthRecord, CompletedMilestone, CompletedVaccination, Allergy, MedicalCondition } from './children.model';
import { User } from '../users/users.model';
import { GcpLoggerService } from '@core/telemetry/gcp/logger.service';
import { GcpTracingService } from '@core/telemetry/gcp/tracer.service';
import { GcpMetricService } from '@core/telemetry/gcp/metric.service';
import { GcpErrorReportingService } from '@core/telemetry/gcp/error-reporter.service';
import { ChildrenService } from './children.service';
import { ChildrenController } from './children.controller';

@Module({
  imports: [TypeOrmModule.forFeature([
    Child, 
    GrowthRecord, 
    CompletedMilestone, 
    CompletedVaccination,
    Allergy,
    MedicalCondition,
    User
  ])],
  controllers: [ChildrenController],
  providers: [
    ChildrenService,
    { provide: 'ILoggerService', useClass: GcpLoggerService },
    { provide: 'ITracingService', useClass: GcpTracingService },
    { provide: 'IMetricService', useClass: GcpMetricService },
    { provide: 'IErrorReportingService', useClass: GcpErrorReportingService },
  ],
  exports: [ChildrenService],
})
export class ChildrenModule {}
