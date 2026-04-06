import { IsString, IsEmail, IsEnum, IsOptional, IsUrl } from 'class-validator';
import { UserRole } from '../constants';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsEnum(UserRole)
  role: UserRole;
}
