import { EmailDeliveryResult, EmailMessage } from './email.interface';
import { PushDeliveryResult, PushMessage } from './push.interface';
import { SmsDeliveryResult, SmsMessage } from './sms.interface';

// High-level facade for transactional comms. Call sites should depend on this
// rather than on the individual transports, so a future per-user preference /
// quiet-hours layer can be added without touching consumers.
//
// TODO(phase-8): per-user channel preference + quiet hours — see DEV.md §8.3.

export type NotificationChannel = 'email' | 'sms' | 'push';

export interface INotificationDispatcher {
  email(message: EmailMessage): Promise<EmailDeliveryResult>;
  sms(message: SmsMessage): Promise<SmsDeliveryResult>;
  push(message: PushMessage): Promise<PushDeliveryResult>;
  notifyUser(
    userId: string,
    event: string,
    payload: Record<string, unknown>,
  ): Promise<void>;
}
