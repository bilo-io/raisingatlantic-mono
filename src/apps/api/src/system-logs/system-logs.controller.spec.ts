import { Test, TestingModule } from '@nestjs/testing';
import { SystemLogsController } from './system-logs.controller';
import { SystemLogsService } from './system-logs.service';

describe('SystemLogsController', () => {
  let controller: SystemLogsController;
  let service: jest.Mocked<SystemLogsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SystemLogsController],
      providers: [
        { provide: SystemLogsService, useValue: { findAll: jest.fn() } },
      ],
    }).compile();

    controller = module.get(SystemLogsController);
    service = module.get(SystemLogsService);
  });

  it('GET / returns the service results', async () => {
    const logs = [{ id: '1' }] as any;
    service.findAll.mockResolvedValue(logs);
    await expect(controller.findAll()).resolves.toBe(logs);
  });
});
