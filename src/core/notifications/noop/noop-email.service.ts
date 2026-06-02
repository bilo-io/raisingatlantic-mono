import { ILoggerService } from '../../telemetry/interfaces/logger.interface';
import {
  EmailDeliveryResult,
  EmailMessage,
  IEmailService,
} from '../interfaces/email.interface';
import { redactEmail } from '../redact';

const PROVIDER_ID = 'noop';

export class NoopEmailService implements IEmailService {
  constructor(private readonly logger: ILoggerService) {}

  async send(message: EmailMessage): Promise<EmailDeliveryResult> {
    // TODO(phase-8): swap for SendGrid/Postmark/SES adapter — see DEV.md §8.1.
    this.logger.log(
      `[noop-email] to=${redactEmail(message.to)} subject="${message.subject}"`,
    );
    return { delivered: false, providerId: PROVIDER_ID };
  }
}
