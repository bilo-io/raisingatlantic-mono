import { Module } from '@nestjs/common';
import { FeatureRequestsController } from './feature-requests.controller';
import { FeatureRequestsService } from './feature-requests.service';
import { GcpLoggerService } from '@core/telemetry/gcp/logger.service';
import { GcpMetricService } from '@core/telemetry/gcp/metric.service';

@Module({
  // GoogleSheetsService comes from the @Global() GoogleSheetsModule.
  controllers: [FeatureRequestsController],
  providers: [
    FeatureRequestsService,
    { provide: 'ILoggerService', useClass: GcpLoggerService },
    { provide: 'IMetricService', useClass: GcpMetricService },
  ],
})
export class FeatureRequestsModule {}
