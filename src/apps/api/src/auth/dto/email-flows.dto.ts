import { IsEmail, IsString, Length, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestEmailVerificationDto {
  @ApiProperty({ example: 'parent@example.com' })
  @IsEmail()
  email: string;
}

export class VerifyEmailDto {
  @ApiProperty({ description: 'Raw token from the verification email link' })
  @IsString()
  @Length(64, 64)
  token: string;
}

export class RequestPasswordResetDto {
  @ApiProperty({ example: 'parent@example.com' })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ description: 'Raw token from the reset email link' })
  @IsString()
  @Length(64, 64)
  token: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  newPassword: string;
}

export class MfaCodeDto {
  @ApiProperty({ example: '123456', description: '6-digit TOTP code' })
  @IsString()
  @Matches(/^\d{6}$/)
  code: string;
}

export class MfaChallengeDto extends MfaCodeDto {
  @ApiProperty({ description: 'Scoped mfaToken returned by login' })
  @IsString()
  mfaToken: string;
}
