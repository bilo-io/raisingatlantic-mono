import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetricsService } from './metrics.service';
import { MetricsController } from './metrics.controller';
import { Child } from '../children/children.model';
import { GcpMetricService } from '@core/telemetry/gcp/metric.service';

@Module({
  imports: [TypeOrmModule.forFeature([Child])],
  controllers: [MetricsController],
  providers: [
    MetricsService,
    { provide: 'IMetricService', useClass: GcpMetricService },
  ],
})
export class MetricsModule {}
