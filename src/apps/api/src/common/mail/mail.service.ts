import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = this.configService.get<number>('SMTP_PORT');
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // true for 465, false for other ports
        auth: {
          user,
          pass,
        },
      });
      this.logger.log('Mail service initialized with SMTP');
    } else {
      this.logger.warn('SMTP credentials not fully provided. Mail service will only log to console.');
    }
  }

  async sendMail(to: string, subject: string, message: string, fromName?: string) {
    const fromAddress = this.configService.get<string>('MAIL_FROM') || 'no-reply@raisingatlantic.com';
    const finalFromName = fromName || 'Raising Atlantic';

    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: `"${finalFromName}" <${fromAddress}>`,
          to,
          subject,
          text: message,
          html: `<p>${message.replace(/\n/g, '<br>')}</p>`,
        });
        this.logger.log(`Email sent to ${to}`);
      } catch (error) {
        this.logger.error(`Failed to send email to ${to}`, error.stack);
        throw error;
      }
    } else {
      this.logger.log(`[MOCK EMAIL] TO: ${to} | SUBJECT: ${subject} | MESSAGE: ${message}`);
    }
  }
}
