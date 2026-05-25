import { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

const buildContext = (): ExecutionContext =>
  ({
    switchToHttp: () => ({
      getRequest: () => ({}),
      getResponse: () => ({}),
    }),
    getHandler: () => undefined,
    getClass: () => undefined,
  }) as any;

describe('JwtAuthGuard (placeholder)', () => {
  let guard: JwtAuthGuard;

  beforeEach(() => {
    guard = new JwtAuthGuard();
  });

  it('allows access (placeholder implementation pending real JWT verification)', () => {
    // NOTE: This guard currently returns `true` unconditionally. When real
    // JWT verification is wired in (per CLAUDE.md), expand this spec to cover
    // valid / expired / missing-token paths.
    expect(guard.canActivate(buildContext())).toBe(true);
  });
});
