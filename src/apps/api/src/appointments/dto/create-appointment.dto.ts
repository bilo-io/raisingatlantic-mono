import { IsEnum, IsOptional, IsString, IsUUID, IsDateString } from 'class-validator';
import { AppointmentStatus } from '../appointments.model';

export class CreateAppointmentDto {
  @IsUUID()
  childId: string;

  @IsOptional()
  @IsUUID()
  clinicianId?: string;

  @IsOptional()
  @IsUUID()
  practiceId?: string;

  @IsDateString()
  scheduledAt: string;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateAppointmentDto {
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
