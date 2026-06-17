import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';
import { FeatureRequestsService } from './feature-requests.service';
import { GoogleSheetsService } from '../common/google-sheets/google-sheets.service';

describe('FeatureRequestsService', () => {
  let service: FeatureRequestsService;
  let sheets: {
    appendRow: jest.Mock;
    getRows: jest.Mock;
    incrementCell: jest.Mock;
  };

  beforeEach(async () => {
    sheets = {
      appendRow: jest.fn().mockResolvedValue(undefined),
      getRows: jest.fn().mockResolvedValue([]),
      incrementCell: jest.fn().mockResolvedValue(1),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeatureRequestsService,
        { provide: GoogleSheetsService, useValue: sheets },
        { provide: ConfigService, useValue: { get: () => undefined } },
        {
          provide: 'ILoggerService',
          useValue: { log: jest.fn(), warn: jest.fn(), error: jest.fn() },
        },
        {
          provide: 'IMetricService',
          useValue: { incrementCounter: jest.fn() },
        },
      ],
    }).compile();

    service = module.get(FeatureRequestsService);
  });

  describe('create', () => {
    it('appends a PENDING row with zeroed counters and returns an id', async () => {
      const result = await service.create({
        title: 'Dark mode',
        description: 'Easier on the eyes at night',
      });

      expect(result.id).toEqual(expect.any(String));
      expect(sheets.appendRow).toHaveBeenCalledTimes(1);
      const [tab, row] = sheets.appendRow.mock.calls[0];
      expect(tab).toBe('FeatureRequests');
      // [id, createdAt, title, description, email, consent, status, up, down]
      expect(row[2]).toBe('Dark mode');
      expect(row[3]).toBe('Easier on the eyes at night');
      expect(row[4]).toBe(''); // no email
      expect(row[5]).toBe(''); // no consent recorded without email
      expect(row[6]).toBe('PENDING');
      expect(row[7]).toBe(0);
      expect(row[8]).toBe(0);
    });

    it('records the email and consent flag when an email is supplied', async () => {
      await service.create({
        title: 'Reminders',
        description: 'Medication reminders please',
        email: 'jane@example.com',
        consent: true,
      });
      const [, row] = sheets.appendRow.mock.calls[0];
      expect(row[4]).toBe('jane@example.com');
      expect(row[5]).toBe('true');
    });
  });

  describe('list', () => {
    it('returns only APPROVED rows, newest first, without email/status', async () => {
      sheets.getRows.mockResolvedValue([
        [
          'id-1',
          '2026-01-01',
          'Old approved',
          'desc1',
          'a@b.com',
          'true',
          'APPROVED',
          '3',
          '1',
        ],
        [
          'id-2',
          '2026-01-02',
          'Pending one',
          'desc2',
          '',
          '',
          'PENDING',
          '5',
          '0',
        ],
        [
          'id-3',
          '2026-01-03',
          'New approved',
          'desc3',
          '',
          '',
          'APPROVED',
          '2',
          '0',
        ],
      ]);

      const result = await service.list();

      expect(result.map((r) => r.id)).toEqual(['id-3', 'id-1']); // newest first
      expect(result[0]).toEqual({
        id: 'id-3',
        title: 'New approved',
        description: 'desc3',
        upvotes: 2,
        downvotes: 0,
      });
      // No email/status leaked.
      expect(result[1]).not.toHaveProperty('email');
    });

    it('treats a manually-typed status with stray whitespace/case as APPROVED', async () => {
      sheets.getRows.mockResolvedValue([
        [
          'id-1',
          '2026-01-01',
          'Spacey',
          'desc',
          '',
          '',
          ' approved ',
          '0',
          '0',
        ],
        ['id-2', '2026-01-02', 'Mixed', 'desc', '', '', 'Approved', '0', '0'],
        [
          'id-3',
          '2026-01-03',
          'Rejected',
          'desc',
          '',
          '',
          'REJECTED',
          '0',
          '0',
        ],
      ]);

      const result = await service.list();

      // Both approved variants shown (newest first); rejected stays hidden.
      expect(result.map((r) => r.id)).toEqual(['id-2', 'id-1']);
    });
  });

  describe('vote', () => {
    it('increments the upvote column (H)', async () => {
      sheets.incrementCell.mockResolvedValue(4);
      const result = await service.vote('id-1', 'up');
      expect(sheets.incrementCell).toHaveBeenCalledWith(
        'FeatureRequests',
        'id-1',
        'H',
      );
      expect(result).toEqual({ value: 4 });
    });

    it('increments the downvote column (I)', async () => {
      sheets.incrementCell.mockResolvedValue(2);
      await service.vote('id-1', 'down');
      expect(sheets.incrementCell).toHaveBeenCalledWith(
        'FeatureRequests',
        'id-1',
        'I',
      );
    });

    it('throws NotFound when the id is unknown', async () => {
      sheets.incrementCell.mockResolvedValue(null);
      await expect(service.vote('missing', 'up')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
