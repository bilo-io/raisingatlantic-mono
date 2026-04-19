import { IsEnum, IsOptional, IsString, IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AppointmentStatus } from '../appointments.model';

export class CreateAppointmentDto {
  @ApiProperty({ example: 'child-alex-doe' })
  @IsString()
  @IsNotEmpty()
  childId: string;

  @ApiProperty({ example: 'clinician-dr-smith', required: false })
  @IsOptional()
  @IsString()
  clinicianId?: string;

  @ApiProperty({ example: 'practice-uuid', required: false })
  @IsOptional()
  @IsString()
  practiceId?: string;

  @ApiProperty({ example: '2024-05-20T10:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  scheduledAt: string;

  @ApiProperty({ enum: AppointmentStatus, example: AppointmentStatus.SCHEDULED, required: false })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @ApiProperty({ example: 'Follow-up appointment', required: false })
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
