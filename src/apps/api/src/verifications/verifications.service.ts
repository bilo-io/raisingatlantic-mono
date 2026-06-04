import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/users.model';
import { UserRole } from '../users/constants';
import { ResourceStatus } from '../common/enums';
import {
  GrowthRecord,
  CompletedMilestone,
  CompletedVaccination,
} from '../children/children.model';
import { IMetricService } from '@core/telemetry/interfaces/metric.interface';

// TODO(phase-8): when approve/reject mutation endpoints land here, inject
// INotificationDispatcher (NOTIFICATION_TOKENS.Dispatcher) and email the
// submitter on status change — see DEV.md §8.1 / §2.3 clinician verification.

@Injectable()
export class VerificationsService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(GrowthRecord)
    private readonly growthRepo: Repository<GrowthRecord>,
    @InjectRepository(CompletedMilestone)
    private readonly milestoneRepo: Repository<CompletedMilestone>,
    @InjectRepository(CompletedVaccination)
    private readonly vaccineRepo: Repository<CompletedVaccination>,
    @Inject('IMetricService') private readonly metric: IMetricService,
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

    const records = [
      ...growth.map((r) => ({ ...r, type: 'Growth' })),
      ...milestones.map((r) => ({ ...r, type: 'Milestone' })),
      ...vaccinations.map((r) => ({ ...r, type: 'Vaccination' })),
    ];

    // Business metric (DEV.md §7.2): pending-verification queue depth.
    // Recorded each time the verification queue is fetched; Cloud Monitoring's
    // `business_metrics` dashboard aggregates with ALIGN_MEAN over 5min.
    this.metric.recordValue('ra_verifications_pending', records.length, {
      type: 'all',
    });
    this.metric.recordValue('ra_verifications_pending', growth.length, {
      type: 'growth',
    });
    this.metric.recordValue('ra_verifications_pending', milestones.length, {
      type: 'milestone',
    });
    this.metric.recordValue('ra_verifications_pending', vaccinations.length, {
      type: 'vaccination',
    });

    return records;
  }
}
