import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ACCESS_TOKEN_COOKIE } from '../common/guards/jwt-auth.guard';

describe('AuthController', () => {
  const user = {
    id: 'u1',
    email: 'a@b.com',
    role: 'parent',
    name: 'A',
  } as never;
  const authService = {
    register: jest.fn().mockResolvedValue({ user, token: 'tok' }),
    login: jest.fn().mockResolvedValue({ user, token: 'tok' }),
    loginWithGoogle: jest.fn().mockResolvedValue({ user, token: 'tok' }),
    logout: jest.fn().mockResolvedValue(undefined),
    getMe: jest.fn().mockResolvedValue(user),
    requestEmailVerification: jest.fn().mockResolvedValue(undefined),
    verifyEmail: jest.fn().mockResolvedValue(undefined),
    requestPasswordReset: jest.fn().mockResolvedValue(undefined),
    resetPassword: jest.fn().mockResolvedValue(undefined),
    setupMfa: jest.fn().mockResolvedValue({ secret: 's', otpauthUrl: 'u' }),
    enableMfa: jest.fn().mockResolvedValue(user),
    verifyMfaChallenge: jest.fn().mockResolvedValue({ user, token: 'tok' }),
    sessionFor: jest.fn().mockReturnValue({ user, token: 'tok' }),
  } as unknown as AuthService;
  const config = {
    get: () => 'development',
  } as unknown as ConfigService;
  const controller = new AuthController(authService, config);

  const mockRes = () => ({ cookie: jest.fn(), clearCookie: jest.fn() });
  const req = { ip: '127.0.0.1' } as never;

  it('register sets an httpOnly auth cookie and returns user + token', async () => {
    const res = mockRes();
    const out = await controller.register({} as never, req, res as never);
    expect(res.cookie).toHaveBeenCalledWith(
      ACCESS_TOKEN_COOKIE,
      'tok',
      expect.objectContaining({ httpOnly: true, sameSite: 'lax' }),
    );
    // Token also travels in the body for Bearer clients (mobile).
    expect(out).toEqual({ user, token: 'tok' });
  });

  it('login sets the auth cookie', async () => {
    const res = mockRes();
    await controller.login({} as never, req, res as never);
    expect(res.cookie).toHaveBeenCalledWith(
      ACCESS_TOKEN_COOKIE,
      'tok',
      expect.any(Object),
    );
  });

  it('google sets the auth cookie', async () => {
    const res = mockRes();
    await controller.google({} as never, req, res as never);
    expect(res.cookie).toHaveBeenCalledWith(
      ACCESS_TOKEN_COOKIE,
      'tok',
      expect.any(Object),
    );
  });

  it('logout clears the auth cookie', async () => {
    const res = mockRes();
    await controller.logout(
      { ip: 'x', user: { sub: 'u1' } } as never,
      res as never,
    );
    expect(res.clearCookie).toHaveBeenCalledWith(
      ACCESS_TOKEN_COOKIE,
      expect.any(Object),
    );
  });

  it('me returns the current user', async () => {
    const out = await controller.me({ user: { sub: 'u1' } } as never);
    expect(out).toEqual({ user });
  });

  it('login returning an MFA challenge sets no cookie and passes it through', async () => {
    (authService.login as jest.Mock).mockResolvedValueOnce({
      mfaRequired: true,
      mfaToken: 'scoped',
    });
    const res = mockRes();
    const out = await controller.login({} as never, req, res as never);
    expect(res.cookie).not.toHaveBeenCalled();
    expect(out).toEqual({ mfaRequired: true, mfaToken: 'scoped' });
  });

  it('mfa/verify issues the session cookie + token', async () => {
    const res = mockRes();
    const out = await controller.verifyMfa(
      { mfaToken: 'scoped', code: '123456' },
      req,
      res as never,
    );
    expect(res.cookie).toHaveBeenCalledWith(
      ACCESS_TOKEN_COOKIE,
      'tok',
      expect.any(Object),
    );
    expect(out).toEqual({ user, token: 'tok' });
  });

  it('mfa/enable completes sign-in for mfa_setup-scoped callers only', async () => {
    const res = mockRes();
    const scoped = await controller.enableMfa(
      { code: '123456' },
      { ip: 'x', user: { sub: 'u1', scope: 'mfa_setup' } } as never,
      res as never,
    );
    expect(scoped).toEqual({ user, token: 'tok' });
    expect(res.cookie).toHaveBeenCalled();

    const res2 = mockRes();
    const optIn = await controller.enableMfa(
      { code: '123456' },
      { ip: 'x', user: { sub: 'u1' } } as never,
      res2 as never,
    );
    expect(optIn).toEqual({ success: true });
    expect(res2.cookie).not.toHaveBeenCalled();
  });
});
