import { Test, TestingModule } from '@nestjs/testing';
import { ChildrenController } from './children.controller';
import { ChildrenService } from './children.service';

describe('ChildrenController', () => {
  let controller: ChildrenController;
  let service: Partial<ChildrenService>;

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      addAllergy: jest.fn(),
      addMedicalCondition: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      findUnifiedRecords: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChildrenController],
      providers: [
        { provide: ChildrenService, useValue: service },
      ],
    }).compile();

    controller = module.get<ChildrenController>(ChildrenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create', async () => {
      const dto = { firstName: 'Jane' };
      await controller.create(dto as any);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('getUnifiedRecords', () => {
    it('should call service.findUnifiedRecords', async () => {
      await controller.getUnifiedRecords('123');
      expect(service.findUnifiedRecords).toHaveBeenCalledWith('123');
    });
  });
});
