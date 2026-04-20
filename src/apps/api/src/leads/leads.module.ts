import { Module } from '@nestjs/common';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { MailService } from '../common/mail/mail.service';
import { SystemLogsModule } from '../system-logs/system-logs.module';

@Module({
  imports: [SystemLogsModule],
  controllers: [LeadsController],
  providers: [LeadsService, MailService],
})
export class LeadsModule {}
