import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { Appointment } from './appointments.model';
import { Child } from '../children/children.model';
import { User } from '../users/users.model';
import { Practice } from '../practices/practices.model';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, Child, User, Practice])],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
