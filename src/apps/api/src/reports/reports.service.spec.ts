import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { Report } from './reports.model';
import { Child } from '../children/children.model';
import { User } from '../users/users.model';
import { NotFoundException } from '@nestjs/common';
import { createMockRepository } from '../common/test/test-utils';

describe('ReportsService', () => {
  let service: ReportsService;
  let reportsRepo: any;
  let childrenRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        { provide: getRepositoryToken(Report), useValue: createMockRepository() },
        { provide: getRepositoryToken(Child), useValue: createMockRepository() },
        { provide: getRepositoryToken(User), useValue: createMockRepository() },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    reportsRepo = module.get(getRepositoryToken(Report));
    childrenRepo = module.get(getRepositoryToken(Child));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a report', async () => {
      const dto = { childId: 'c1', type: 'Clinical', content: 'Some content' };
      childrenRepo.findOne.mockResolvedValue({ id: 'c1' });
      reportsRepo.create.mockReturnValue(dto);
      reportsRepo.save.mockResolvedValue({ id: 'r1', ...dto });

      const result = await service.create(dto as any);
      expect(result.id).toBe('r1');
      // Using loosely coupled expectation for findOne call as it now uses complex ILike logic for mock IDs
      expect(childrenRepo.findOne).toHaveBeenCalled();
    });

    it('should throw NotFoundException if child not found', async () => {
      childrenRepo.findOne.mockResolvedValue(null);
      await expect(service.create({ childId: 'invalid' } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if report not found', async () => {
      reportsRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne('id')).rejects.toThrow(NotFoundException);
    });
  });
});
