import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrivacyService } from './privacy.service';
import { PrivacyController } from './privacy.controller';
import { User } from '../users/users.model';
import { Child } from '../children/children.model';
import { Appointment } from '../appointments/appointments.model';
import { Report } from '../reports/reports.model';
import { SystemLogsModule } from '../system-logs/system-logs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Child, Appointment, Report]),
    SystemLogsModule,
  ],
  controllers: [PrivacyController],
  providers: [PrivacyService],
})
export class PrivacyModule {}
