import { Controller, Get } from '@nestjs/common';
import { MasterDataService, MilestoneAgeGroup, Vaccination } from './master-data.service';

@Controller('records')
export class MasterDataController {
  constructor(private readonly masterDataService: MasterDataService) {}

  @Get('milestones')
  findAllMilestones(): MilestoneAgeGroup[] {
    return this.masterDataService.findAllMilestones();
  }

  @Get('vaccinations')
  findAllVaccinations(): Vaccination[] {
    return this.masterDataService.findAllVaccinations();
  }
}
