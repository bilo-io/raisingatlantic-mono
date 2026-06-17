import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { CreateLeadDto } from './dto/create-lead.dto';
import { INotificationDispatcher } from '@core/notifications/interfaces/dispatcher.interface';
import { NOTIFICATION_TOKENS } from '@core/notifications/interfaces/tokens';
import { SystemLogsService } from '../system-logs/system-logs.service';
import { GoogleSheetsService } from '../common/google-sheets/google-sheets.service';

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);

  constructor(
    @Inject(NOTIFICATION_TOKENS.Dispatcher)
    private readonly notifications: INotificationDispatcher,
    private readonly systemLogsService: SystemLogsService,
    private readonly sheets: GoogleSheetsService,
    private readonly config: ConfigService,
  ) {}

  async create(createLeadDto: CreateLeadDto, ip?: string) {
    const { email, name, subject, message, type, phone, consent } =
      createLeadDto;
    const finalSubject = subject || 'New Lead from Contact Form';
    const finalName = name || 'Anonymous Lead';
    const finalType = type || 'contact';

    this.logger.log('Received lead'); // no PII in this log line

    // 1. Send admin notification email
    try {
      await this.notifications.email({
        to: 'admin@raisingatlantic.com',
        subject: `Lead: ${finalSubject}`,
        text: `New lead from ${finalName} (${email}):\n\n${message}`,
        fromName: finalName,
      });
    } catch (error) {
      this.logger.error(
        `Error sending lead notification email: ${(error as Error).message}`,
      );
      // Swallow so the system log still gets written.
    }

    // TODO(phase-8): send a "thanks, we'll be in touch" email to the lead
    // themselves once the templating + provider story lands — see DEV.md §8.1.

    // 2. Log in System Logs
    await this.systemLogsService.createLog({
      type: 'LEAD_CONTACT',
      message: `Lead contact form submitted by ${finalName} (${email})`,
      metadata: {
        email,
        name: finalName,
        subject: finalSubject,
        icon: 'envelope',
      },
      ipAddress: ip,
    });

    // 3. Append to the Google Sheets lead store — only with explicit POPIA
    // consent, and only when a target spreadsheet is configured. Best-effort:
    // a Sheets failure must not break the email/system-log flow above.
    const spreadsheetConfigured = !!this.config.get<string>(
      'GOOGLE_SHEETS_SPREADSHEET_ID',
    );
    if (consent === true && spreadsheetConfigured) {
      const tab = this.config.get<string>('GOOGLE_SHEETS_LEADS_TAB') ?? 'Leads';
      try {
        // Leads tab: A id | B createdAt | C type | D name | E email | F phone
        //            | G subject | H message | I consent | J ip
        await this.sheets.appendRow(tab, [
          randomUUID(),
          new Date().toISOString(),
          finalType,
          finalName,
          email,
          phone ?? '',
          finalSubject,
          message,
          'true',
          ip ?? '',
        ]);
      } catch (error) {
        this.logger.error(
          `Error appending lead to Sheets: ${(error as Error).message}`,
        );
      }
    }

    return {
      message: 'Lead submitted successfully',
      timestamp: new Date().toISOString(),
    };
  }
}
