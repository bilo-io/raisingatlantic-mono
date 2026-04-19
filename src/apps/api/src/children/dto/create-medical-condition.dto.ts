import { IsOptional, IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateMedicalConditionDto {
  @IsString()
  @IsNotEmpty()
  conditionName: string;

  @IsDateString()
  @IsOptional()
  diagnosisDate?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
