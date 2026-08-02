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
  } as unknown as AuthService;
  const config = {
    get: () => 'development',
  } as unknown as ConfigService;
  const controller = new AuthController(authService, config);

  const mockRes = () => ({ cookie: jest.fn(), clearCookie: jest.fn() });
  const req = { ip: '127.0.0.1' } as never;

  it('register sets an httpOnly auth cookie and returns the user', async () => {
    const res = mockRes();
    const out = await controller.register({} as never, req, res as never);
    expect(res.cookie).toHaveBeenCalledWith(
      ACCESS_TOKEN_COOKIE,
      'tok',
      expect.objectContaining({ httpOnly: true, sameSite: 'lax' }),
    );
    expect(out).toEqual({ user });
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
});
