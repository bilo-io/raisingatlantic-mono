import { Test, TestingModule } from '@nestjs/testing';
import { VerificationsController } from './verifications.controller';
import { VerificationsService } from './verifications.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

describe('VerificationsController', () => {
  let controller: VerificationsController;
  let service: jest.Mocked<VerificationsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VerificationsController],
      providers: [
        {
          provide: VerificationsService,
          useValue: {
            findAllCliniciansForVerification: jest.fn(),
            findAllRecordsForVerification: jest.fn(),
            decideRecord: jest.fn(),
            decideClinician: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(VerificationsController);
    service = module.get(VerificationsService);
  });

  it('GET /verifications/clinicians delegates to the service', async () => {
    const clinicians = [{ id: '1' }] as any;
    service.findAllCliniciansForVerification.mockResolvedValue(clinicians);

    await expect(controller.findAllClinicians()).resolves.toBe(clinicians);
    expect(service.findAllCliniciansForVerification).toHaveBeenCalledTimes(1);
  });

  it('GET /verifications/records delegates to the service', async () => {
    const records = [{ id: 'g1', type: 'Growth' }] as any;
    service.findAllRecordsForVerification.mockResolvedValue(records);

    await expect(controller.findAllRecords()).resolves.toBe(records);
    expect(service.findAllRecordsForVerification).toHaveBeenCalledTimes(1);
  });

  it('PATCH /verifications/records/:id delegates the decision (with actor) to the service', async () => {
    const updated = { id: 'g1', status: 'Active' } as any;
    service.decideRecord.mockResolvedValue(updated);
    const req = { user: { sub: 'clin-1', role: 'clinician' } } as any;

    await expect(
      controller.decideRecord('g1', { outcome: 'APPROVED' }, req),
    ).resolves.toBe(updated);
    expect(service.decideRecord).toHaveBeenCalledWith(
      'g1',
      { outcome: 'APPROVED' },
      { userId: 'clin-1', role: 'clinician' },
    );
  });

  it('PATCH /verifications/clinicians/:id delegates the decision to the service', async () => {
    const updated = { id: 'cp1', verificationStatus: 'verified' } as any;
    service.decideClinician.mockResolvedValue(updated);

    await expect(
      controller.decideClinician('user-1', { outcome: 'APPROVED' }),
    ).resolves.toBe(updated);
    expect(service.decideClinician).toHaveBeenCalledWith('user-1', {
      outcome: 'APPROVED',
    });
  });
});
