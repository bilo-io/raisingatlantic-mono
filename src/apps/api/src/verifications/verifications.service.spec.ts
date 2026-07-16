import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { VerificationsService } from './verifications.service';
import { User } from '../users/users.model';
import { ClinicianProfile } from '../users/clinician-profile.model';
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
  let clinicianProfileRepo: any;
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
          provide: getRepositoryToken(ClinicianProfile),
          useValue: createMockRepository(),
        },
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
    clinicianProfileRepo = module.get(getRepositoryToken(ClinicianProfile));
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

  describe('decideRecord', () => {
    it('APPROVED promotes a pending growth record to Active', async () => {
      const record = {
        id: 'g1',
        status: ResourceStatus.PENDING_ASSESSMENT,
      };
      growthRepo.findOne.mockResolvedValue(record);
      growthRepo.save.mockImplementation((r: any) => Promise.resolve(r));

      const result = await service.decideRecord('g1', { outcome: 'APPROVED' });

      expect(result.status).toBe(ResourceStatus.ACTIVE);
      expect(growthRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ status: ResourceStatus.ACTIVE }),
      );
    });

    it('REJECTED soft-archives the record', async () => {
      milestoneRepo.findOne.mockResolvedValue(undefined);
      growthRepo.findOne.mockResolvedValue(undefined);
      vaccineRepo.findOne.mockResolvedValue(undefined);
      milestoneRepo.findOne.mockResolvedValueOnce({
        id: 'm1',
        status: ResourceStatus.PENDING_ASSESSMENT,
      });
      milestoneRepo.save.mockImplementation((r: any) => Promise.resolve(r));

      const result = await service.decideRecord('m1', { outcome: 'REJECTED' });

      expect(result.status).toBe(ResourceStatus.ARCHIVED);
    });

    it('MORE_INFO leaves the record pending and appends the reviewer note', async () => {
      growthRepo.findOne.mockResolvedValue({
        id: 'g1',
        status: ResourceStatus.PENDING_ASSESSMENT,
        notes: 'parent note',
      });
      growthRepo.save.mockImplementation((r: any) => Promise.resolve(r));

      const result = (await service.decideRecord('g1', {
        outcome: 'MORE_INFO',
        notes: 'please add head circumference',
      })) as { status: ResourceStatus; notes?: string };

      expect(result.status).toBe(ResourceStatus.PENDING_ASSESSMENT);
      expect(result.notes).toContain('parent note');
      expect(result.notes).toContain('please add head circumference');
    });

    it('resolves a record living in the vaccination table', async () => {
      growthRepo.findOne.mockResolvedValue(undefined);
      milestoneRepo.findOne.mockResolvedValue(undefined);
      vaccineRepo.findOne.mockResolvedValue({
        id: 'v1',
        status: ResourceStatus.PENDING_ASSESSMENT,
      });
      vaccineRepo.save.mockImplementation((r: any) => Promise.resolve(r));

      const result = await service.decideRecord('v1', { outcome: 'APPROVED' });

      expect(result.status).toBe(ResourceStatus.ACTIVE);
    });

    it('throws NotFound when the id matches no record table', async () => {
      growthRepo.findOne.mockResolvedValue(undefined);
      milestoneRepo.findOne.mockResolvedValue(undefined);
      vaccineRepo.findOne.mockResolvedValue(undefined);

      await expect(
        service.decideRecord('missing', { outcome: 'APPROVED' }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('lets the assigned clinician decide their own patient record', async () => {
      growthRepo.findOne.mockResolvedValue({
        id: 'g1',
        status: ResourceStatus.PENDING_ASSESSMENT,
        child: { clinician: { id: 'clin-1' } },
      });
      growthRepo.save.mockImplementation((r: any) => Promise.resolve(r));

      const result = await service.decideRecord(
        'g1',
        { outcome: 'APPROVED' },
        { userId: 'clin-1', role: UserRole.CLINICIAN },
      );

      expect(result.status).toBe(ResourceStatus.ACTIVE);
    });

    it('forbids a clinician deciding a record for a child not assigned to them', async () => {
      growthRepo.findOne.mockResolvedValue({
        id: 'g1',
        status: ResourceStatus.PENDING_ASSESSMENT,
        child: { clinician: { id: 'other-clin' } },
      });

      await expect(
        service.decideRecord(
          'g1',
          { outcome: 'APPROVED' },
          { userId: 'clin-1', role: UserRole.CLINICIAN },
        ),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('lets an admin decide any record regardless of assignment', async () => {
      milestoneRepo.findOne.mockResolvedValue(undefined);
      vaccineRepo.findOne.mockResolvedValue(undefined);
      growthRepo.findOne.mockResolvedValue({
        id: 'g1',
        status: ResourceStatus.PENDING_ASSESSMENT,
        child: { clinician: { id: 'someone-else' } },
      });
      growthRepo.save.mockImplementation((r: any) => Promise.resolve(r));

      const result = await service.decideRecord(
        'g1',
        { outcome: 'APPROVED' },
        { userId: 'admin-1', role: UserRole.ADMIN },
      );

      expect(result.status).toBe(ResourceStatus.ACTIVE);
    });
  });

  describe('decideClinician', () => {
    it('APPROVED marks the clinician profile verified', async () => {
      const profile = { id: 'cp1', verificationStatus: 'pending' };
      clinicianProfileRepo.findOne.mockResolvedValue(profile);
      clinicianProfileRepo.save.mockImplementation((p: any) =>
        Promise.resolve(p),
      );

      const result = await service.decideClinician('user-1', {
        outcome: 'APPROVED',
      });

      expect(result.verificationStatus).toBe('verified');
      expect(clinicianProfileRepo.findOne).toHaveBeenCalledWith({
        where: { user: { id: 'user-1' } },
        relations: ['user'],
      });
    });

    it('REJECTED marks the clinician profile rejected', async () => {
      clinicianProfileRepo.findOne.mockResolvedValue({
        id: 'cp1',
        verificationStatus: 'pending',
      });
      clinicianProfileRepo.save.mockImplementation((p: any) =>
        Promise.resolve(p),
      );

      const result = await service.decideClinician('user-1', {
        outcome: 'REJECTED',
      });

      expect(result.verificationStatus).toBe('rejected');
    });

    it('throws NotFound when the clinician has no profile', async () => {
      clinicianProfileRepo.findOne.mockResolvedValue(undefined);

      await expect(
        service.decideClinician('ghost', { outcome: 'APPROVED' }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
