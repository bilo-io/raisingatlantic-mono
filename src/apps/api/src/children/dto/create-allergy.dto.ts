import { IsEnum, IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAllergyDto {
  @ApiProperty({ example: 'Peanuts' })
  @IsString()
  @IsNotEmpty()
  allergen: string;

  @ApiProperty({ enum: ['mild', 'moderate', 'severe'], example: 'mild', required: false })
  @IsEnum(['mild', 'moderate', 'severe'])
  @IsOptional()
  severity?: 'mild' | 'moderate' | 'severe';

  @ApiProperty({ example: 'Avoid all contact', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
