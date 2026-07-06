import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { decodeFixtureToken, JwtAuthGuard, type AuthTokenPayload } from './jwt-auth.guard';
import { JwtVerifiedGuard } from './jwt-verified.guard';

// Mirrors the mobile app's unsigned alg:none fixture token (fixture-jwt.ts).
function makeFixtureToken(claims: { sub: string; role: string; email?: string; exp?: number }) {
  const b64 = (obj: unknown) =>
    Buffer.from(JSON.stringify(obj)).toString('base64url');
  const header = { alg: 'none', typ: 'JWT' };
  const iat = Math.floor(Date.now() / 1000);
  const payload = { iat, exp: iat + 3600, ...claims };
  return `${b64(header)}.${b64(payload)}.`;
}

const config = (overrides: Record<string, string | undefined>) =>
  ({ get: (key: string) => overrides[key] }) as unknown as ConfigService;

const buildContext = (req: Record<string, unknown>): ExecutionContext =>
  ({
    switchToHttp: () => ({ getRequest: () => req, getResponse: () => ({}) }),
    getHandler: () => undefined,
    getClass: () => undefined,
  }) as unknown as ExecutionContext;

const enabledDev = { NODE_ENV: 'development', ALLOW_FIXTURE_AUTH: 'true', JWT_SECRET: 's' };

describe('decodeFixtureToken (dev-only fixture auth)', () => {
  const token = makeFixtureToken({ sub: 'u1', role: 'parent' });

  it('decodes a fixture token when enabled in a non-prod env', () => {
    const out = decodeFixtureToken(token, config(enabledDev));
    expect(out).toEqual({ sub: 'u1', email: '', role: 'parent' });
  });

  it('returns null when ALLOW_FIXTURE_AUTH is not set', () => {
    expect(decodeFixtureToken(token, config({ NODE_ENV: 'development' }))).toBeNull();
  });

  it('returns null in production even with the flag on', () => {
    expect(
      decodeFixtureToken(token, config({ NODE_ENV: 'production', ALLOW_FIXTURE_AUTH: 'true' })),
    ).toBeNull();
  });

  it('returns null for an expired fixture token', () => {
    const expired = makeFixtureToken({ sub: 'u1', role: 'parent', exp: 1 });
    expect(decodeFixtureToken(expired, config(enabledDev))).toBeNull();
  });

  it('returns null for a non-fixture (signed) token', () => {
    expect(decodeFixtureToken('a.b.signature', config(enabledDev))).toBeNull();
  });
});

describe('guards honour the fixture token only when enabled', () => {
  const jwtService = new JwtService({ secret: 's' });
  const token = makeFixtureToken({ sub: 'u1', role: 'parent' });

  it('JwtVerifiedGuard accepts a fixture token when enabled', async () => {
    const guard = new JwtVerifiedGuard(jwtService, config(enabledDev));
    const req: Record<string, unknown> = { headers: { authorization: `Bearer ${token}` } };
    await expect(guard.canActivate(buildContext(req))).resolves.toBe(true);
    expect((req as { user?: AuthTokenPayload }).user?.sub).toBe('u1');
  });

  it('JwtVerifiedGuard rejects the fixture token when the flag is off', async () => {
    const guard = new JwtVerifiedGuard(jwtService, config({ NODE_ENV: 'development', JWT_SECRET: 's' }));
    const req = { headers: { authorization: `Bearer ${token}` } };
    await expect(guard.canActivate(buildContext(req))).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('JwtAuthGuard attaches the fixture user when enabled, passes through otherwise', async () => {
    const enabled = new JwtAuthGuard(jwtService, config(enabledDev));
    const reqA: Record<string, unknown> = { headers: { authorization: `Bearer ${token}` } };
    await expect(enabled.canActivate(buildContext(reqA))).resolves.toBe(true);
    expect((reqA as { user?: AuthTokenPayload }).user?.sub).toBe('u1');

    const disabled = new JwtAuthGuard(jwtService, config({ NODE_ENV: 'development', JWT_SECRET: 's' }));
    const reqB: Record<string, unknown> = { headers: { authorization: `Bearer ${token}` } };
    await expect(disabled.canActivate(buildContext(reqB))).resolves.toBe(true);
    expect((reqB as { user?: AuthTokenPayload }).user).toBeUndefined();
  });
});
