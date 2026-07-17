import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../users/constants';

// Admin roles are provisioned internally, never self-registered — accepting a
// client-supplied admin role here would be a privilege-escalation hole.
export const SELF_REGISTER_ROLES = [
  UserRole.PARENT,
  UserRole.CLINICIAN,
] as const;

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

  @ApiProperty({ enum: SELF_REGISTER_ROLES, example: UserRole.PARENT })
  @IsIn(SELF_REGISTER_ROLES, {
    message: 'role must be parent or clinician',
  })
  role: (typeof SELF_REGISTER_ROLES)[number];
}
