import {
  IsString,
  IsOptional,
  IsEnum,
  IsUUID,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ResourceStatus } from '../../common/enums';

export class CreatePracticeDto {
  @ApiProperty({ example: 'eb8c8f5d-d922-4a0b-9c8a-788b77098e9b' })
  @IsUUID()
  tenantId: string;

  @ApiProperty({ example: 'City Clinic' })
  @IsString()
  name: string;

  @ApiProperty({ example: '123 Main St' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'Johannesburg' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'Gauteng' })
  @IsString()
  state: string;

  @ApiProperty({ example: '2000' })
  @IsString()
  zip: string;

  @ApiProperty({ example: '+27113334444' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'clinic@example.com', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ example: 'https://clinic.com', required: false })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({ example: -26.2041, required: false })
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @ApiProperty({ example: 28.0473, required: false })
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @ApiProperty({
    enum: ResourceStatus,
    example: ResourceStatus.ACTIVE,
    required: false,
  })
  @IsOptional()
  @IsEnum(ResourceStatus)
  status?: ResourceStatus;

  @ApiProperty({ example: 'Jane Smith', required: false })
  @IsOptional()
  @IsString()
  manager?: string;
}
