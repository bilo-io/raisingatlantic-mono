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
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import {
  ACCESS_TOKEN_COOKIE,
  type AuthTokenPayload,
} from '../common/guards/jwt-auth.guard';
import { JwtVerifiedGuard } from '../common/guards/jwt-verified.guard';

// Keep the cookie lifetime roughly in step with JWT_ACCESS_TOKEN_EXPIRY (15m).
const ACCESS_TOKEN_MAX_AGE_MS = 15 * 60 * 1000;

interface AuthedRequest extends Request {
  user?: AuthTokenPayload;
}

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
    this.setAuthCookie(res, result.token);
    return { user: result.user };
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
    this.setAuthCookie(res, result.token);
    return { user: result.user };
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
    this.setAuthCookie(res, result.token);
    return { user: result.user };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: AuthedRequest, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(req.user?.sub, req.ip);
    this.clearAuthCookie(res);
    return { success: true };
  }

  @Get('me')
  @UseGuards(JwtVerifiedGuard)
  async me(@Req() req: AuthedRequest) {
    const user = await this.authService.getMe(req.user!.sub);
    return { user };
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
