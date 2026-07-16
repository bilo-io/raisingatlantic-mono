import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { useApi } from "../lib/api/data-source";
import { User } from "./types";

export type StorageDriver = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

export const AsyncStorageDriver: StorageDriver = {
  getItem: (key) => AsyncStorage.getItem(key),
  setItem: (key, value) => AsyncStorage.setItem(key, value),
  removeItem: (key) => AsyncStorage.removeItem(key),
};

// SecureStore keys may only contain [A-Za-z0-9._-].
const secureKey = (key: string) => key.replace(/[^A-Za-z0-9._-]/g, "_");

export const SecureStoreDriver: StorageDriver = {
  getItem: (key) => SecureStore.getItemAsync(secureKey(key)),
  setItem: (key, value) =>
    SecureStore.setItemAsync(secureKey(key), value, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    }),
  removeItem: (key) => SecureStore.deleteItemAsync(secureKey(key)),
};

const KEY = "@ra/auth";
// Real sessions (API mode) live in the device keychain; AsyncStorage is for
// fixture mode only (MOBILE.md §M4.4).
let driver: StorageDriver = useApi() ? SecureStoreDriver : AsyncStorageDriver;

export function setStorageDriver(next: StorageDriver): void {
  driver = next;
}

export async function loadUser(): Promise<User | null> {
  try {
    const raw = await driver.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export async function saveUser(user: User): Promise<void> {
  await driver.setItem(KEY, JSON.stringify(user));
}

export async function clearUser(): Promise<void> {
  await driver.removeItem(KEY);
}
