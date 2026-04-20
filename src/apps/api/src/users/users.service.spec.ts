import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './users.model';
import { UserRole } from './constants';
import { NotFoundException } from '@nestjs/common';
import { createMockRepository, createMockLogger, createMockTracer, createMockMetrics, createMockErrorReporter } from '../common/test/test-utils';

describe('UsersService', () => {
  let service: UsersService;
  let repository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: createMockRepository(),
        },
        { provide: 'ILoggerService', useValue: createMockLogger() },
        { provide: 'ITracingService', useValue: createMockTracer() },
        { provide: 'IMetricService', useValue: createMockMetrics() },
        { provide: 'IErrorReportingService', useValue: createMockErrorReporter() },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a user', async () => {
      const dto = { email: 'test@example.com', phone: '1234567890', role: UserRole.PARENT };
      const user = { id: 'uuid', ...dto };
      repository.create.mockReturnValue(user);
      repository.save.mockResolvedValue(user);

      const result = await service.create(dto as any);

      expect(result).toEqual(user);
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const validUuid = '550e8400-e29b-41d4-a716-446655440000';
      const user = { id: validUuid, email: 'test@example.com' };
      repository.findOne.mockResolvedValue(user);

      const result = await service.findOne(validUuid);

      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('uuid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findCliniciansPublic', () => {
    it('should return masked clinicians', async () => {
      const clinicians = [
        { id: '1', email: 'clinician1@example.com', phone: '0821234567', role: UserRole.CLINICIAN },
      ];
      repository.find.mockResolvedValue(clinicians);

      const result = await service.findCliniciansPublic();

      expect(result[0].email).toContain('***');
      expect(result[0].phone).toContain('***');
      expect(repository.find).toHaveBeenCalledWith(expect.objectContaining({
        where: { role: UserRole.CLINICIAN }
      }));
    });
  });
});
