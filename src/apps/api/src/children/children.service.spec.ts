import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChildrenService } from './children.service';
import { Child, GrowthRecord, CompletedMilestone, CompletedVaccination, Allergy, MedicalCondition } from './children.model';
import { User } from '../users/users.model';
import { NotFoundException } from '@nestjs/common';
import { createMockRepository, createMockLogger, createMockTracer, createMockMetrics, createMockErrorReporter } from '../common/test/test-utils';

describe('ChildrenService', () => {
  let service: ChildrenService;
  let childRepo: any;
  let userRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChildrenService,
        { provide: getRepositoryToken(Child), useValue: createMockRepository() },
        { provide: getRepositoryToken(GrowthRecord), useValue: createMockRepository() },
        { provide: getRepositoryToken(CompletedMilestone), useValue: createMockRepository() },
        { provide: getRepositoryToken(CompletedVaccination), useValue: createMockRepository() },
        { provide: getRepositoryToken(Allergy), useValue: createMockRepository() },
        { provide: getRepositoryToken(MedicalCondition), useValue: createMockRepository() },
        { provide: getRepositoryToken(User), useValue: createMockRepository() },
        { provide: 'ILoggerService', useValue: createMockLogger() },
        { provide: 'ITracingService', useValue: createMockTracer() },
        { provide: 'IMetricService', useValue: createMockMetrics() },
        { provide: 'IErrorReportingService', useValue: createMockErrorReporter() },
      ],
    }).compile();

    service = module.get<ChildrenService>(ChildrenService);
    childRepo = module.get(getRepositoryToken(Child));
    userRepo = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a child', async () => {
      const dto = { firstName: 'Jane', lastName: 'Doe', parentId: 'p1' };
      userRepo.findOne.mockResolvedValue({ id: 'p1', name: 'Parent One' });
      childRepo.create.mockReturnValue(dto);
      childRepo.save.mockResolvedValue({ id: 'c1', ...dto });

      const result = await service.create(dto as any);
      expect(result.id).toBe('c1');
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if child not found', async () => {
      childRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne('id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findUnifiedRecords', () => {
    it('should return combined and sorted records', async () => {
      const child = {
        id: 'c1',
        growthRecords: [{ date: '2023-01-01', value: 10 }],
        completedMilestones: [{ dateAchieved: '2023-02-01', name: 'Walk' }],
        completedVaccinations: [],
        allergies: [],
        medicalConditions: [],
      };
      childRepo.findOne.mockResolvedValue(child);

      const result = await service.findUnifiedRecords('c1');
      expect(result).toHaveLength(2);
      expect(result[0].type).toBe('Milestone'); // Latest first
      expect(result[1].type).toBe('Growth');
    });
  });
});
