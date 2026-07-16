import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

// Name of the httpOnly cookie carrying the access token. Shared with the auth
// controller (which sets/clears it) so there is one source of truth.
export const ACCESS_TOKEN_COOKIE = 'ra_access_token';

// `scope` marks limited-purpose tokens (MFA login flow) that must never be
// accepted as a full session — JwtVerifiedGuard rejects any scoped token.
export type AuthTokenScope = 'mfa' | 'mfa_setup';

export interface AuthTokenPayload {
  sub: string;
  email: string;
  role: string;
  scope?: AuthTokenScope;
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
 * Dev-only escape hatch for the mobile app's unsigned (`alg:none`) fixture JWT
 * (see src/apps/mobile/lib/api/fixture-jwt.ts). Returns a payload ONLY when
 * `NODE_ENV !== 'production'` AND `ALLOW_FIXTURE_AUTH === 'true'` AND the token is
 * a well-formed, unexpired `alg:none` JWT. Returns null otherwise so real tokens
 * fall through to signature verification. Double-gated so it can never activate
 * in production.
 */
export function decodeFixtureToken(
  token: string,
  config: ConfigService,
): AuthTokenPayload | null {
  if (config.get<string>('NODE_ENV') === 'production') return null;
  if (config.get<string>('ALLOW_FIXTURE_AUTH') !== 'true') return null;

  const parts = token.split('.');
  // A fixture token is unsigned: three segments with an empty signature.
  if (parts.length !== 3 || parts[2] !== '') return null;

  try {
    const header = JSON.parse(
      Buffer.from(parts[0], 'base64url').toString('utf8'),
    ) as { alg?: string };
    if (header.alg !== 'none') return null;

    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64url').toString('utf8'),
    ) as { sub?: string; email?: string; role?: string; exp?: number };
    if (!payload.sub || !payload.role) return null;
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;

    return { sub: payload.sub, email: payload.email ?? '', role: payload.role };
  } catch {
    return null;
  }
}

/**
 * Resolve a token to an auth payload: the dev fixture path first (a no-op unless
 * explicitly enabled in a non-prod env), else real HS256 signature verification.
 * Returns null when neither yields a valid payload.
 */
export async function resolveToken(
  token: string,
  jwtService: JwtService,
  config: ConfigService,
): Promise<AuthTokenPayload | null> {
  const fixture = decodeFixtureToken(token, config);
  if (fixture) return fixture;
  try {
    return await jwtService.verifyAsync<AuthTokenPayload>(token, {
      secret: config.get<string>('JWT_SECRET'),
    });
  } catch {
    return null;
  }
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
      const payload = await resolveToken(
        token,
        this.jwtService,
        this.configService,
      );
      // Scoped (MFA-flow) tokens are not sessions — never attach them here.
      if (payload && !payload.scope) request.user = payload;
    }
    return true;
  }
}
