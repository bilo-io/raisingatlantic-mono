import { IsEnum, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class CreateAllergyDto {
  @IsString()
  @IsNotEmpty()
  allergen: string;

  @IsEnum(['mild', 'moderate', 'severe'])
  @IsOptional()
  severity?: 'mild' | 'moderate' | 'severe';

  @IsString()
  @IsOptional()
  notes?: string;
}
