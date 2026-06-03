import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import type { Role } from "../../auth/types";
import {
  deregisterPushToken,
  registerPushToken,
  type Platform as PushPlatform,
} from "../api/adapters/push-tokens.adapter";
import { topicsForRole } from "./topics";

let lastToken: string | null = null;

function platformName(): PushPlatform {
  if (Platform.OS === "ios") return "ios";
  if (Platform.OS === "android") return "android";
  return "web";
}

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync("default", {
    name: "default",
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#D97757",
  });
}

async function ensurePermission(): Promise<boolean> {
  const settings = await Notifications.getPermissionsAsync();
  if (settings.granted) return true;
  if (settings.canAskAgain === false) return false;
  const next = await Notifications.requestPermissionsAsync();
  return next.granted;
}

export async function registerDeviceForRole(role: Role): Promise<void> {
  if (!Device.isDevice) return;
  const granted = await ensurePermission();
  if (!granted) return;
  await ensureAndroidChannel();

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    (Constants as unknown as { easConfig?: { projectId?: string } }).easConfig
      ?.projectId;

  let tokenValue: string;
  try {
    const tokenResp = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined,
    );
    tokenValue = tokenResp.data;
  } catch (err) {
    if (__DEV__) {
      console.warn("[push] failed to get Expo push token", err);
    }
    return;
  }

  lastToken = tokenValue;
  try {
    await registerPushToken({
      token: tokenValue,
      platform: platformName(),
      topics: topicsForRole(role),
    });
  } catch (err) {
    if (__DEV__) {
      console.warn("[push] failed to register push token with backend", err);
    }
  }
}

export async function deregisterDevice(): Promise<void> {
  if (!lastToken) return;
  const token = lastToken;
  lastToken = null;
  try {
    await deregisterPushToken(token);
  } catch (err) {
    if (__DEV__) {
      console.warn("[push] failed to deregister push token", err);
    }
  }
}
