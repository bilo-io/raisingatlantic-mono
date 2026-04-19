import { IsEnum, IsOptional, IsString, IsObject, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReportType } from '../reports.model';

export class CreateReportDto {
  @ApiProperty({ example: 'child-alex-doe' })
  @IsString()
  @IsNotEmpty()
  childId: string;

  @ApiProperty({ enum: ReportType, example: ReportType.CLINICAL_SUMMARY })
  @IsEnum(ReportType)
  type: ReportType;

  @ApiProperty({ example: { diagnosis: 'Healthy' } })
  @IsOptional()
  @IsObject()
  content?: any;

  @ApiProperty({ example: 'https://storage.com/report.pdf' })
  @IsOptional()
  @IsString()
  pdfUrl?: string;

  @ApiProperty({ example: 'clinician-dr-smith' })
  @IsOptional()
  @IsString()
  generatedById?: string;
}
