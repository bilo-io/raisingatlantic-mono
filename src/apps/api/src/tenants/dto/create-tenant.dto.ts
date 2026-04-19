import { IsString, IsEmail, IsUrl, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ResourceStatus } from '../../common/enums';

export class CreateTenantDto {
  @ApiProperty({ example: 'Main Hospital Group' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'https://mainhospital.com', required: false })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({ example: 'info@mainhospital.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+27112223333' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'https://mainhospital.com/logo.png', required: false })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiProperty({ enum: ResourceStatus, example: ResourceStatus.ACTIVE, required: false })
  @IsOptional()
  @IsEnum(ResourceStatus)
  status?: ResourceStatus;
}
