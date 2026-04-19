import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PracticesService } from './practices.service';
import { Practice } from './practices.model';
import { NotFoundException } from '@nestjs/common';
import { ResourceStatus } from '../common/enums';
import { createMockRepository, createMockLogger, createMockTracer, createMockMetrics, createMockErrorReporter } from '../common/test/test-utils';

describe('PracticesService', () => {
  let service: PracticesService;
  let repository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PracticesService,
        {
          provide: getRepositoryToken(Practice),
          useValue: createMockRepository(),
        },
        { provide: 'ILoggerService', useValue: createMockLogger() },
        { provide: 'ITracingService', useValue: createMockTracer() },
        { provide: 'IMetricService', useValue: createMockMetrics() },
        { provide: 'IErrorReportingService', useValue: createMockErrorReporter() },
      ],
    }).compile();

    service = module.get<PracticesService>(PracticesService);
    repository = module.get(getRepositoryToken(Practice));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllPublic', () => {
    it('should return masked practices', async () => {
      const practices = [
        { id: '1', name: 'Practice 1', manager: 'John Doe', email: 'john@example.com', status: ResourceStatus.ACTIVE },
      ];
      repository.find.mockResolvedValue(practices);

      const result = await service.findAllPublic();

      expect(result[0].manager).toBe('Restricted Access');
      expect(result[0].email).toBe('Restricted Access');
      expect(repository.find).toHaveBeenCalledWith(expect.objectContaining({
        where: { status: ResourceStatus.ACTIVE }
      }));
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if practice not found', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.findOne('id')).rejects.toThrow(NotFoundException);
    });
  });
});
