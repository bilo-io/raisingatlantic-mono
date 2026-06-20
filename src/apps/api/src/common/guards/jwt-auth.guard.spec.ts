import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserRole } from '../../users/constants';

const base64url = (value: object): string =>
  Buffer.from(JSON.stringify(value))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

// Mirrors the mobile dev signer (src/apps/mobile/lib/api/fixture-jwt.ts).
const makeFixtureToken = (claims: object): string =>
  `${base64url({ alg: 'none', typ: 'JWT' })}.${base64url(claims)}.`;

const nowSeconds = () => Math.floor(Date.now() / 1000);

interface MockRequest {
  headers: Record<string, string>;
  user?: unknown;
}

const buildContext = (
  headers: Record<string, string> = {},
): { context: ExecutionContext; request: MockRequest } => {
  const request: MockRequest = { headers };
  const context = {
    switchToHttp: () => ({
      getRequest: () => request,
      getResponse: () => ({}),
    }),
    getHandler: () => undefined,
    getClass: () => undefined,
  } as unknown as ExecutionContext;
  return { context, request };
};

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    guard = new JwtAuthGuard();
    process.env.NODE_ENV = 'development';
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('attaches the user from a dev fixture token and allows the request', () => {
    const token = makeFixtureToken({
      sub: '00000000-0000-4000-8000-000000000002',
      role: UserRole.CLINICIAN,
      tenantId: '00000000-0000-4000-8000-00000000aaaa',
      practiceIds: ['00000000-0000-4000-8000-00000000bbbb'],
      iat: nowSeconds(),
      exp: nowSeconds() + 3600,
    });
    const { context, request } = buildContext({
      authorization: `Bearer ${token}`,
    });

    expect(guard.canActivate(context)).toBe(true);
    expect(request.user).toEqual({
      id: '00000000-0000-4000-8000-000000000002',
      sub: '00000000-0000-4000-8000-000000000002',
      role: UserRole.CLINICIAN,
      tenantId: '00000000-0000-4000-8000-00000000aaaa',
      practiceIds: ['00000000-0000-4000-8000-00000000bbbb'],
    });
  });

  it('allows the request and attaches no user when no token is present', () => {
    const { context, request } = buildContext();
    expect(guard.canActivate(context)).toBe(true);
    expect(request.user).toBeUndefined();
  });

  it('rejects an unsigned fixture token in production', () => {
    process.env.NODE_ENV = 'production';
    const token = makeFixtureToken({
      sub: 'x',
      role: UserRole.PARENT,
      exp: nowSeconds() + 3600,
    });
    const { context } = buildContext({ authorization: `Bearer ${token}` });
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('rejects an expired fixture token in dev', () => {
    const token = makeFixtureToken({
      sub: 'x',
      role: UserRole.PARENT,
      iat: nowSeconds() - 7200,
      exp: nowSeconds() - 3600,
    });
    const { context } = buildContext({ authorization: `Bearer ${token}` });
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('ignores a signed (non-fixture) token and falls through without a user', () => {
    // A real HS256-style token (non-empty signature, alg !== "none") is left
    // for real verification (M4.4); the placeholder must not attach a user.
    const signed = `${base64url({ alg: 'HS256', typ: 'JWT' })}.${base64url({
      sub: 'x',
      role: UserRole.PARENT,
    })}.c2lnbmF0dXJl`;
    const { context, request } = buildContext({
      authorization: `Bearer ${signed}`,
    });
    expect(guard.canActivate(context)).toBe(true);
    expect(request.user).toBeUndefined();
  });

  it('ignores a malformed authorization header', () => {
    const { context, request } = buildContext({ authorization: 'Basic abc' });
    expect(guard.canActivate(context)).toBe(true);
    expect(request.user).toBeUndefined();
  });
});
