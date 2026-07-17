import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
import type { CookieOptions, Request, Response } from 'express';
import { AuthService, isMfaChallenge } from './auth.service';
import type { AuthResult, LoginResult } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import {
  MfaChallengeDto,
  MfaCodeDto,
  RequestEmailVerificationDto,
  RequestPasswordResetDto,
  ResetPasswordDto,
  VerifyEmailDto,
} from './dto/email-flows.dto';
import {
  ACCESS_TOKEN_COOKIE,
  type RequestWithAuth,
} from '../common/guards/jwt-auth.guard';
import { JwtVerifiedGuard } from '../common/guards/jwt-verified.guard';
import { JwtMfaFlowGuard } from '../common/guards/jwt-mfa-flow.guard';

// Keep the cookie lifetime roughly in step with JWT_ACCESS_TOKEN_EXPIRY (15m).
const ACCESS_TOKEN_MAX_AGE_MS = 15 * 60 * 1000;

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(dto, req.ip);
    return this.loginResponse(res, result);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { limit: 5, ttl: 60_000 } })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto, req.ip);
    return this.loginResponse(res, result);
  }

  @Post('google')
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { limit: 5, ttl: 60_000 } })
  async google(
    @Body() dto: GoogleLoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.loginWithGoogle(dto, req.ip);
    return this.loginResponse(res, result);
  }

  @Post('verify-email/request')
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { limit: 5, ttl: 60_000 } })
  async requestEmailVerification(
    @Body() dto: RequestEmailVerificationDto,
    @Req() req: Request,
  ) {
    // Deliberately not awaited: a uniform, immediate response leaks no timing
    // signal about whether the address is registered.
    void this.authService
      .requestEmailVerification(dto.email, req.ip)
      .catch(() => undefined);
    return { success: true };
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { limit: 5, ttl: 60_000 } })
  async verifyEmail(@Body() dto: VerifyEmailDto, @Req() req: Request) {
    await this.authService.verifyEmail(dto.token, req.ip);
    return { success: true };
  }

  @Post('password-reset/request')
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { limit: 5, ttl: 60_000 } })
  async requestPasswordReset(
    @Body() dto: RequestPasswordResetDto,
    @Req() req: Request,
  ) {
    void this.authService
      .requestPasswordReset(dto.email, req.ip)
      .catch(() => undefined);
    return { success: true };
  }

  @Post('password-reset')
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { limit: 5, ttl: 60_000 } })
  async resetPassword(@Body() dto: ResetPasswordDto, @Req() req: Request) {
    await this.authService.resetPassword(dto.token, dto.newPassword, req.ip);
    return { success: true };
  }

  @Post('mfa/setup')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtMfaFlowGuard)
  async setupMfa(@Req() req: RequestWithAuth) {
    return this.authService.setupMfa(req.user!.sub);
  }

  @Post('mfa/enable')
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { limit: 5, ttl: 60_000 } })
  @UseGuards(JwtMfaFlowGuard)
  async enableMfa(
    @Body() dto: MfaCodeDto,
    @Req() req: RequestWithAuth,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.enableMfa(
      req.user!.sub,
      dto.code,
      req.ip,
    );
    // An mfa_setup-scoped caller has proven password + TOTP — complete their
    // sign-in; a full-session caller (parent opting in) just gets confirmation.
    if (req.user!.scope === 'mfa_setup') {
      return this.sessionResponse(
        res,
        await this.authService.sessionFor(user, req.ip),
      );
    }
    return { success: true };
  }

  @Post('mfa/verify')
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { limit: 5, ttl: 60_000 } })
  async verifyMfa(
    @Body() dto: MfaChallengeDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.verifyMfaChallenge(
      dto.mfaToken,
      dto.code,
      req.ip,
    );
    return this.sessionResponse(res, result);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: RequestWithAuth,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(req.user?.sub, req.ip);
    this.clearAuthCookie(res);
    return { success: true };
  }

  @Get('me')
  @UseGuards(JwtVerifiedGuard)
  async me(@Req() req: RequestWithAuth) {
    const user = await this.authService.getMe(req.user!.sub);
    return { user };
  }

  // Session responses carry the JWT both as the httpOnly cookie (web) and in
  // the body (mobile / Bearer clients, which cannot read the cookie).
  private sessionResponse(res: Response, result: AuthResult) {
    this.setAuthCookie(res, result.token);
    return { user: result.user, token: result.token };
  }

  private loginResponse(res: Response, result: LoginResult) {
    if (isMfaChallenge(result)) {
      return result;
    }
    return this.sessionResponse(res, result);
  }

  private cookieOptions(): CookieOptions {
    const isProd = this.configService.get<string>('NODE_ENV') === 'production';
    return {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
    };
  }

  private setAuthCookie(res: Response, token: string): void {
    res.cookie(ACCESS_TOKEN_COOKIE, token, {
      ...this.cookieOptions(),
      maxAge: ACCESS_TOKEN_MAX_AGE_MS,
    });
  }

  private clearAuthCookie(res: Response): void {
    res.clearCookie(ACCESS_TOKEN_COOKIE, this.cookieOptions());
  }
}
