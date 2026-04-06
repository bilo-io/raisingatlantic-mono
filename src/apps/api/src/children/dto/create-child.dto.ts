import { IsString, IsDateString, IsEnum, IsInt, IsOptional, IsUUID } from 'class-validator';
import { ResourceStatus } from '../../common/enums';

export class CreateChildDto {
  @IsUUID()
  parentId: string;

  @IsOptional()
  @IsUUID()
  clinicianId?: string;

  @IsString()
  name: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEnum(['male', 'female'])
  gender: 'male' | 'female';

  @IsDateString()
  dateOfBirth: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsEnum(ResourceStatus)
  status?: ResourceStatus;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsInt()
  progress?: number;
}
