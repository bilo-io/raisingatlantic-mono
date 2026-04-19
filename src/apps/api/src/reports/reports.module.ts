import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { Report } from './reports.model';
import { Child } from '../children/children.model';
import { User } from '../users/users.model';

@Module({
  imports: [TypeOrmModule.forFeature([Report, Child, User])],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
