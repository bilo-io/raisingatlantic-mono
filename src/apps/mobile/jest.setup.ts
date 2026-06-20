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
