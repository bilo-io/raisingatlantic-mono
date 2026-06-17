import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { LeadsService } from './leads.service';
import { NOTIFICATION_TOKENS } from '@core/notifications/interfaces/tokens';
import { SystemLogsService } from '../system-logs/system-logs.service';
import { GoogleSheetsService } from '../common/google-sheets/google-sheets.service';

describe('LeadsService', () => {
  let service: LeadsService;
  let dispatcher: {
    email: jest.Mock;
    sms: jest.Mock;
    push: jest.Mock;
    notifyUser: jest.Mock;
  };
  let systemLogs: jest.Mocked<SystemLogsService>;
  let sheets: { appendRow: jest.Mock };
  let configValues: Record<string, string | undefined>;

  beforeEach(async () => {
    dispatcher = {
      email: jest
        .fn()
        .mockResolvedValue({ delivered: true, providerId: 'fake' }),
      sms: jest.fn(),
      push: jest.fn(),
      notifyUser: jest.fn(),
    };
    sheets = { appendRow: jest.fn().mockResolvedValue(undefined) };
    // Default: spreadsheet configured so consented leads reach the Sheet.
    configValues = { GOOGLE_SHEETS_SPREADSHEET_ID: 'sheet-123' };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeadsService,
        { provide: NOTIFICATION_TOKENS.Dispatcher, useValue: dispatcher },
        { provide: SystemLogsService, useValue: { createLog: jest.fn() } },
        { provide: GoogleSheetsService, useValue: sheets },
        {
          provide: ConfigService,
          useValue: { get: (k: string) => configValues[k] },
        },
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

  it('appends to the Sheet only when consent is given', async () => {
    systemLogs.createLog.mockResolvedValue({} as any);

    await service.create({
      email: 'jane@example.com',
      message: 'Add me to the waitlist please',
      type: 'waitlist',
      phone: '+27 82 123 4567',
      consent: true,
    });

    expect(sheets.appendRow).toHaveBeenCalledTimes(1);
    const [tab, row] = sheets.appendRow.mock.calls[0];
    expect(tab).toBe('Leads');
    expect(row[2]).toBe('waitlist'); // type
    expect(row[4]).toBe('jane@example.com'); // email
    expect(row[5]).toBe('+27 82 123 4567'); // phone
  });

  it('does NOT append to the Sheet without consent', async () => {
    systemLogs.createLog.mockResolvedValue({} as any);

    await service.create({
      email: 'jane@example.com',
      message: 'A message with no consent',
    });

    expect(sheets.appendRow).not.toHaveBeenCalled();
  });

  it('does NOT append to the Sheet when no spreadsheet is configured', async () => {
    configValues = {}; // no GOOGLE_SHEETS_SPREADSHEET_ID
    systemLogs.createLog.mockResolvedValue({} as any);

    await service.create({
      email: 'jane@example.com',
      message: 'Consented but no sheet configured',
      consent: true,
    });

    expect(sheets.appendRow).not.toHaveBeenCalled();
  });

  it('still succeeds when the Sheet append throws', async () => {
    sheets.appendRow.mockRejectedValue(new Error('sheets down'));
    systemLogs.createLog.mockResolvedValue({} as any);

    await expect(
      service.create({
        email: 'jane@example.com',
        message: 'Consented, sheet errors',
        consent: true,
      }),
    ).resolves.toEqual(
      expect.objectContaining({ message: 'Lead submitted successfully' }),
    );
  });
});
