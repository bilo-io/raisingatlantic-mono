import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRole } from './constants';

describe('UsersController', () => {
  let controller: UsersController;
  let service: Partial<UsersService>;

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findCliniciansPublic: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: service },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create', async () => {
      const dto = { email: 'test@example.com', role: UserRole.PARENT };
      await controller.create(dto as any);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findCliniciansPublic', () => {
    it('should call service.findCliniciansPublic', async () => {
      await controller.findCliniciansPublic();
      expect(service.findCliniciansPublic).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call service.findOne', async () => {
      await controller.findOne('123');
      expect(service.findOne).toHaveBeenCalledWith('123');
    });
  });
});
