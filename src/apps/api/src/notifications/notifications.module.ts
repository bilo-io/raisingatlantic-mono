import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DefaultNotificationDispatcher } from '@core/notifications/dispatcher/default-dispatcher.service';
import { NoopEmailService } from '@core/notifications/noop/noop-email.service';
import { NoopPushService } from '@core/notifications/noop/noop-push.service';
import { NoopSmsService } from '@core/notifications/noop/noop-sms.service';
import { NodemailerEmailService } from './adapters/nodemailer-email.service';
import { IEmailService } from '@core/notifications/interfaces/email.interface';
import { IPushNotificationService } from '@core/notifications/interfaces/push.interface';
import { ISmsService } from '@core/notifications/interfaces/sms.interface';
import { ILoggerService } from '@core/telemetry/interfaces/logger.interface';
import { GcpLoggerService } from '@core/telemetry/gcp/logger.service';

import { NOTIFICATION_TOKENS } from '@core/notifications/interfaces/tokens';

// TODO(phase-8): when providers are chosen, swap useFactory bodies to construct
// the real adapters (SendGrid/Postmark/SES for email §8.1, Twilio/Clickatell/
// Infobip for SMS §8.2, Expo for push §8.3). The call sites consuming
// INotificationDispatcher do not need to change.

@Global()
@Module({
  providers: [
    {
      provide: 'ILoggerService',
      useClass: GcpLoggerService,
    },
    {
      provide: NOTIFICATION_TOKENS.Email,
      inject: [ConfigService, 'ILoggerService'],
      useFactory: (
        config: ConfigService,
        logger: ILoggerService,
      ): IEmailService => {
        const host = config.get<string>('SMTP_HOST');
        const port = config.get<number>('SMTP_PORT');
        const user = config.get<string>('SMTP_USER');
        const pass = config.get<string>('SMTP_PASS');
        const fromAddress = config.get<string>('MAIL_FROM');

        if (host && user && pass) {
          return new NodemailerEmailService(logger, {
            host,
            port,
            user,
            pass,
            fromAddress,
          });
        }
        return new NoopEmailService(logger);
      },
    },
    {
      provide: NOTIFICATION_TOKENS.Sms,
      inject: ['ILoggerService'],
      useFactory: (logger: ILoggerService): ISmsService =>
        new NoopSmsService(logger),
    },
    {
      provide: NOTIFICATION_TOKENS.Push,
      inject: ['ILoggerService'],
      useFactory: (logger: ILoggerService): IPushNotificationService =>
        new NoopPushService(logger),
    },
    {
      provide: NOTIFICATION_TOKENS.Dispatcher,
      inject: [
        NOTIFICATION_TOKENS.Email,
        NOTIFICATION_TOKENS.Sms,
        NOTIFICATION_TOKENS.Push,
        'ILoggerService',
      ],
      useFactory: (
        email: IEmailService,
        sms: ISmsService,
        push: IPushNotificationService,
        logger: ILoggerService,
      ) => new DefaultNotificationDispatcher(email, sms, push, logger),
    },
  ],
  exports: [
    NOTIFICATION_TOKENS.Email,
    NOTIFICATION_TOKENS.Sms,
    NOTIFICATION_TOKENS.Push,
    NOTIFICATION_TOKENS.Dispatcher,
  ],
})
export class NotificationsModule {}
