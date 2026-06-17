import {
  Equals,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFeatureRequestDto {
  @ApiProperty({ example: 'Dark mode for the dashboard', maxLength: 80 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  title: string;

  @ApiProperty({
    example:
      'It would be easier on the eyes at night when checking on a sick child.',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  description: string;

  @ApiProperty({
    example: 'jane@example.com',
    required: false,
    description:
      'Optional — only to notify the submitter if the feature ships.',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: true,
    required: false,
    description:
      'Required to be true when an email is supplied (POPIA consent for storing the address).',
  })
  // Consent is only meaningful — and mandatory — when an email is provided.
  // Must be explicitly true in that case (POPIA: no PII stored without consent).
  @ValidateIf((o: CreateFeatureRequestDto) => !!o.email)
  @Equals(true)
  consent?: boolean;
}
