import { IsString, IsEmail, IsEnum, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../constants';

export class CreateUserDto {
  @ApiProperty({ example: 'Dr.', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+27123456789' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'https://example.com/image.jpg', required: false })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiProperty({ enum: UserRole, example: UserRole.CLINICIAN })
  @IsEnum(UserRole)
  role: UserRole;
}
