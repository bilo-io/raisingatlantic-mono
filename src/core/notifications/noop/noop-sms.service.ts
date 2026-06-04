import { ILoggerService } from '../../telemetry/interfaces/logger.interface';
import {
  ISmsService,
  SmsDeliveryResult,
  SmsMessage,
} from '../interfaces/sms.interface';
import { redactPhone } from '../redact';

const PROVIDER_ID = 'noop';

export class NoopSmsService implements ISmsService {
  constructor(private readonly logger: ILoggerService) {}

  async send(message: SmsMessage): Promise<SmsDeliveryResult> {
    // TODO(phase-8): swap for Twilio/Clickatell/Infobip adapter — see DEV.md §8.2.
    this.logger.log(
      `[noop-sms] to=${redactPhone(message.to)} bodyLen=${message.body.length}`,
    );
    return { delivered: false, providerId: PROVIDER_ID };
  }
}
