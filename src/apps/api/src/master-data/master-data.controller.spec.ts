import { Test, TestingModule } from '@nestjs/testing';
import { MasterDataController } from './master-data.controller';
import { MasterDataService } from './master-data.service';

describe('MasterDataController', () => {
  let controller: MasterDataController;
  let service: Partial<MasterDataService>;

  beforeEach(async () => {
    service = {
      findAllMilestones: jest.fn(),
      findAllVaccinations: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MasterDataController],
      providers: [
        { provide: MasterDataService, useValue: service },
      ],
    }).compile();

    controller = module.get<MasterDataController>(MasterDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAllMilestones', () => {
    it('should call service.findAllMilestones', () => {
      controller.findAllMilestones();
      expect(service.findAllMilestones).toHaveBeenCalled();
    });
  });

  describe('findAllVaccinations', () => {
    it('should call service.findAllVaccinations', () => {
      controller.findAllVaccinations();
      expect(service.findAllVaccinations).toHaveBeenCalled();
    });
  });
});
