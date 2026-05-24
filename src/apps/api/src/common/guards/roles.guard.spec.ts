import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../../users/constants';

const buildContext = (user?: any): ExecutionContext =>
  ({
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
    getHandler: () => undefined,
    getClass: () => undefined,
  }) as any;

describe('RolesGuard', () => {
  let reflector: Reflector;
  let guard: RolesGuard;
  let warn: jest.SpyInstance;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
    warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warn.mockRestore();
  });

  it('allows access when no @Roles() metadata is set', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    expect(guard.canActivate(buildContext({ role: UserRole.PARENT }))).toBe(true);
  });

  it('falls back to allow when roles are required but no user is on the request (dev fallback)', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMIN]);
    expect(guard.canActivate(buildContext(undefined))).toBe(true);
    expect(warn).toHaveBeenCalled();
  });

  it('allows when the user has at least one of the required roles', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMIN, UserRole.SUPER_ADMIN]);
    expect(guard.canActivate(buildContext({ role: [UserRole.ADMIN] }))).toBe(true);
  });

  it('denies when the user does not have any required role', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.SUPER_ADMIN]);
    expect(guard.canActivate(buildContext({ role: [UserRole.PARENT] }))).toBe(false);
  });

  it('reads metadata from both handler and class via reflector', () => {
    const spy = jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.PARENT]);
    guard.canActivate(buildContext({ role: [UserRole.PARENT] }));
    expect(spy).toHaveBeenCalledWith(ROLES_KEY, expect.any(Array));
    expect(spy.mock.calls[0][1]).toHaveLength(2); // [handler, class]
  });
});
