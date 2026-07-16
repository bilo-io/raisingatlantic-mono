import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ACCESS_TOKEN_COOKIE, type AuthTokenPayload } from './jwt-auth.guard';
import { JwtVerifiedGuard } from './jwt-verified.guard';

const SECRET = 'test-secret';

const buildContext = (req: Record<string, unknown>): ExecutionContext =>
  ({
    switchToHttp: () => ({ getRequest: () => req, getResponse: () => ({}) }),
    getHandler: () => undefined,
    getClass: () => undefined,
  }) as unknown as ExecutionContext;

describe('JwtVerifiedGuard (strict)', () => {
  const jwtService = new JwtService({ secret: SECRET });
  const configService = {
    get: (key: string) => (key === 'JWT_SECRET' ? SECRET : undefined),
  } as unknown as ConfigService;
  const guard = new JwtVerifiedGuard(jwtService, configService);

  const payload: AuthTokenPayload = {
    sub: 'user-1',
    email: 'user@example.com',
    role: 'parent',
  };

  it('accepts a valid token and attaches the user', async () => {
    const req: Record<string, unknown> = {
      cookies: { [ACCESS_TOKEN_COOKIE]: jwtService.sign(payload) },
    };
    await expect(guard.canActivate(buildContext(req))).resolves.toBe(true);
    expect((req as { user?: AuthTokenPayload }).user?.sub).toBe('user-1');
  });

  it('accepts a valid Bearer token from the Authorization header', async () => {
    const req = {
      headers: { authorization: `Bearer ${jwtService.sign(payload)}` },
    };
    await expect(guard.canActivate(buildContext(req))).resolves.toBe(true);
  });

  it('rejects when no token is present', async () => {
    await expect(
      guard.canActivate(buildContext({ headers: {} })),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects a forged token', async () => {
    const req = { cookies: { [ACCESS_TOKEN_COOKIE]: 'not-a-real-jwt' } };
    await expect(guard.canActivate(buildContext(req))).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it.each(['mfa', 'mfa_setup'] as const)(
    'rejects a %s-scoped token — scoped tokens are not sessions',
    async (scope) => {
      const req = {
        headers: {
          authorization: `Bearer ${jwtService.sign({ ...payload, scope })}`,
        },
      };
      await expect(
        guard.canActivate(buildContext(req)),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    },
  );
});
