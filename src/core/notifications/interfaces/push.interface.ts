// TODO(phase-8): provider decided — Expo Push Notifications (APNs + FCM under the hood).
// See docs/GO_LIVE/DEV.md §8.3. Default binding until tokens are captured: NoopPushService.

export interface PushMessage {
  token: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

export interface PushDeliveryResult {
  delivered: boolean;
  providerId: string;
  providerMessageId?: string;
  error?: string;
}

export interface IPushNotificationService {
  send(message: PushMessage): Promise<PushDeliveryResult>;
}
