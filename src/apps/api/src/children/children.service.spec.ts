import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { ChildrenService } from './children.service';
import {
  Child,
  GrowthRecord,
  CompletedMilestone,
  CompletedVaccination,
  Allergy,
  MedicalCondition,
} from './children.model';
import { User } from '../users/users.model';
import { UserRole } from '../users/constants';
import { ResourceStatus } from '../common/enums';
import {
  createMockRepository,
  createMockLogger,
  createMockTracer,
  createMockMetrics,
  createMockErrorReporter,
} from '../common/test/test-utils';
import { NOTIFICATION_TOKENS } from '@core/notifications/interfaces/tokens';

const createMockDispatcher = () => ({
  email: jest.fn().mockResolvedValue({ delivered: true, providerId: 'mock' }),
  sms: jest.fn().mockResolvedValue({ delivered: true, providerId: 'mock' }),
  push: jest.fn().mockResolvedValue({ delivered: true, providerId: 'mock' }),
  notifyUser: jest.fn(),
});

describe('ChildrenService', () => {
  let service: ChildrenService;
  let childRepo: any;
  let vaccineRepo: any;
  let growthRepo: any;
  let milestoneRepo: any;
  let allergyRepo: any;
  let conditionRepo: any;
  let userRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChildrenService,
        {
          provide: getRepositoryToken(Child),
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
        {
          provide: getRepositoryToken(Allergy),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(MedicalCondition),
          useValue: createMockRepository(),
        },
        { provide: getRepositoryToken(User), useValue: createMockRepository() },
        { provide: 'ILoggerService', useValue: createMockLogger() },
        { provide: 'ITracingService', useValue: createMockTracer() },
        { provide: 'IMetricService', useValue: createMockMetrics() },
        {
          provide: 'IErrorReportingService',
          useValue: createMockErrorReporter(),
        },
        {
          provide: NOTIFICATION_TOKENS.Dispatcher,
          useValue: createMockDispatcher(),
        },
      ],
    }).compile();

    service = module.get<ChildrenService>(ChildrenService);
    childRepo = module.get(getRepositoryToken(Child));
    vaccineRepo = module.get(getRepositoryToken(CompletedVaccination));
    growthRepo = module.get(getRepositoryToken(GrowthRecord));
    milestoneRepo = module.get(getRepositoryToken(CompletedMilestone));
    allergyRepo = module.get(getRepositoryToken(Allergy));
    conditionRepo = module.get(getRepositoryToken(MedicalCondition));
    userRepo = module.get(getRepositoryToken(User));
  });

  it('is defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const baseDto = {
      parentId: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Junior Doe',
      firstName: 'Junior',
      lastName: 'Doe',
      gender: 'male',
      dateOfBirth: '2024-01-01',
    } as any;

    it('creates a child when the parent is found by UUID', async () => {
      const parent = { id: baseDto.parentId, name: 'Parent' };
      userRepo.findOne.mockResolvedValueOnce(parent);
      const created = { ...baseDto, parent };
      childRepo.create.mockReturnValue(created);
      childRepo.save.mockResolvedValue({ id: 'c-1', ...created });

      const result = await service.create(baseDto);

      expect(result.id).toBe('c-1');
      expect(userRepo.findOne).toHaveBeenCalledWith({
        where: { id: baseDto.parentId },
      });
      expect(childRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ parent, clinician: undefined }),
      );
    });

    it('falls back to slug lookup when parentId is not a UUID', async () => {
      const parent = { id: 'pp', name: 'Jane Doe' };
      userRepo.findOne.mockResolvedValueOnce(parent);
      childRepo.create.mockReturnValue({});
      childRepo.save.mockResolvedValue({ id: 'c-2' });

      await service.create({ ...baseDto, parentId: 'parent-jane-doe' });

      expect(userRepo.findOne).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.any(Array) }),
      );
    });

    it('throws NotFoundException when the parent cannot be resolved', async () => {
      userRepo.findOne.mockResolvedValueOnce(null);
      await expect(service.create(baseDto)).rejects.toThrow(NotFoundException);
    });

    it('attaches a clinician when clinicianId is supplied and found', async () => {
      const parent = { id: baseDto.parentId };
      const clinician = { id: 'clin-uuid', name: 'Dr Smith' };
      userRepo.findOne
        .mockResolvedValueOnce(parent)
        .mockResolvedValueOnce(clinician);
      childRepo.create.mockImplementation((x: any) => x);
      childRepo.save.mockResolvedValue({ id: 'c-3' });

      await service.create({
        ...baseDto,
        clinicianId: '550e8400-e29b-41d4-a716-446655440099',
      });

      expect(childRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ clinician }),
      );
    });

    it('leaves clinician undefined when clinicianId is supplied but not found', async () => {
      userRepo.findOne
        .mockResolvedValueOnce({ id: baseDto.parentId })
        .mockResolvedValueOnce(null);
      childRepo.create.mockImplementation((x: any) => x);
      childRepo.save.mockResolvedValue({ id: 'c-4' });

      await service.create({
        ...baseDto,
        clinicianId: '550e8400-e29b-41d4-a716-446655440099',
      });

      expect(childRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ clinician: undefined }),
      );
    });
  });

  describe('findAll', () => {
    it('builds a query without filters', async () => {
      const list = [{ id: 'c-1' }];
      childRepo.createQueryBuilder().getMany.mockResolvedValue(list);

      await expect(service.findAll()).resolves.toBe(list);
      expect(childRepo.createQueryBuilder).toHaveBeenCalled();
    });

    it('applies a tenant UUID filter via andWhere', async () => {
      const qb = childRepo.createQueryBuilder();
      qb.getMany.mockResolvedValue([]);

      await service.findAll({
        tenantId: '550e8400-e29b-41d4-a716-446655440000',
      });

      expect(qb.andWhere).toHaveBeenCalledWith(
        'tenant.id = :tenantId',
        expect.objectContaining({
          tenantId: '550e8400-e29b-41d4-a716-446655440000',
        }),
      );
    });

    it('applies a clinician email filter when clinicianId looks like an email', async () => {
      const qb = childRepo.createQueryBuilder();
      qb.getMany.mockResolvedValue([]);

      await service.findAll({ clinicianId: 'dr.smith@clinician.com' });

      expect(qb.andWhere).toHaveBeenCalledWith(
        'clinician.email = :email',
        expect.objectContaining({ email: 'dr.smith@clinician.com' }),
      );
    });
  });

  describe('findOne', () => {
    it('returns the child when found by UUID', async () => {
      const child = { id: '550e8400-e29b-41d4-a716-446655440000' };
      childRepo.findOne.mockResolvedValue(child);
      await expect(service.findOne(child.id)).resolves.toBe(child);
    });

    it('falls back to slug search when id is not a UUID', async () => {
      childRepo.findOne.mockResolvedValue({ id: 'c-slug' });
      const result = await service.findOne('junior-doe');
      expect(result.id).toBe('c-slug');
      // The non-UUID branch passes an array of where clauses
      expect(childRepo.findOne).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.any(Array) }),
      );
    });

    it('throws NotFoundException when missing', async () => {
      childRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('addAllergy', () => {
    it('attaches and saves the allergy onto the resolved child', async () => {
      const child = OWNED_CHILD;
      childRepo.findOne.mockResolvedValue(child);
      const dto = { name: 'Peanuts' } as any;
      const entity = { id: 'a-1', ...dto, child };
      allergyRepo.create.mockReturnValue(entity);
      allergyRepo.save.mockResolvedValue(entity);

      await expect(service.addAllergy('c-1', dto)).resolves.toEqual(entity);
      expect(allergyRepo.create).toHaveBeenCalledWith({ ...dto, child });
    });
  });

  const CLINICIAN_ACTOR = { userId: 'clin-1', role: UserRole.CLINICIAN };
  const PARENT_ACTOR = { userId: 'parent-1', role: UserRole.PARENT };
  // Child owned by PARENT_ACTOR and assigned to CLINICIAN_ACTOR, so both pass
  // the ownership guard.
  const OWNED_CHILD = {
    id: 'c-1',
    parent: { id: 'parent-1' },
    clinician: { id: 'clin-1' },
  };

  describe('addCompletedVaccination', () => {
    it('a clinician-logged vaccination is CLINICIAN-sourced, auto-verified and attributed', async () => {
      const child = OWNED_CHILD;
      childRepo.findOne.mockResolvedValue(child);
      vaccineRepo.create.mockImplementation((x: any) => x);
      vaccineRepo.save.mockImplementation((x: any) =>
        Promise.resolve({ id: 'v-1', ...x }),
      );

      const result = await service.addCompletedVaccination(
        'c-1',
        { vaccineId: 'hexaxim3', dateAdministered: '2024-11-26' },
        CLINICIAN_ACTOR,
      );

      expect(result).toEqual(
        expect.objectContaining({
          source: 'CLINICIAN',
          status: ResourceStatus.ACTIVE,
          recordedBy: { id: 'clin-1' },
          dateAdministered: expect.any(Date),
        }),
      );
    });

    it('a parent-logged vaccination is PARENT-sourced and Pending Assessment', async () => {
      const child = OWNED_CHILD;
      childRepo.findOne.mockResolvedValue(child);
      vaccineRepo.create.mockImplementation((x: any) => x);
      vaccineRepo.save.mockImplementation((x: any) => Promise.resolve(x));

      const result = await service.addCompletedVaccination(
        'c-1',
        {
          vaccineId: 'opv',
          dateAdministered: '2024-11-26',
          expiryDate: '2025-08-01',
        },
        PARENT_ACTOR,
      );

      expect(result.source).toBe('PARENT');
      expect(result.status).toBe(ResourceStatus.PENDING_ASSESSMENT);
      expect(result.expiryDate).toBeInstanceOf(Date);
    });

    it('honours an explicit source override', async () => {
      childRepo.findOne.mockResolvedValue(OWNED_CHILD);
      vaccineRepo.create.mockImplementation((x: any) => x);
      vaccineRepo.save.mockImplementation((x: any) => Promise.resolve(x));

      const result = await service.addCompletedVaccination(
        'c-1',
        {
          vaccineId: 'opv',
          dateAdministered: '2024-11-26',
          source: 'PARENT',
        } as any,
        CLINICIAN_ACTOR,
      );

      expect(result.source).toBe('PARENT');
    });
  });

  describe('addGrowthRecord', () => {
    it('a clinician entry is auto-verified (Active) and attributed', async () => {
      childRepo.findOne.mockResolvedValue(OWNED_CHILD);
      growthRepo.create.mockImplementation((x: any) => x);
      growthRepo.save.mockImplementation((x: any) => Promise.resolve(x));

      const result = await service.addGrowthRecord(
        'c-1',
        { date: '2024-11-26', weight: '7.8' },
        CLINICIAN_ACTOR,
      );

      expect(result.status).toBe(ResourceStatus.ACTIVE);
      expect(result.recordedBy).toEqual({ id: 'clin-1' });
      expect(result.date).toBeInstanceOf(Date);
    });

    it('a parent entry lands in Pending Assessment', async () => {
      childRepo.findOne.mockResolvedValue(OWNED_CHILD);
      growthRepo.create.mockImplementation((x: any) => x);
      growthRepo.save.mockImplementation((x: any) => Promise.resolve(x));

      const result = await service.addGrowthRecord(
        'c-1',
        { date: '2024-11-26', weight: '7.8' },
        PARENT_ACTOR,
      );

      expect(result.status).toBe(ResourceStatus.PENDING_ASSESSMENT);
    });

    it('forbids a parent writing to a child they do not own', async () => {
      childRepo.findOne.mockResolvedValue({
        id: 'c-1',
        parent: { id: 'someone-else' },
        clinician: { id: 'clin-1' },
      });

      await expect(
        service.addGrowthRecord(
          'c-1',
          { date: '2024-11-26', weight: '7.8' },
          PARENT_ACTOR,
        ),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });
  });

  describe('addCompletedMilestone', () => {
    it('a clinician entry is auto-verified (Active) and attributed', async () => {
      childRepo.findOne.mockResolvedValue(OWNED_CHILD);
      milestoneRepo.create.mockImplementation((x: any) => x);
      milestoneRepo.save.mockImplementation((x: any) => Promise.resolve(x));

      const result = await service.addCompletedMilestone(
        'c-1',
        { milestoneId: 'locomotor.walking', dateAchieved: '2024-11-26' },
        CLINICIAN_ACTOR,
      );

      expect(result.status).toBe(ResourceStatus.ACTIVE);
      expect(result.recordedBy).toEqual({ id: 'clin-1' });
      expect(result.dateAchieved).toBeInstanceOf(Date);
    });

    it('a parent entry lands in Pending Assessment', async () => {
      childRepo.findOne.mockResolvedValue(OWNED_CHILD);
      milestoneRepo.create.mockImplementation((x: any) => x);
      milestoneRepo.save.mockImplementation((x: any) => Promise.resolve(x));

      const result = await service.addCompletedMilestone(
        'c-1',
        { milestoneId: 'locomotor.walking', dateAchieved: '2024-11-26' },
        PARENT_ACTOR,
      );

      expect(result.status).toBe(ResourceStatus.PENDING_ASSESSMENT);
    });
  });

  describe('addMedicalCondition', () => {
    it('saves the condition with an optional diagnosis date', async () => {
      childRepo.findOne.mockResolvedValue(OWNED_CHILD);
      conditionRepo.create.mockImplementation((x: any) => x);
      conditionRepo.save.mockImplementation((x: any) => Promise.resolve(x));

      const result = await service.addMedicalCondition('c-1', {
        name: 'Asthma',
        diagnosisDate: '2024-01-01',
      } as any);

      expect(result.diagnosisDate).toBeInstanceOf(Date);
    });

    it('leaves diagnosisDate undefined when not supplied', async () => {
      childRepo.findOne.mockResolvedValue(OWNED_CHILD);
      conditionRepo.create.mockImplementation((x: any) => x);
      conditionRepo.save.mockImplementation((x: any) => Promise.resolve(x));

      const result = await service.addMedicalCondition('c-1', {
        name: 'Eczema',
      } as any);
      expect(result.diagnosisDate).toBeUndefined();
    });
  });

  describe('update', () => {
    it('merges and saves', async () => {
      const child = { id: 'c-1', firstName: 'Old' };
      childRepo.findOne.mockResolvedValue(child);
      const merged = { ...child, firstName: 'New' };
      childRepo.merge.mockReturnValue(merged);
      childRepo.save.mockResolvedValue(merged);

      await expect(
        service.update('c-1', { firstName: 'New' } as any),
      ).resolves.toEqual(merged);
    });
  });

  describe('remove', () => {
    it('removes the resolved child', async () => {
      const child = OWNED_CHILD;
      childRepo.findOne.mockResolvedValue(child);
      childRepo.remove.mockResolvedValue(undefined);

      await expect(service.remove('c-1')).resolves.toBeUndefined();
      expect(childRepo.remove).toHaveBeenCalledWith(child);
    });
  });

  describe('findUnifiedRecords', () => {
    it('returns a combined, type-tagged, date-desc list', async () => {
      const child = {
        id: 'c1',
        growthRecords: [{ date: '2023-01-01', value: 10 }],
        completedMilestones: [{ dateAchieved: '2023-02-01', name: 'Walk' }],
        completedVaccinations: [{ dateAdministered: '2024-01-01' }],
        allergies: [],
        medicalConditions: [],
      };
      childRepo.findOne.mockResolvedValue(child);

      const result = await service.findUnifiedRecords('c1');

      expect(result.map((r: any) => r.type)).toEqual([
        'Vaccination',
        'Milestone',
        'Growth',
      ]);
    });

    it('handles a child with no records', async () => {
      childRepo.findOne.mockResolvedValue({
        id: 'c-empty',
        growthRecords: [],
        completedMilestones: [],
        completedVaccinations: [],
        allergies: [],
        medicalConditions: [],
      });
      await expect(service.findUnifiedRecords('c-empty')).resolves.toEqual([]);
    });
  });
});
