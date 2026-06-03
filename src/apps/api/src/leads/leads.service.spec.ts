import { Test, TestingModule } from '@nestjs/testing';
import { LeadsService } from './leads.service';
import { NOTIFICATION_TOKENS } from '@core/notifications/interfaces/tokens';
import { SystemLogsService } from '../system-logs/system-logs.service';

describe('LeadsService', () => {
  let service: LeadsService;
  let dispatcher: {
    email: jest.Mock;
    sms: jest.Mock;
    push: jest.Mock;
    notifyUser: jest.Mock;
  };
  let systemLogs: jest.Mocked<SystemLogsService>;

  beforeEach(async () => {
    dispatcher = {
      email: jest
        .fn()
        .mockResolvedValue({ delivered: true, providerId: 'fake' }),
      sms: jest.fn(),
      push: jest.fn(),
      notifyUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeadsService,
        { provide: NOTIFICATION_TOKENS.Dispatcher, useValue: dispatcher },
        { provide: SystemLogsService, useValue: { createLog: jest.fn() } },
      ],
    }).compile();

    service = module.get(LeadsService);
    systemLogs = module.get(SystemLogsService);
  });

  it('sends an email and writes a system log on success', async () => {
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

    expect(dispatcher.email).toHaveBeenCalledWith({
      to: 'admin@raisingatlantic.com',
      subject: 'Lead: Pricing',
      text: expect.stringContaining('Jane'),
      fromName: 'Jane',
    });
    expect(systemLogs.createLog).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'LEAD_CONTACT',
        ipAddress: '127.0.0.1',
        metadata: expect.objectContaining({
          email: 'jane@example.com',
          name: 'Jane',
        }),
      }),
    );
    expect(result).toEqual(
      expect.objectContaining({ message: 'Lead submitted successfully' }),
    );
  });

  it('applies default subject and name when omitted', async () => {
    systemLogs.createLog.mockResolvedValue({} as any);

    await service.create(
      { email: 'anon@example.com', message: 'I am asking a question' },
      undefined,
    );

    expect(dispatcher.email).toHaveBeenCalledWith({
      to: 'admin@raisingatlantic.com',
      subject: 'Lead: New Lead from Contact Form',
      text: expect.stringContaining('Anonymous Lead'),
      fromName: 'Anonymous Lead',
    });
  });

  it('still writes a system log when the mail send fails', async () => {
    dispatcher.email.mockRejectedValue(new Error('smtp down'));
    systemLogs.createLog.mockResolvedValue({} as any);

    await expect(
      service.create({
        email: 'a@b.com',
        message: 'Something here please',
      } as any),
    ).resolves.toEqual(
      expect.objectContaining({ message: 'Lead submitted successfully' }),
    );

    expect(systemLogs.createLog).toHaveBeenCalledTimes(1);
  });
});
