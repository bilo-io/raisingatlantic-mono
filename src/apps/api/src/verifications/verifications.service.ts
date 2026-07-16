import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/users.model';
import { ClinicianProfile } from '../users/clinician-profile.model';
import { UserRole } from '../users/constants';
import { ResourceStatus } from '../common/enums';
import {
  GrowthRecord,
  CompletedMilestone,
  CompletedVaccination,
} from '../children/children.model';
import { IMetricService } from '@core/telemetry/interfaces/metric.interface';
import { VerificationDecisionDto } from './dto/verification-decision.dto';

// TODO(phase-8): when notification dispatch lands, inject INotificationDispatcher
// (NOTIFICATION_TOKENS.Dispatcher) and email the submitter on status change —
// see DEV.md §8.1 / §2.3 clinician verification.

// APPROVED promotes a pending record to verified; REJECTED soft-archives it
// (soft-delete-first per CLAUDE.md); MORE_INFO leaves it pending for follow-up.
const RECORD_OUTCOME_STATUS: Record<
  VerificationDecisionDto['outcome'],
  ResourceStatus | null
> = {
  APPROVED: ResourceStatus.ACTIVE,
  REJECTED: ResourceStatus.ARCHIVED,
  MORE_INFO: null,
};

const CLINICIAN_OUTCOME_STATUS: Record<
  VerificationDecisionDto['outcome'],
  ClinicianProfile['verificationStatus']
> = {
  APPROVED: 'verified',
  REJECTED: 'rejected',
  MORE_INFO: 'pending',
};

// The authenticated caller making a verification decision.
export interface RecordActor {
  userId: string;
  role: UserRole;
}

@Injectable()
export class VerificationsService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(ClinicianProfile)
    private readonly clinicianProfileRepo: Repository<ClinicianProfile>,
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

  /**
   * Approve / reject / request-more-info on a parent-logged record. The record
   * id is unique across the three record tables, so we resolve it by probing
   * each repository in turn.
   */
  async decideRecord(
    id: string,
    dto: VerificationDecisionDto,
    actor?: RecordActor,
  ): Promise<GrowthRecord | CompletedMilestone | CompletedVaccination> {
    const nextStatus = RECORD_OUTCOME_STATUS[dto.outcome];
    const relations = ['child', 'child.clinician'];

    const growth = await this.growthRepo.findOne({ where: { id }, relations });
    if (growth) {
      this.assertActorMayDecideRecord(growth, actor);
      return this.applyRecordDecision(
        this.growthRepo,
        growth,
        nextStatus,
        dto.notes,
      );
    }

    const milestone = await this.milestoneRepo.findOne({
      where: { id },
      relations,
    });
    if (milestone) {
      this.assertActorMayDecideRecord(milestone, actor);
      return this.applyRecordDecision(
        this.milestoneRepo,
        milestone,
        nextStatus,
        dto.notes,
      );
    }

    const vaccination = await this.vaccineRepo.findOne({
      where: { id },
      relations,
    });
    if (vaccination) {
      this.assertActorMayDecideRecord(vaccination, actor);
      return this.applyRecordDecision(
        this.vaccineRepo,
        vaccination,
        nextStatus,
        dto.notes,
      );
    }

    throw new NotFoundException(`Verification record ${id} not found`);
  }

  // A clinician may only decide records for children assigned to them; admins
  // are platform-wide. Prevents a clinician acting on another tenant's records.
  private assertActorMayDecideRecord(
    record: { child?: { clinician?: { id: string } } },
    actor?: RecordActor,
  ): void {
    if (!actor) return;
    if (actor.role === UserRole.ADMIN || actor.role === UserRole.SUPER_ADMIN) {
      return;
    }
    if (
      actor.role === UserRole.CLINICIAN &&
      record.child?.clinician?.id === actor.userId
    ) {
      return;
    }
    throw new ForbiddenException(
      'You do not have access to this verification record',
    );
  }

  private async applyRecordDecision<
    T extends { status: ResourceStatus; notes?: string },
  >(
    repo: Repository<T>,
    record: T,
    nextStatus: ResourceStatus | null,
    notes?: string,
  ): Promise<T> {
    if (nextStatus) record.status = nextStatus;
    // Only record types that carry a notes column keep the reviewer's note.
    if (notes && 'notes' in record) {
      record.notes = record.notes ? `${record.notes}\n${notes}` : notes;
    }
    return repo.save(record);
  }

  /**
   * Approve / reject a clinician's HPCSA/SANC verification. The id is the
   * clinician's user id (see findAllCliniciansForVerification).
   */
  async decideClinician(
    userId: string,
    dto: VerificationDecisionDto,
  ): Promise<ClinicianProfile> {
    const profile = await this.clinicianProfileRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    if (!profile) {
      throw new NotFoundException(
        `Clinician profile for user ${userId} not found`,
      );
    }
    profile.verificationStatus = CLINICIAN_OUTCOME_STATUS[dto.outcome];
    return this.clinicianProfileRepo.save(profile);
  }
}
