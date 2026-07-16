import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { SecureStoreDriver, clearUser, loadUser, saveUser } from './storage';

const sampleUser = {
  id: 'parent-jane-doe',
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  role: 'parent' as const,
};

describe('auth/storage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('returns null when no user is stored', async () => {
    await expect(loadUser()).resolves.toBeNull();
  });

  it('saves and loads a user', async () => {
    await saveUser(sampleUser);
    await expect(loadUser()).resolves.toEqual(sampleUser);
  });

  it('clears the stored user', async () => {
    await saveUser(sampleUser);
    await clearUser();
    await expect(loadUser()).resolves.toBeNull();
  });

  it('returns null when the stored value is malformed', async () => {
    await AsyncStorage.setItem('@ra/auth', '{not-json');
    await expect(loadUser()).resolves.toBeNull();
  });
});

describe('SecureStoreDriver', () => {
  it('round-trips values through the keychain', async () => {
    await SecureStoreDriver.setItem('plain-key', 'value');
    await expect(SecureStoreDriver.getItem('plain-key')).resolves.toBe('value');
    await SecureStoreDriver.removeItem('plain-key');
    await expect(SecureStoreDriver.getItem('plain-key')).resolves.toBeNull();
  });

  it('sanitises keys SecureStore cannot store (e.g. "@ra/auth")', async () => {
    await SecureStoreDriver.setItem('@ra/auth', 'session');
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      '_ra_auth',
      'session',
      expect.objectContaining({ keychainAccessible: expect.anything() }),
    );
    await expect(SecureStoreDriver.getItem('@ra/auth')).resolves.toBe('session');
  });
});
