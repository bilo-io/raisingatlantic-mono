import { ILoggerService } from '../../telemetry/interfaces/logger.interface';
import {
  IPushNotificationService,
  PushDeliveryResult,
  PushMessage,
} from '../interfaces/push.interface';
import { redactToken } from '../redact';

const PROVIDER_ID = 'noop';

export class NoopPushService implements IPushNotificationService {
  constructor(private readonly logger: ILoggerService) {}

  async send(message: PushMessage): Promise<PushDeliveryResult> {
    // TODO(phase-8): swap for Expo Push Notifications adapter — see DEV.md §8.3.
    this.logger.log(
      `[noop-push] token=${redactToken(message.token)} title="${message.title}"`,
    );
    return { delivered: false, providerId: PROVIDER_ID };
  }
}
