import * as SecureStore from "expo-secure-store";

const KEY = "ra_id_token";

export async function setIdToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(KEY, token, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
}

export async function getIdToken(): Promise<string | null> {
  return SecureStore.getItemAsync(KEY);
}

export async function clearIdToken(): Promise<void> {
  await SecureStore.deleteItemAsync(KEY);
}
