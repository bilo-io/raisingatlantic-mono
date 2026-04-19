import { IsOptional, IsString, IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMedicalConditionDto {
  @ApiProperty({ example: 'Asthma' })
  @IsString()
  @IsNotEmpty()
  conditionName: string;

  @ApiProperty({ example: '2022-01-01', required: false })
  @IsDateString()
  @IsOptional()
  diagnosisDate?: string;

  @ApiProperty({ example: 'Requires inhaler', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
