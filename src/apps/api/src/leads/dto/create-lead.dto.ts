import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLeadDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John Doe', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'General Inquiry', required: false })
  @IsString()
  @IsOptional()
  subject?: string;

  @ApiProperty({ example: 'I would like to learn more about your services.' })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  message: string;
}
