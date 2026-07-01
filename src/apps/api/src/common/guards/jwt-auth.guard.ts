import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

// Name of the httpOnly cookie carrying the access token. Shared with the auth
// controller (which sets/clears it) so there is one source of truth.
export const ACCESS_TOKEN_COOKIE = 'ra_access_token';

export interface AuthTokenPayload {
  sub: string;
  email: string;
  role: string;
}

export interface RequestWithAuth extends Request {
  user?: AuthTokenPayload;
}

// Prefer the httpOnly cookie (browser); fall back to a Bearer header for
// non-browser clients (mobile / API consumers).
export function extractAccessToken(
  request: RequestWithAuth,
): string | undefined {
  const cookies = request.cookies as Record<string, string> | undefined;
  const cookieToken = cookies?.[ACCESS_TOKEN_COOKIE];
  if (cookieToken) return cookieToken;

  const authHeader = request.headers?.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice('Bearer '.length);
  }
  return undefined;
}

/**
 * Best-effort authentication: verifies the token when one is present and
 * attaches `req.user`, but never blocks the request. This is the transitional
 * state for controllers that were previously behind a no-op placeholder guard —
 * it upgrades them from "no verification at all" to "verified when supplied"
 * without changing which requests succeed. Strict per-route enforcement is the
 * tracked Phase 2 follow-up (see docs/GO_LIVE/PHASE_2_TODO.md). For endpoints
 * that must require a session today, use {@link JwtVerifiedGuard}.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithAuth>();
    const token = extractAccessToken(request);
    if (token) {
      try {
        request.user = await this.jwtService.verifyAsync<AuthTokenPayload>(
          token,
          { secret: this.configService.get<string>('JWT_SECRET') },
        );
      } catch {
        // Stale/invalid token: treat as unauthenticated rather than blocking.
      }
    }
    return true;
  }
}
