import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompletedMilestoneDto {
  @ApiProperty({ example: 'locomotor.sits-unsupported' })
  @IsString()
  @IsNotEmpty()
  milestoneId: string;

  @ApiProperty({ example: '2024-11-26' })
  @IsDateString()
  dateAchieved: string;

  @ApiProperty({ example: 'Observed in clinic', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({
    enum: ['CLINICIAN', 'PARENT'],
    required: false,
  })
  @IsEnum(['CLINICIAN', 'PARENT'])
  @IsOptional()
  source?: 'CLINICIAN' | 'PARENT';
}
