import { Test, TestingModule } from '@nestjs/testing';
import { MasterDataService } from './master-data.service';

describe('MasterDataService', () => {
  let service: MasterDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MasterDataService],
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
