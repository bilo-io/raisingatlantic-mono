import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/users.model';
import { UserRole } from '../users/constants';
import { ResourceStatus } from '../common/enums';
import { GrowthRecord, CompletedMilestone, CompletedVaccination } from '../children/children.model';

@Injectable()
export class VerificationsService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(GrowthRecord) private readonly growthRepo: Repository<GrowthRecord>,
    @InjectRepository(CompletedMilestone) private readonly milestoneRepo: Repository<CompletedMilestone>,
    @InjectRepository(CompletedVaccination) private readonly vaccineRepo: Repository<CompletedVaccination>,
  ) {}

  async findAllCliniciansForVerification(): Promise<User[]> {
    return this.userRepo.find({
      where: {
        role: UserRole.CLINICIAN,
        // We could assume PENDING_ASSESSMENT is the verification state
        // or just return all to filter in the UI if needed
      },
    });
  }

  async findAllRecordsForVerification(): Promise<any[]> {
    // For now, return all records with PENDING_ASSESSMENT
    const growth = await this.growthRepo.find({
      where: { status: ResourceStatus.PENDING_ASSESSMENT },
      relations: ['child'],
    });
    const milestones = await this.milestoneRepo.find({
      where: { status: ResourceStatus.PENDING_ASSESSMENT },
      relations: ['child'],
    });
    const vaccinations = await this.vaccineRepo.find({
      where: { status: ResourceStatus.PENDING_ASSESSMENT },
      relations: ['child'],
    });

    return [
      ...growth.map(r => ({ ...r, type: 'Growth' })),
      ...milestones.map(r => ({ ...r, type: 'Milestone' })),
      ...vaccinations.map(r => ({ ...r, type: 'Vaccination' })),
    ];
  }
}
