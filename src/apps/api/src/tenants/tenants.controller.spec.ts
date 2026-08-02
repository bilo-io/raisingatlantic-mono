import { Test, TestingModule } from '@nestjs/testing';
import { TenantsController } from './tenants.controller';
import { TenantsService } from './tenants.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

describe('TenantsController', () => {
  let controller: TenantsController;
  let service: jest.Mocked<TenantsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantsController],
      providers: [
        {
          provide: TenantsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(TenantsController);
    service = module.get(TenantsService);
  });

  it('create delegates to the service', async () => {
    const dto = { name: 'Acme' } as any;
    const saved = { id: 't-1', ...dto };
    service.create.mockResolvedValue(saved);

    await expect(controller.create(dto)).resolves.toEqual(saved);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('findAll returns the list from the service', async () => {
    const list = [{ id: 't-1' }] as any;
    service.findAll.mockResolvedValue(list);
    await expect(controller.findAll()).resolves.toBe(list);
  });

  it('findOne forwards the id', async () => {
    const t = { id: 't-1' } as any;
    service.findOne.mockResolvedValue(t);
    await expect(controller.findOne('t-1')).resolves.toBe(t);
    expect(service.findOne).toHaveBeenCalledWith('t-1');
  });

  it('update forwards id + dto', async () => {
    const dto = { name: 'New' } as any;
    const t = { id: 't-1', name: 'New' } as any;
    service.update.mockResolvedValue(t);
    await expect(controller.update('t-1', dto)).resolves.toBe(t);
    expect(service.update).toHaveBeenCalledWith('t-1', dto);
  });

  it('remove forwards the id and resolves void', async () => {
    service.remove.mockResolvedValue(undefined);
    await expect(controller.remove('t-1')).resolves.toBeUndefined();
    expect(service.remove).toHaveBeenCalledWith('t-1');
  });
});
