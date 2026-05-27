import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompletedVaccinationDto {
  @ApiProperty({ example: 'hexaxim3' })
  @IsString()
  @IsNotEmpty()
  vaccineId: string;

  @ApiProperty({ example: '2024-11-26' })
  @IsDateString()
  dateAdministered: string;

  @ApiProperty({ example: 'HEX-2209', required: false })
  @IsString()
  @IsOptional()
  batchNumber?: string;

  @ApiProperty({ example: '2025-08-01', required: false })
  @IsDateString()
  @IsOptional()
  expiryDate?: string;

  @ApiProperty({ example: 'Sanofi', required: false })
  @IsString()
  @IsOptional()
  manufacturer?: string;

  @ApiProperty({ example: 'Sr Jacobs · ACP', required: false })
  @IsString()
  @IsOptional()
  administeredByName?: string;

  @ApiProperty({ example: 'Atlantic Family Practice', required: false })
  @IsString()
  @IsOptional()
  clinicName?: string;

  @ApiProperty({
    enum: ['CLINICIAN', 'PARENT'],
    default: 'CLINICIAN',
    required: false,
  })
  @IsEnum(['CLINICIAN', 'PARENT'])
  @IsOptional()
  source?: 'CLINICIAN' | 'PARENT';
}
