import { Test, TestingModule } from '@nestjs/testing';
import { ThrottlerGuard } from '@nestjs/throttler';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';

describe('LeadsController', () => {
  let controller: LeadsController;
  let service: jest.Mocked<LeadsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeadsController],
      providers: [{ provide: LeadsService, useValue: { create: jest.fn() } }],
    })
      .overrideGuard(ThrottlerGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(LeadsController);
    service = module.get(LeadsService);
  });

  it('forwards body + ip from req', async () => {
    const dto = { email: 'x@y.com', message: 'Hello there' } as any;
    const req = { ip: '203.0.113.5' } as any;
    service.create.mockResolvedValue({ ok: true } as any);

    await expect(controller.create(dto, req)).resolves.toEqual({ ok: true });
    expect(service.create).toHaveBeenCalledWith(dto, '203.0.113.5');
  });

  it('passes undefined ip if not present', async () => {
    const dto = { email: 'x@y.com', message: 'Hello there' } as any;
    const req = {} as any;
    service.create.mockResolvedValue({ ok: true } as any);

    await controller.create(dto, req);
    expect(service.create).toHaveBeenCalledWith(dto, undefined);
  });
});
