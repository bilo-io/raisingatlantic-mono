import { GoogleSheetsService } from './google-sheets.service';

// Mock the Google client libraries so no real network/auth happens.
const mockValuesGet = jest.fn();
const mockValuesUpdate = jest.fn();
const mockValuesAppend = jest.fn();

jest.mock('google-auth-library', () => ({
  GoogleAuth: jest.fn().mockImplementation(() => ({
    getClient: jest.fn().mockResolvedValue({}),
  })),
}));

jest.mock('googleapis', () => ({
  google: {
    sheets: jest.fn(() => ({
      spreadsheets: {
        values: {
          get: (...args: unknown[]) => mockValuesGet(...args),
          update: (...args: unknown[]) => mockValuesUpdate(...args),
          append: (...args: unknown[]) => mockValuesAppend(...args),
        },
      },
    })),
  },
}));

describe('GoogleSheetsService.ensureHeaderRow', () => {
  let service: GoogleSheetsService;

  const config = {
    get: jest.fn((key: string) =>
      key === 'GOOGLE_SHEETS_SPREADSHEET_ID' ? 'sheet-123' : undefined,
    ),
  };
  const logger = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  };
  const errorReporter = { report: jest.fn(), reportException: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new GoogleSheetsService(config as never, logger, errorReporter);
  });

  it('writes the header row when row 1 is empty', async () => {
    mockValuesGet.mockResolvedValue({ data: { values: [] } });
    mockValuesUpdate.mockResolvedValue({});

    await service.ensureHeaderRow('Leads', ['id', 'createdAt', 'email']);

    expect(mockValuesUpdate).toHaveBeenCalledTimes(1);
    expect(mockValuesUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        spreadsheetId: 'sheet-123',
        range: 'Leads!A1',
        valueInputOption: 'RAW',
        requestBody: { values: [['id', 'createdAt', 'email']] },
      }),
    );
  });

  it('leaves an existing header row untouched (idempotent)', async () => {
    mockValuesGet.mockResolvedValue({
      data: { values: [['id', 'createdAt', 'email']] },
    });

    await service.ensureHeaderRow('Leads', ['id', 'createdAt', 'email']);

    expect(mockValuesUpdate).not.toHaveBeenCalled();
  });

  it('treats a blank-only first row as no header and writes', async () => {
    mockValuesGet.mockResolvedValue({ data: { values: [['', '  ']] } });
    mockValuesUpdate.mockResolvedValue({});

    await service.ensureHeaderRow('FeatureRequests', ['id', 'title']);

    expect(mockValuesUpdate).toHaveBeenCalledTimes(1);
  });

  it('reports and rethrows on API failure', async () => {
    const boom = new Error('quota exceeded');
    mockValuesGet.mockRejectedValue(boom);

    await expect(service.ensureHeaderRow('Leads', ['id'])).rejects.toThrow(
      'quota exceeded',
    );
    expect(errorReporter.reportException).toHaveBeenCalledWith(
      boom,
      expect.objectContaining({ tab: 'Leads', op: 'ensureHeaderRow' }),
    );
  });
});
