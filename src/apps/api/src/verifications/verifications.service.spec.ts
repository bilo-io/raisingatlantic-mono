import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VerificationsService } from './verifications.service';
import { User } from '../users/users.model';
import { UserRole } from '../users/constants';
import { ResourceStatus } from '../common/enums';
import {
  GrowthRecord,
  CompletedMilestone,
  CompletedVaccination,
} from '../children/children.model';
import {
  createMockRepository,
  createMockMetrics,
} from '../common/test/test-utils';

describe('VerificationsService', () => {
  let service: VerificationsService;
  let userRepo: any;
  let growthRepo: any;
  let milestoneRepo: any;
  let vaccineRepo: any;
  let metric: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VerificationsService,
        { provide: getRepositoryToken(User), useValue: createMockRepository() },
        {
          provide: getRepositoryToken(GrowthRecord),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(CompletedMilestone),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(CompletedVaccination),
          useValue: createMockRepository(),
        },
        { provide: 'IMetricService', useValue: createMockMetrics() },
      ],
    }).compile();

    service = module.get(VerificationsService);
    userRepo = module.get(getRepositoryToken(User));
    growthRepo = module.get(getRepositoryToken(GrowthRecord));
    milestoneRepo = module.get(getRepositoryToken(CompletedMilestone));
    vaccineRepo = module.get(getRepositoryToken(CompletedVaccination));
    metric = module.get('IMetricService');
  });

  it('is defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllCliniciansForVerification', () => {
    it('queries users filtered to the CLINICIAN role', async () => {
      const clinicians = [{ id: '1', role: UserRole.CLINICIAN }];
      userRepo.find.mockResolvedValue(clinicians);

      const result = await service.findAllCliniciansForVerification();

      expect(result).toEqual(clinicians);
      expect(userRepo.find).toHaveBeenCalledWith({
        where: { role: UserRole.CLINICIAN },
      });
    });

    it('returns an empty array when no clinicians are found', async () => {
      userRepo.find.mockResolvedValue([]);
      await expect(service.findAllCliniciansForVerification()).resolves.toEqual(
        [],
      );
    });
  });

  describe('findAllRecordsForVerification', () => {
    it('aggregates PENDING_ASSESSMENT growth, milestone and vaccination records and tags each with a type', async () => {
      growthRepo.find.mockResolvedValue([
        { id: 'g1', status: ResourceStatus.PENDING_ASSESSMENT },
      ]);
      milestoneRepo.find.mockResolvedValue([
        { id: 'm1', status: ResourceStatus.PENDING_ASSESSMENT },
      ]);
      vaccineRepo.find.mockResolvedValue([
        { id: 'v1', status: ResourceStatus.PENDING_ASSESSMENT },
      ]);

      const result = await service.findAllRecordsForVerification();

      expect(result).toHaveLength(3);
      expect(result.find((r) => r.id === 'g1').type).toBe('Growth');
      expect(result.find((r) => r.id === 'm1').type).toBe('Milestone');
      expect(result.find((r) => r.id === 'v1').type).toBe('Vaccination');

      for (const repo of [growthRepo, milestoneRepo, vaccineRepo]) {
        expect(repo.find).toHaveBeenCalledWith({
          where: { status: ResourceStatus.PENDING_ASSESSMENT },
          relations: ['child'],
        });
      }
    });

    it('does not return records in other states (returned because of stub, but only PENDING_ASSESSMENT is queried)', async () => {
      growthRepo.find.mockResolvedValue([]);
      milestoneRepo.find.mockResolvedValue([]);
      vaccineRepo.find.mockResolvedValue([]);

      const result = await service.findAllRecordsForVerification();

      expect(result).toEqual([]);
      expect(growthRepo.find.mock.calls[0][0].where.status).toBe(
        ResourceStatus.PENDING_ASSESSMENT,
      );
    });

    it('propagates a repository failure', async () => {
      growthRepo.find.mockRejectedValue(new Error('db down'));
      await expect(service.findAllRecordsForVerification()).rejects.toThrow(
        'db down',
      );
    });

    it('records the pending-queue depth metric per type with the correct counts', async () => {
      growthRepo.find.mockResolvedValue([
        { id: 'g1', status: ResourceStatus.PENDING_ASSESSMENT },
        { id: 'g2', status: ResourceStatus.PENDING_ASSESSMENT },
      ]);
      milestoneRepo.find.mockResolvedValue([
        { id: 'm1', status: ResourceStatus.PENDING_ASSESSMENT },
      ]);
      vaccineRepo.find.mockResolvedValue([]);

      await service.findAllRecordsForVerification();

      expect(metric.recordValue).toHaveBeenCalledWith(
        'ra_verifications_pending',
        3,
        { type: 'all' },
      );
      expect(metric.recordValue).toHaveBeenCalledWith(
        'ra_verifications_pending',
        2,
        { type: 'growth' },
      );
      expect(metric.recordValue).toHaveBeenCalledWith(
        'ra_verifications_pending',
        1,
        { type: 'milestone' },
      );
      expect(metric.recordValue).toHaveBeenCalledWith(
        'ra_verifications_pending',
        0,
        { type: 'vaccination' },
      );
      expect(metric.recordValue).toHaveBeenCalledTimes(4);
    });

    it('records zero-depth metrics for every type when the queue is empty', async () => {
      growthRepo.find.mockResolvedValue([]);
      milestoneRepo.find.mockResolvedValue([]);
      vaccineRepo.find.mockResolvedValue([]);

      await service.findAllRecordsForVerification();

      for (const type of ['all', 'growth', 'milestone', 'vaccination']) {
        expect(metric.recordValue).toHaveBeenCalledWith(
          'ra_verifications_pending',
          0,
          { type },
        );
      }
    });
  });
});
