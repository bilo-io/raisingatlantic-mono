import { Test, TestingModule } from '@nestjs/testing';
import { PracticesController } from './practices.controller';
import { PracticesService } from './practices.service';

describe('PracticesController', () => {
  let controller: PracticesController;
  let service: Partial<PracticesService>;

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findAllPublic: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PracticesController],
      providers: [
        { provide: PracticesService, useValue: service },
      ],
    }).compile();

    controller = module.get<PracticesController>(PracticesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAllPublic', () => {
    it('should call service.findAllPublic', async () => {
      await controller.findAllPublic();
      expect(service.findAllPublic).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call service.findOne', async () => {
      await controller.findOne('123');
      expect(service.findOne).toHaveBeenCalledWith('123');
    });
  });
});
