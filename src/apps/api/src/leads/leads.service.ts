import { Injectable, Logger } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { MailService } from '../common/mail/mail.service';
import { SystemLogsService } from '../system-logs/system-logs.service';

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);

  constructor(
    private readonly mailService: MailService,
    private readonly systemLogsService: SystemLogsService,
  ) {}

  async create(createLeadDto: CreateLeadDto, ip?: string) {
    const { email, name, subject, message } = createLeadDto;
    const finalSubject = subject || 'New Lead from Contact Form';
    const finalName = name || 'Anonymous Lead';

    this.logger.log(`Received lead from ${email}`);

    // 1. Send Email
    try {
      await this.mailService.sendMail(
        'admin@raisingatlantic.com', // Admin notification
        `Lead: ${finalSubject}`,
        `New lead from ${finalName} (${email}):\n\n${message}`,
        finalName
      );
    } catch (error) {
      this.logger.error(`Error sending lead notification email: ${error.message}`);
      // We don't throw here to ensure the log is still created, 
      // but in a real app you might want to handle this differently.
    }

    // 2. Log in System Logs
    await this.systemLogsService.createLog({
      type: 'LEAD_CONTACT',
      message: `Lead contact form submitted by ${finalName} (${email})`,
      metadata: {
        email,
        name: finalName,
        subject: finalSubject,
        icon: 'envelope', // Special metadata for UI
      },
      ipAddress: ip,
    });

    return {
      message: 'Lead submitted successfully',
      timestamp: new Date().toISOString(),
    };
  }
}
