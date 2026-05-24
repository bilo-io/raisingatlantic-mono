import { Test, TestingModule } from '@nestjs/testing';
import { LeadsService } from './leads.service';
import { MailService } from '../common/mail/mail.service';
import { SystemLogsService } from '../system-logs/system-logs.service';

describe('LeadsService', () => {
  let service: LeadsService;
  let mailService: jest.Mocked<MailService>;
  let systemLogs: jest.Mocked<SystemLogsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeadsService,
        { provide: MailService, useValue: { sendMail: jest.fn() } },
        { provide: SystemLogsService, useValue: { createLog: jest.fn() } },
      ],
    }).compile();

    service = module.get(LeadsService);
    mailService = module.get(MailService);
    systemLogs = module.get(SystemLogsService);
  });

  it('sends an email and writes a system log on success', async () => {
    mailService.sendMail.mockResolvedValue(undefined as any);
    systemLogs.createLog.mockResolvedValue({} as any);

    const result = await service.create(
      {
        email: 'jane@example.com',
        name: 'Jane',
        subject: 'Pricing',
        message: 'Hello there I want to know more',
      },
      '127.0.0.1',
    );

    expect(mailService.sendMail).toHaveBeenCalledWith(
      'admin@raisingatlantic.com',
      'Lead: Pricing',
      expect.stringContaining('Jane'),
      'Jane',
    );
    expect(systemLogs.createLog).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'LEAD_CONTACT',
        ipAddress: '127.0.0.1',
        metadata: expect.objectContaining({ email: 'jane@example.com', name: 'Jane' }),
      }),
    );
    expect(result).toEqual(
      expect.objectContaining({ message: 'Lead submitted successfully' }),
    );
  });

  it('applies default subject and name when omitted', async () => {
    mailService.sendMail.mockResolvedValue(undefined as any);
    systemLogs.createLog.mockResolvedValue({} as any);

    await service.create(
      { email: 'anon@example.com', message: 'I am asking a question' } as any,
      undefined,
    );

    expect(mailService.sendMail).toHaveBeenCalledWith(
      'admin@raisingatlantic.com',
      'Lead: New Lead from Contact Form',
      expect.stringContaining('Anonymous Lead'),
      'Anonymous Lead',
    );
  });

  it('still writes a system log when the mail send fails', async () => {
    mailService.sendMail.mockRejectedValue(new Error('smtp down'));
    systemLogs.createLog.mockResolvedValue({} as any);

    await expect(
      service.create(
        { email: 'a@b.com', message: 'Something here please' } as any,
      ),
    ).resolves.toEqual(expect.objectContaining({ message: 'Lead submitted successfully' }));

    expect(systemLogs.createLog).toHaveBeenCalledTimes(1);
  });
});
