import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export type LeadType = 'contact' | 'waitlist';

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

  @ApiProperty({
    enum: ['contact', 'waitlist'],
    required: false,
    description: 'Origin of the lead. Defaults to "contact".',
  })
  @IsOptional()
  @IsIn(['contact', 'waitlist'])
  type?: LeadType;

  @ApiProperty({
    example: '+27 82 123 4567',
    required: false,
    description: 'Optional WhatsApp/phone number (waitlist signups).',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    example: true,
    required: false,
    description:
      'POPIA consent to store the submitted personal information in our records. ' +
      'PII is only persisted to the Sheets store when this is true.',
  })
  @IsOptional()
  @IsBoolean()
  consent?: boolean;
}
