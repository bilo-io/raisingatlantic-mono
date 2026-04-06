import { IsString, IsEmail, IsUrl, IsEnum, IsOptional } from 'class-validator';
import { ResourceStatus } from '../../common/enums';

export class CreateTenantDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsEnum(ResourceStatus)
  status?: ResourceStatus;
}
