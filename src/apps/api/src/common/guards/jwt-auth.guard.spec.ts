import { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  ACCESS_TOKEN_COOKIE,
  JwtAuthGuard,
  type AuthTokenPayload,
} from './jwt-auth.guard';

const SECRET = 'test-secret';

const buildContext = (req: Record<string, unknown>): ExecutionContext =>
  ({
    switchToHttp: () => ({ getRequest: () => req, getResponse: () => ({}) }),
    getHandler: () => undefined,
    getClass: () => undefined,
  }) as unknown as ExecutionContext;

describe('JwtAuthGuard (best-effort)', () => {
  const jwtService = new JwtService({ secret: SECRET });
  const configService = {
    get: (key: string) => (key === 'JWT_SECRET' ? SECRET : undefined),
  } as unknown as ConfigService;
  const guard = new JwtAuthGuard(jwtService, configService);

  const payload: AuthTokenPayload = {
    sub: 'user-1',
    email: 'user@example.com',
    role: 'parent',
  };

  it('attaches the user when a valid cookie token is present', async () => {
    const req: Record<string, unknown> = {
      cookies: { [ACCESS_TOKEN_COOKIE]: jwtService.sign(payload) },
    };
    await expect(guard.canActivate(buildContext(req))).resolves.toBe(true);
    expect((req as { user?: AuthTokenPayload }).user?.sub).toBe('user-1');
  });

  it('allows the request through with no user when no token is present', async () => {
    const req: Record<string, unknown> = { headers: {} };
    await expect(guard.canActivate(buildContext(req))).resolves.toBe(true);
    expect((req as { user?: AuthTokenPayload }).user).toBeUndefined();
  });

  it('ignores an invalid token instead of blocking', async () => {
    const req: Record<string, unknown> = {
      cookies: { [ACCESS_TOKEN_COOKIE]: 'not-a-real-jwt' },
    };
    await expect(guard.canActivate(buildContext(req))).resolves.toBe(true);
    expect((req as { user?: AuthTokenPayload }).user).toBeUndefined();
  });
});
