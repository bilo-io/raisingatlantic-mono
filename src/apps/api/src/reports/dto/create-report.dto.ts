import { IsEnum, IsOptional, IsString, IsObject, IsUUID } from 'class-validator';
import { ReportType } from '../reports.model';

export class CreateReportDto {
  @IsUUID()
  childId: string;

  @IsEnum(ReportType)
  type: ReportType;

  @IsOptional()
  @IsObject()
  content?: any;

  @IsOptional()
  @IsString()
  pdfUrl?: string;

  @IsOptional()
  @IsUUID()
  generatedById?: string;
}
