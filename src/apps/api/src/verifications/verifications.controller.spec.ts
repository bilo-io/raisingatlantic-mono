import { Test, TestingModule } from '@nestjs/testing';
import { VerificationsController } from './verifications.controller';
import { VerificationsService } from './verifications.service';

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
          },
        },
      ],
    }).compile();

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
});
