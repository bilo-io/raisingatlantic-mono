import React, { useEffect } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthProvider } from './AuthContext';
import { useAuth } from './useAuth';
import { fixtureUsers } from './fixtures';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext / AuthProvider', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('hydrates with no user when storage is empty', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isHydrating).toBe(false));
    expect(result.current.user).toBeNull();
  });

  it('restores a previously saved user on mount', async () => {
    await AsyncStorage.setItem('@ra/auth', JSON.stringify(fixtureUsers.parent));
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isHydrating).toBe(false));
    expect(result.current.user?.id).toBe(fixtureUsers.parent.id);
    expect(result.current.user?.role).toBe('parent');
  });

  it('signInAs persists the user and updates state', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isHydrating).toBe(false));

    await act(async () => {
      await result.current.signInAs('parent');
    });

    expect(result.current.user?.id).toBe(fixtureUsers.parent.id);
    const stored = await AsyncStorage.getItem('@ra/auth');
    expect(stored).not.toBeNull();
    expect(JSON.parse(stored as string).id).toBe(fixtureUsers.parent.id);
  });

  it('signOut clears the user from state and storage', async () => {
    await AsyncStorage.setItem('@ra/auth', JSON.stringify(fixtureUsers.parent));
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.user?.id).toBe(fixtureUsers.parent.id));

    await act(async () => {
      await result.current.signOut();
    });

    expect(result.current.user).toBeNull();
    expect(await AsyncStorage.getItem('@ra/auth')).toBeNull();
  });
});

describe('useAuth', () => {
  it('throws when used outside an AuthProvider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useAuth())).toThrow(/useAuth must be used within AuthProvider/);
    spy.mockRestore();
  });
});
