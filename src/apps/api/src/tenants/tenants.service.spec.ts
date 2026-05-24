import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { Tenant } from './tenants.model';
import {
  createMockRepository,
  createMockLogger,
  createMockTracer,
  createMockMetrics,
  createMockErrorReporter,
} from '../common/test/test-utils';

describe('TenantsService', () => {
  let service: TenantsService;
  let repo: any;
  let errorReporter: any;

  beforeEach(async () => {
    const mockRepo = createMockRepository();
    // Add findOneBy used by the service
    (mockRepo as any).findOneBy = jest.fn();

    errorReporter = createMockErrorReporter();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantsService,
        { provide: getRepositoryToken(Tenant), useValue: mockRepo },
        { provide: 'ILoggerService', useValue: createMockLogger() },
        { provide: 'ITracingService', useValue: createMockTracer() },
        { provide: 'IMetricService', useValue: createMockMetrics() },
        { provide: 'IErrorReportingService', useValue: errorReporter },
      ],
    }).compile();

    service = module.get(TenantsService);
    repo = module.get(getRepositoryToken(Tenant));
  });

  it('is defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('persists and returns a new tenant', async () => {
      const dto = { name: 'Acme Health' } as any;
      const created = { id: 't-1', ...dto };
      repo.create.mockReturnValue(created);
      repo.save.mockResolvedValue(created);

      await expect(service.create(dto)).resolves.toEqual(created);
      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalledWith(created);
    });

    it('reports the error and rethrows when save fails', async () => {
      const dto = { name: 'Broken' } as any;
      repo.create.mockReturnValue(dto);
      repo.save.mockRejectedValue(new Error('constraint'));

      await expect(service.create(dto)).rejects.toThrow('constraint');
      expect(errorReporter.reportException).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('returns the full list', async () => {
      const list = [{ id: 't-1' }];
      repo.find.mockResolvedValue(list);
      await expect(service.findAll()).resolves.toBe(list);
    });
  });

  describe('findOne', () => {
    it('returns the matching tenant', async () => {
      const t = { id: 't-1', name: 'Acme' };
      repo.findOneBy.mockResolvedValue(t);
      await expect(service.findOne('t-1')).resolves.toEqual(t);
      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 't-1' });
    });

    it('throws NotFoundException when missing', async () => {
      repo.findOneBy.mockResolvedValue(null);
      await expect(service.findOne('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('merges and saves the updated tenant', async () => {
      const existing = { id: 't-1', name: 'Old' };
      const dto = { name: 'New' } as any;
      const merged = { id: 't-1', name: 'New' };
      repo.findOneBy.mockResolvedValue(existing);
      repo.merge.mockReturnValue(merged);
      repo.save.mockResolvedValue(merged);

      await expect(service.update('t-1', dto)).resolves.toEqual(merged);
      expect(repo.merge).toHaveBeenCalledWith(existing, dto);
    });

    it('propagates NotFoundException from findOne', async () => {
      repo.findOneBy.mockResolvedValue(null);
      await expect(service.update('missing', {} as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('removes the tenant when it exists', async () => {
      const t = { id: 't-1' };
      repo.findOneBy.mockResolvedValue(t);
      repo.remove.mockResolvedValue(undefined);

      await expect(service.remove('t-1')).resolves.toBeUndefined();
      expect(repo.remove).toHaveBeenCalledWith(t);
    });

    it('throws NotFoundException for unknown id', async () => {
      repo.findOneBy.mockResolvedValue(null);
      await expect(service.remove('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
