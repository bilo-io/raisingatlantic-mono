import { IsEnum, IsOptional, IsString, IsUUID, IsDateString } from 'class-validator';
import { AppointmentStatus } from '../appointments.model';

export class CreateAppointmentDto {
  @IsString()
  childId: string;

  @IsOptional()
  @IsString()
  clinicianId?: string;

  @IsOptional()
  @IsString()
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
