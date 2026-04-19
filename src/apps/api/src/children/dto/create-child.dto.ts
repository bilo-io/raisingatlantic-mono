import { IsString, IsDateString, IsEnum, IsInt, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ResourceStatus } from '../../common/enums';

export class CreateChildDto {
  @ApiProperty({ example: 'eb8c8f5d-d922-4a0b-9c8a-788b77098e9b' })
  @IsString()
  parentId: string;

  @ApiProperty({ example: 'eb8c8f5d-d922-4a0b-9c8a-788b77098e9b', required: false })
  @IsOptional()
  @IsString()
  clinicianId?: string;

  @ApiProperty({ example: 'Junior Doe' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Junior' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ enum: ['male', 'female'], example: 'male' })
  @IsEnum(['male', 'female'])
  gender: 'male' | 'female';

  @ApiProperty({ example: '2020-01-01' })
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty({ example: 'https://example.com/child.jpg', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ enum: ResourceStatus, example: ResourceStatus.ACTIVE, required: false })
  @IsOptional()
  @IsEnum(ResourceStatus)
  status?: ResourceStatus;

  @ApiProperty({ example: 'Healthy child', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: 50, required: false })
  @IsOptional()
  @IsInt()
  progress?: number;
}
