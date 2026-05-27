import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearUser, loadUser, saveUser } from './storage';

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
