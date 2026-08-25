import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export type VerificationOutcome = 'APPROVED' | 'REJECTED' | 'MORE_INFO';

export class VerificationDecisionDto {
  @ApiProperty({ enum: ['APPROVED', 'REJECTED', 'MORE_INFO'] })
  @IsEnum(['APPROVED', 'REJECTED', 'MORE_INFO'])
  outcome: VerificationOutcome;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
