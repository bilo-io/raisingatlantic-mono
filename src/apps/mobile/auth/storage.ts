import AsyncStorage from "@react-native-async-storage/async-storage";
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

const KEY = "@ra/auth";
let driver: StorageDriver = AsyncStorageDriver;

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
