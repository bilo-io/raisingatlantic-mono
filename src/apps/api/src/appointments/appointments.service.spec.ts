import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppointmentsService } from './appointments.service';
import { Appointment } from './appointments.model';
import { Child } from '../children/children.model';
import { User } from '../users/users.model';
import { Practice } from '../practices/practices.model';
import { NotFoundException } from '@nestjs/common';
import { createMockRepository } from '../common/test/test-utils';

describe('AppointmentsService', () => {
  let service: AppointmentsService;
  let appointmentsRepo: any;
  let childrenRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        { provide: getRepositoryToken(Appointment), useValue: createMockRepository() },
        { provide: getRepositoryToken(Child), useValue: createMockRepository() },
        { provide: getRepositoryToken(User), useValue: createMockRepository() },
        { provide: getRepositoryToken(Practice), useValue: createMockRepository() },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
    appointmentsRepo = module.get(getRepositoryToken(Appointment));
    childrenRepo = module.get(getRepositoryToken(Child));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an appointment', async () => {
      const dto = { childId: 'c1', scheduledAt: '2023-01-01', status: 'Pending' };
      childrenRepo.findOne.mockResolvedValue({ id: 'c1' });
      appointmentsRepo.create.mockReturnValue(dto);
      appointmentsRepo.save.mockResolvedValue({ id: 'a1', ...dto });

      const result = await service.create(dto as any);
      expect(result.id).toBe('a1');
      expect(childrenRepo.findOne).toHaveBeenCalled();
    });

    it('should throw NotFoundException if child not found', async () => {
      childrenRepo.findOne.mockResolvedValue(null);
      await expect(service.create({ childId: 'invalid' } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if appointment not found', async () => {
      appointmentsRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne('id')).rejects.toThrow(NotFoundException);
    });
  });
});
