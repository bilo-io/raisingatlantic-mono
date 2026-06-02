import { ILoggerService } from '../../telemetry/interfaces/logger.interface';
import {
  INotificationDispatcher,
} from '../interfaces/dispatcher.interface';
import {
  EmailDeliveryResult,
  EmailMessage,
  IEmailService,
} from '../interfaces/email.interface';
import {
  IPushNotificationService,
  PushDeliveryResult,
  PushMessage,
} from '../interfaces/push.interface';
import {
  ISmsService,
  SmsDeliveryResult,
  SmsMessage,
} from '../interfaces/sms.interface';

export class DefaultNotificationDispatcher implements INotificationDispatcher {
  constructor(
    private readonly emailService: IEmailService,
    private readonly smsService: ISmsService,
    private readonly pushService: IPushNotificationService,
    private readonly logger: ILoggerService,
  ) {}

  email(message: EmailMessage): Promise<EmailDeliveryResult> {
    return this.emailService.send(message);
  }

  sms(message: SmsMessage): Promise<SmsDeliveryResult> {
    return this.smsService.send(message);
  }

  push(message: PushMessage): Promise<PushDeliveryResult> {
    return this.pushService.send(message);
  }

  async notifyUser(
    userId: string,
    event: string,
    payload: Record<string, unknown>,
  ): Promise<void> {
    // TODO(phase-8): resolve user channel preferences + quiet hours (§8.3),
    // then fan out to email/sms/push transports. For now this is a no-op so
    // callers can wire in early without behaviour drift.
    this.logger.log(
      `[dispatcher.notifyUser] userId=${userId} event=${event} payloadKeys=${Object.keys(payload).join(',')}`,
    );
  }
}
