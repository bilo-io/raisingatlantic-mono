import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { CookieOptions, Request, Response } from 'express';
import { PrivacyService, DsarExport, ErasureResult } from './privacy.service';
import { JwtVerifiedGuard } from '../common/guards/jwt-verified.guard';
import {
  ACCESS_TOKEN_COOKIE,
  type AuthTokenPayload,
} from '../common/guards/jwt-auth.guard';

interface AuthedRequest extends Request {
  user?: AuthTokenPayload;
}

// Every route requires a valid session; the data subject is ALWAYS the caller
// (req.user.sub) — never a URL param — so a subject can only ever export or
// erase their own personal data.
@Controller('privacy')
@UseGuards(JwtVerifiedGuard)
export class PrivacyController {
  constructor(
    private readonly privacyService: PrivacyService,
    private readonly configService: ConfigService,
  ) {}

  @Get('export')
  exportJson(@Req() req: AuthedRequest): Promise<DsarExport> {
    return this.privacyService.exportUserData(req.user!.sub);
  }

  @Get('export/pdf')
  async exportPdf(@Req() req: AuthedRequest): Promise<StreamableFile> {
    const buffer = await this.privacyService.exportUserDataPdf(req.user!.sub);
    return new StreamableFile(buffer, {
      type: 'application/pdf',
      disposition: 'attachment; filename="raising-atlantic-data-export.pdf"',
    });
  }

  @Post('erasure')
  @HttpCode(HttpStatus.OK)
  async erasure(
    @Req() req: AuthedRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ErasureResult> {
    const result = await this.privacyService.requestErasure(req.user!.sub);
    // Account is now soft-deleted — end the session.
    res.clearCookie(ACCESS_TOKEN_COOKIE, this.cookieOptions());
    return result;
  }

  private cookieOptions(): CookieOptions {
    const isProd = this.configService.get<string>('NODE_ENV') === 'production';
    return { httpOnly: true, secure: isProd, sameSite: 'lax', path: '/' };
  }
}
