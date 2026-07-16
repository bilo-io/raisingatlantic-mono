// Mock AsyncStorage for all tests that import it transitively.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Phase M4 added expo-notifications / expo-device (via the push-registration
// hook that AuthProvider mounts). Loading the real native modules under
// jest-expo pulls in untransformable RN internals, so stub them out the same
// way AsyncStorage is. `isDevice: false` makes usePushRegistration a no-op in
// tests, which is the correct behaviour off a physical device anyway.
jest.mock('expo-device', () => ({ isDevice: false }));

// M4.4: storage.ts imports expo-secure-store at module scope for the real-auth
// SecureStoreDriver. In-memory stub keeps fixture-mode tests native-free.
jest.mock('expo-secure-store', () => {
  const store = new Map<string, string>();
  return {
    WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'WHEN_UNLOCKED_THIS_DEVICE_ONLY',
    getItemAsync: jest.fn((k: string) => Promise.resolve(store.get(k) ?? null)),
    setItemAsync: jest.fn((k: string, v: string) => {
      store.set(k, v);
      return Promise.resolve();
    }),
    deleteItemAsync: jest.fn((k: string) => {
      store.delete(k);
      return Promise.resolve();
    }),
  };
});
jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  setNotificationChannelAsync: jest.fn().mockResolvedValue(undefined),
  getPermissionsAsync: jest.fn().mockResolvedValue({ status: 'undetermined' }),
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'denied' }),
  getExpoPushTokenAsync: jest
    .fn()
    .mockResolvedValue({ data: 'ExponentPushToken[test]' }),
  addNotificationReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  addNotificationResponseReceivedListener: jest.fn(() => ({
    remove: jest.fn(),
  })),
  AndroidImportance: { DEFAULT: 3, MAX: 5 },
}));
