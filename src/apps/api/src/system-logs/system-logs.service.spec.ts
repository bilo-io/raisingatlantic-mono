import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SystemLogsService } from './system-logs.service';
import { SystemLog } from '../common/models/system-log.model';
import { createMockRepository } from '../common/test/test-utils';

describe('SystemLogsService', () => {
  let service: SystemLogsService;
  let repo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SystemLogsService,
        {
          provide: getRepositoryToken(SystemLog),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get(SystemLogsService);
    repo = module.get(getRepositoryToken(SystemLog));
  });

  describe('createLog', () => {
    it('builds and saves a SystemLog from the data', async () => {
      const data = { type: 'TEST', message: 'hello', ipAddress: '10.0.0.1' };
      const entity = { id: 'l-1', ...data };
      repo.create.mockReturnValue(entity);
      repo.save.mockResolvedValue(entity);

      await expect(service.createLog(data)).resolves.toEqual(entity);
      expect(repo.create).toHaveBeenCalledWith(data);
      expect(repo.save).toHaveBeenCalledWith(entity);
    });
  });

  describe('findAll', () => {
    it('returns up to 100 logs ordered by createdAt desc', async () => {
      const logs = [{ id: '1' }, { id: '2' }];
      repo.find.mockResolvedValue(logs);

      await expect(service.findAll()).resolves.toBe(logs);
      expect(repo.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
        take: 100,
      });
    });
  });
});
