import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../users/constants';

export class RegisterDto {
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

  @ApiProperty({ example: 'a-strong-passphrase', minLength: 8 })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;

  @ApiProperty({ enum: UserRole, example: UserRole.PARENT })
  @IsEnum(UserRole)
  role: UserRole;
}
