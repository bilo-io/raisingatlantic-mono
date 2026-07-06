import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MetricsService } from './metrics.service';
import { Child } from '../children/children.model';
import { IMetricService } from '@core/telemetry/interfaces/metric.interface';

// Fixed reference date so age-in-months math is deterministic across machines.
const AS_OF = new Date('2026-06-15T12:00:00Z');

function child(partial: Partial<Child>): Child {
  return {
    completedVaccinations: [],
    ...partial,
  } as Child;
}

describe('MetricsService', () => {
  let service: MetricsService;
  let metric: jest.Mocked<IMetricService>;
  let find: jest.Mock;

  beforeEach(async () => {
    find = jest.fn();
    metric = {
      incrementCounter: jest.fn(),
      recordValue: jest.fn(),
      recordHistogram: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetricsService,
        { provide: getRepositoryToken(Child), useValue: { find } },
        { provide: 'IMetricService', useValue: metric },
      ],
    }).compile();

    service = module.get(MetricsService);
  });

  it('counts only hepB1 as due for a newborn with no vaccinations', async () => {
    find.mockResolvedValue([
      child({ dateOfBirth: '2026-06-15T12:00:00Z' as unknown as Date }),
    ]);

    const result = await service.emitBusinessGauges(AS_OF);

    // At birth, only the "Birth"-gated hepB1 is due; everything else is upcoming.
    expect(result).toEqual({ due: 1, overdue: 0 });
  });

  it('counts the remaining schedule as overdue for a 24-month-old, excluding completed', async () => {
    find.mockResolvedValue([
      child({
        dateOfBirth: '2024-06-15T12:00:00Z' as unknown as Date,
        completedVaccinations: [
          { vaccineId: 'flu' },
        ] as Child['completedVaccinations'],
      }),
    ]);

    const result = await service.emitBusinessGauges(AS_OF);

    // 24 EPI entries; flu is completed (excluded), the other 23 are past their
    // max age → overdue. None remain "due".
    expect(result).toEqual({ due: 0, overdue: 23 });
  });

  it('emits a recordValue gauge per bucket matching the returned snapshot', async () => {
    find.mockResolvedValue([
      child({ dateOfBirth: '2026-06-15T12:00:00Z' as unknown as Date }),
    ]);

    const result = await service.emitBusinessGauges(AS_OF);

    expect(metric.recordValue).toHaveBeenCalledWith(
      'ra_vaccinations_due',
      result.due,
      {
        bucket: 'due',
      },
    );
    expect(metric.recordValue).toHaveBeenCalledWith(
      'ra_vaccinations_due',
      result.overdue,
      { bucket: 'overdue' },
    );
  });

  it('emits zeroes for an empty cohort', async () => {
    find.mockResolvedValue([]);

    const result = await service.emitBusinessGauges(AS_OF);

    expect(result).toEqual({ due: 0, overdue: 0 });
    expect(metric.recordValue).toHaveBeenCalledWith('ra_vaccinations_due', 0, {
      bucket: 'due',
    });
  });
});
