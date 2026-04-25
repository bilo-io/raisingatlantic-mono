import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "./types";

const KEY = "@ra/auth";

export async function loadUser(): Promise<User | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export async function saveUser(user: User): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(user));
}

export async function clearUser(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}
