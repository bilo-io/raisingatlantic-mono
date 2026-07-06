import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  AuthTokenPayload,
  RequestWithAuth,
  extractAccessToken,
} from './jwt-auth.guard';

/**
 * Strict authentication: rejects the request with 401 unless a valid access
 * token is present (httpOnly cookie or Bearer header). Use on endpoints that
 * require an authenticated session, e.g. GET /v1/auth/me.
 */
@Injectable()
export class JwtVerifiedGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithAuth>();
    const token = extractAccessToken(request);
    if (!token) {
      throw new UnauthorizedException('Authentication required');
    }
    try {
      request.user = await this.jwtService.verifyAsync<AuthTokenPayload>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired session');
    }
  }
}
