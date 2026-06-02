import * as nodemailer from 'nodemailer';

import { ILoggerService } from '@core/telemetry/interfaces/logger.interface';
import {
  EmailDeliveryResult,
  EmailMessage,
  IEmailService,
} from '@core/notifications/interfaces/email.interface';
import { redactEmail } from '@core/notifications/redact';

const PROVIDER_ID = 'nodemailer';

export interface NodemailerEmailConfig {
  host?: string;
  port?: number;
  user?: string;
  pass?: string;
  fromAddress?: string;
  fromName?: string;
}

// SMTP/nodemailer adapter for IEmailService.
//
// Behaviour parity with the previous MailService (src/apps/api/src/common/mail/mail.service.ts):
//   - When SMTP host/user/pass are all set, sends via nodemailer.
//   - Otherwise logs a [MOCK EMAIL] line and returns delivered=false.
//
// TODO(phase-8): replace with the chosen production provider — see DEV.md §8.1
// (SendGrid preferred, Postmark / AWS SES alternates).
export class NodemailerEmailService implements IEmailService {
  private readonly transporter: nodemailer.Transporter | null;
  private readonly fromAddress: string;
  private readonly defaultFromName: string;

  constructor(
    private readonly logger: ILoggerService,
    config: NodemailerEmailConfig = {},
  ) {
    const { host, port, user, pass, fromAddress, fromName } = config;
    this.fromAddress = fromAddress || 'no-reply@raisingatlantic.com';
    this.defaultFromName = fromName || 'Raising Atlantic';

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
      this.logger.log('NodemailerEmailService initialised with SMTP');
    } else {
      this.transporter = null;
      this.logger.warn(
        'NodemailerEmailService: SMTP credentials missing; falling back to console log only',
      );
    }
  }

  async send(message: EmailMessage): Promise<EmailDeliveryResult> {
    const finalFromName = message.fromName || this.defaultFromName;
    const redactedTo = redactEmail(message.to);

    if (!this.transporter) {
      this.logger.log(
        `[MOCK EMAIL] to=${redactedTo} subject="${message.subject}"`,
      );
      return { delivered: false, providerId: PROVIDER_ID };
    }

    try {
      const html =
        message.html ??
        (message.text
          ? `<p>${message.text.replace(/\n/g, '<br>')}</p>`
          : undefined);

      const info = await this.transporter.sendMail({
        from: `"${finalFromName}" <${this.fromAddress}>`,
        to: message.to,
        subject: message.subject,
        text: message.text,
        html,
      });
      this.logger.log(`NodemailerEmailService sent: to=${redactedTo}`);
      return {
        delivered: true,
        providerId: PROVIDER_ID,
        providerMessageId: info.messageId,
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `NodemailerEmailService failed to send to ${redactedTo}`,
        err.stack,
      );
      return {
        delivered: false,
        providerId: PROVIDER_ID,
        error: err.message,
      };
    }
  }
}
