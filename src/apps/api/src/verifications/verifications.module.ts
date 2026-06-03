import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificationsService } from './verifications.service';
import { VerificationsController } from './verifications.controller';
import { User } from '../users/users.model';
import {
  Child,
  GrowthRecord,
  CompletedMilestone,
  CompletedVaccination,
} from '../children/children.model';
import { GcpMetricService } from '@core/telemetry/gcp/metric.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Child,
      GrowthRecord,
      CompletedMilestone,
      CompletedVaccination,
    ]),
  ],
  providers: [
    VerificationsService,
    { provide: 'IMetricService', useClass: GcpMetricService },
  ],
  controllers: [VerificationsController],
  exports: [VerificationsService],
})
export class VerificationsModule {}
