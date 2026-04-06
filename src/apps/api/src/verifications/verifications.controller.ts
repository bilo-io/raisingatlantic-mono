import { Controller, Get } from '@nestjs/common';
import { VerificationsService } from './verifications.service';

@Controller('verifications')
export class VerificationsController {
  constructor(private readonly verificationsService: VerificationsService) {}

  @Get('clinicians')
  findAllClinicians() {
    return this.verificationsService.findAllCliniciansForVerification();
  }

  @Get('records')
  findAllRecords() {
    return this.verificationsService.findAllRecordsForVerification();
  }
}
