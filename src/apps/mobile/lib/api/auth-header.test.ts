import { getAuthHeaders, setAuthBridge } from './auth-header';

describe('auth-header bridge', () => {
  afterEach(() => {
    setAuthBridge(null);
  });

  it('returns empty headers when no user is set', () => {
    setAuthBridge(null);
    expect(getAuthHeaders()).toEqual({});
  });

  it('attaches X-User-Id and X-User-Role for an authenticated user', () => {
    setAuthBridge({
      id: 'parent-jane-doe',
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      role: 'parent',
    });
    expect(getAuthHeaders()).toEqual({
      'X-User-Id': 'parent-jane-doe',
      'X-User-Role': 'parent',
    });
  });

  it('clears headers after signOut (setAuthBridge(null))', () => {
    setAuthBridge({
      id: 'x',
      name: 'x',
      email: 'x',
      role: 'admin',
    });
    setAuthBridge(null);
    expect(getAuthHeaders()).toEqual({});
  });
});
