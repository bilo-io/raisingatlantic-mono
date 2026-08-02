import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGrowthRecordDto {
  @ApiProperty({ example: '2024-11-26' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: '7.8', required: false })
  @IsString()
  @IsOptional()
  weight?: string;

  @ApiProperty({ example: '68', required: false })
  @IsString()
  @IsOptional()
  height?: string;

  @ApiProperty({ example: '43', required: false })
  @IsString()
  @IsOptional()
  headCircumference?: string;

  @ApiProperty({ example: 'Thriving', required: false })
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
