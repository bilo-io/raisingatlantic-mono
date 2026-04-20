import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MasterDataService } from './master-data.service';
import { GrowthRecord, CompletedMilestone, CompletedVaccination } from '../children/children.model';
import { createMockRepository } from '../common/test/test-utils';

describe('MasterDataService', () => {
  let service: MasterDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MasterDataService,
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
      ],
    }).compile();

    service = module.get<MasterDataService>(MasterDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return milestones', () => {
    const milestones = service.findAllMilestones();
    expect(milestones.length).toBeGreaterThan(0);
    expect(milestones[0]).toHaveProperty('age');
    expect(milestones[0]).toHaveProperty('milestones');
  });

  it('should return vaccinations', () => {
    const vaccinations = service.findAllVaccinations();
    expect(vaccinations.length).toBeGreaterThan(0);
    expect(vaccinations[0]).toHaveProperty('name');
  });
});
