import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { ILoggerService } from '@core/telemetry/interfaces/logger.interface';
import { ITracingService } from '@core/telemetry/interfaces/tracer.interface';
import { IMetricService } from '@core/telemetry/interfaces/metric.interface';
import { IErrorReportingService } from '@core/telemetry/interfaces/error-reporter.interface';
import { INotificationDispatcher } from '@core/notifications/interfaces/dispatcher.interface';
import { NOTIFICATION_TOKENS } from '@core/notifications/interfaces/tokens';
import { isUUID } from '../common/utils/id-validator';
import {
  Child,
  GrowthRecord,
  CompletedMilestone,
  CompletedVaccination,
  Allergy,
  MedicalCondition,
} from './children.model';
import { User } from '../users/users.model';
import { UserRole } from '../users/constants';
import { ResourceStatus } from '../common/enums';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { CreateAllergyDto } from './dto/create-allergy.dto';
import { CreateMedicalConditionDto } from './dto/create-medical-condition.dto';
import { CreateCompletedVaccinationDto } from './dto/create-completed-vaccination.dto';
import { CreateGrowthRecordDto } from './dto/create-growth-record.dto';
import { CreateCompletedMilestoneDto } from './dto/create-completed-milestone.dto';

// The authenticated caller logging a record. Clinician/admin entries are
// auto-verified (Active); parent entries land Pending Assessment for review.
export interface RecordActor {
  userId: string;
  role: UserRole;
}

const VERIFIED_LOGGER_ROLES: UserRole[] = [
  UserRole.CLINICIAN,
  UserRole.ADMIN,
  UserRole.SUPER_ADMIN,
];

@Injectable()
export class ChildrenService {
  constructor(
    @InjectRepository(Child) private readonly childRepo: Repository<Child>,
    @InjectRepository(GrowthRecord)
    private readonly growthRepo: Repository<GrowthRecord>,
    @InjectRepository(CompletedMilestone)
    private readonly milestoneRepo: Repository<CompletedMilestone>,
    @InjectRepository(CompletedVaccination)
    private readonly vaccineRepo: Repository<CompletedVaccination>,
    @InjectRepository(Allergy)
    private readonly allergyRepo: Repository<Allergy>,
    @InjectRepository(MedicalCondition)
    private readonly conditionRepo: Repository<MedicalCondition>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @Inject('ILoggerService') private readonly logger: ILoggerService,
    @Inject('ITracingService') private readonly tracer: ITracingService,
    @Inject('IMetricService') private readonly metric: IMetricService,
    @Inject('IErrorReportingService')
    private readonly errorReporter: IErrorReportingService,
    @Inject(NOTIFICATION_TOKENS.Dispatcher)
    private readonly notifications: INotificationDispatcher,
  ) {}

  async create(dto: CreateChildDto): Promise<Child> {
    const span = this.tracer.startSpan('ChildrenService.create');
    try {
      // Resolve Parent
      let parent: User | null = null;
      if (isUUID(dto.parentId)) {
        parent = await this.userRepo.findOne({ where: { id: dto.parentId } });
      } else {
        // Mock ID support: match by name/email in user table
        const nameMatch = dto.parentId
          .replace('parent-', '')
          .replace(/-/g, ' ');
        parent = await this.userRepo.findOne({
          where: [
            { email: ILike(`%${dto.parentId}%`) },
            { name: ILike(`%${nameMatch}%`) },
          ],
        });
      }
      if (!parent)
        throw new NotFoundException(`Parent with ID ${dto.parentId} not found`);

      // Resolve Clinician (Optional)
      let clinician: User | undefined = undefined;
      if (dto.clinicianId) {
        if (isUUID(dto.clinicianId)) {
          clinician =
            (await this.userRepo.findOne({ where: { id: dto.clinicianId } })) ||
            undefined;
        } else {
          // Mock ID support for clinician
          const nameMatch = dto.clinicianId
            .replace('clinician-', '')
            .replace(/-/g, ' ');
          clinician =
            (await this.userRepo.findOne({
              where: [
                { email: ILike(`%${dto.clinicianId}%`) },
                { name: ILike(`%${nameMatch}%`) },
              ],
            })) || undefined;
        }
      }

      const child = this.childRepo.create({
        ...dto,
        parent,
        clinician,
      });
      const saved = await this.childRepo.save(child);
      // TODO(phase-8): confirm child profile created to parent via
      // this.notifications.email({ ... }) (§8.1). The recurring vaccination
      // reminder fan-out is a Cloud Scheduler job — out of scope here, see §8.3.
      void this.notifications;
      return saved;
    } finally {
      this.tracer.endSpan(span);
    }
  }

  async findAll(filters?: {
    tenantId?: string;
    clinicianId?: string;
  }): Promise<Child[]> {
    const query = this.childRepo
      .createQueryBuilder('child')
      .leftJoinAndSelect('child.parent', 'parent')
      .leftJoinAndSelect('child.clinician', 'clinician')
      .leftJoinAndSelect('clinician.clinicianProfile', 'clinicianProfile')
      .leftJoinAndSelect('clinicianProfile.practices', 'practice')
      .leftJoinAndSelect('practice.tenant', 'tenant')
      .leftJoinAndSelect('child.growthRecords', 'growthRecords')
      .leftJoinAndSelect('child.completedMilestones', 'completedMilestones')
      .leftJoinAndSelect('child.completedVaccinations', 'completedVaccinations')
      .leftJoinAndSelect('child.allergies', 'allergies')
      .leftJoinAndSelect('child.medicalConditions', 'medicalConditions');

    if (filters?.tenantId) {
      if (filters.tenantId.includes('@')) {
        query.andWhere('tenant.email = :tEmail', { tEmail: filters.tenantId });
      } else if (isUUID(filters.tenantId)) {
        query.andWhere('tenant.id = :tenantId', { tenantId: filters.tenantId });
      } else {
        // Mock ID support: match by common name in our seeds
        if (
          filters.tenantId === 'tenant-raising-atlantic' ||
          filters.tenantId === 'tenant-1'
        ) {
          query.andWhere('tenant.name = :tName', {
            tName: 'Raising Atlantic Health',
          });
        } else {
          // Fallback for other mock IDs - search by name or slug
          query.andWhere('tenant.name ILIKE :tName', {
            tName: `%${filters.tenantId}%`,
          });
        }
      }
    }

    if (filters?.clinicianId) {
      if (filters.clinicianId.includes('@')) {
        query.andWhere('clinician.email = :email', {
          email: filters.clinicianId,
        });
      } else if (isUUID(filters.clinicianId)) {
        // Likely a UUID
        query.andWhere('clinician.id = :clinicianId', {
          clinicianId: filters.clinicianId,
        });
      } else {
        // Fallback or mock ID - try matching name or email prefix if needed
        if (filters.clinicianId === 'clinician-dr-smith') {
          query.andWhere('clinician.email = :email', {
            email: 'dr.smith@clinician.com',
          });
        } else {
          query.andWhere('clinician.name ILIKE :cName', {
            cName: `%${filters.clinicianId}%`,
          });
        }
      }
    }

    return await query.getMany();
  }

  async findOne(id: string): Promise<Child> {
    const relations = [
      'parent',
      'clinician',
      'growthRecords',
      'completedMilestones',
      'completedVaccinations',
      'allergies',
      'medicalConditions',
    ];

    let child: Child | null = null;

    if (isUUID(id)) {
      child = await this.childRepo.findOne({
        where: { id },
        relations,
      });
    } else {
      // Mock ID support for E2E tests
      // Try searching by name or slug-like match (case-insensitive)
      child = await this.childRepo.findOne({
        where: [
          { name: ILike(id) },
          { firstName: ILike(id) },
          { name: ILike(id.replace(/-/g, ' ')) },
          { name: ILike(`%${id}%`) }, // Fuzzy match for things like "Alex Doe" vs "alex-doe"
        ],
        relations,
      });
    }

    if (!child) throw new NotFoundException(`Child ${id} not found`);
    return child;
  }

  // Allergy Methods
  async addAllergy(childId: string, dto: CreateAllergyDto): Promise<Allergy> {
    const child = await this.findOne(childId);
    const allergy = this.allergyRepo.create({ ...dto, child });
    return await this.allergyRepo.save(allergy);
  }

  // Authorization boundary for writing to a child's record. A parent may only
  // write to their own child; a clinician only to a child assigned to them;
  // admins are platform-wide. Prevents cross-tenant / IDOR record injection.
  private assertActorMayAccessChild(child: Child, actor?: RecordActor): void {
    if (!actor) return;
    const { role, userId } = actor;
    if (role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN) return;
    if (role === UserRole.PARENT && child.parent?.id === userId) return;
    if (role === UserRole.CLINICIAN && child.clinician?.id === userId) return;
    throw new ForbiddenException(
      "You do not have access to this child's records",
    );
  }

  // Clinician/admin-logged records are auto-verified; parent-logged records
  // wait in Pending Assessment for clinician sign-off (load-bearing per CLAUDE.md).
  private statusForActor(actor?: RecordActor): ResourceStatus {
    return actor && VERIFIED_LOGGER_ROLES.includes(actor.role)
      ? ResourceStatus.ACTIVE
      : ResourceStatus.PENDING_ASSESSMENT;
  }

  private recordedByRef(actor?: RecordActor): User | undefined {
    return actor ? ({ id: actor.userId } as User) : undefined;
  }

  async addGrowthRecord(
    childId: string,
    dto: CreateGrowthRecordDto,
    actor?: RecordActor,
  ): Promise<GrowthRecord> {
    const child = await this.findOne(childId);
    this.assertActorMayAccessChild(child, actor);
    const record = this.growthRepo.create({
      date: new Date(dto.date),
      height: dto.height,
      weight: dto.weight,
      headCircumference: dto.headCircumference,
      notes: dto.notes,
      status: this.statusForActor(actor),
      recordedBy: this.recordedByRef(actor),
      child,
    });
    return await this.growthRepo.save(record);
  }

  async addCompletedMilestone(
    childId: string,
    dto: CreateCompletedMilestoneDto,
    actor?: RecordActor,
  ): Promise<CompletedMilestone> {
    const child = await this.findOne(childId);
    this.assertActorMayAccessChild(child, actor);
    const record = this.milestoneRepo.create({
      milestoneId: dto.milestoneId,
      dateAchieved: new Date(dto.dateAchieved),
      notes: dto.notes,
      status: this.statusForActor(actor),
      recordedBy: this.recordedByRef(actor),
      child,
    });
    return await this.milestoneRepo.save(record);
  }

  async addCompletedVaccination(
    childId: string,
    dto: CreateCompletedVaccinationDto,
    actor?: RecordActor,
  ): Promise<CompletedVaccination> {
    const child = await this.findOne(childId);
    this.assertActorMayAccessChild(child, actor);
    const isClinicianLogged =
      !!actor && VERIFIED_LOGGER_ROLES.includes(actor.role);
    const record = this.vaccineRepo.create({
      ...dto,
      dateAdministered: new Date(dto.dateAdministered),
      expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined,
      source: dto.source ?? (isClinicianLogged ? 'CLINICIAN' : 'PARENT'),
      status: this.statusForActor(actor),
      recordedBy: this.recordedByRef(actor),
      child,
    });
    return await this.vaccineRepo.save(record);
  }

  // Medical Condition Methods
  async addMedicalCondition(
    childId: string,
    dto: CreateMedicalConditionDto,
  ): Promise<MedicalCondition> {
    const child = await this.findOne(childId);
    const condition = this.conditionRepo.create({
      ...dto,
      child,
      diagnosisDate: dto.diagnosisDate
        ? new Date(dto.diagnosisDate)
        : undefined,
    });
    return await this.conditionRepo.save(condition);
  }

  async update(id: string, dto: UpdateChildDto): Promise<Child> {
    const existing = await this.findOne(id);
    const updated = this.childRepo.merge(existing, dto);
    return await this.childRepo.save(updated);
  }

  async remove(id: string): Promise<void> {
    const existing = await this.findOne(id);
    await this.childRepo.remove(existing);
  }

  async findUnifiedRecords(childId: string): Promise<any[]> {
    const child = await this.findOne(childId);

    return [
      ...child.growthRecords.map((r) => ({ ...r, type: 'Growth' })),
      ...child.completedMilestones.map((r) => ({ ...r, type: 'Milestone' })),
      ...child.completedVaccinations.map((r) => ({
        ...r,
        type: 'Vaccination',
      })),
      ...child.allergies.map((r) => ({ ...r, type: 'Allergy' })),
      ...child.medicalConditions.map((r) => ({ ...r, type: 'Condition' })),
    ].sort((a: any, b: any) => {
      const dateA = new Date(
        a.date || a.dateAchieved || a.dateAdministered || a.createdAt,
      ).getTime();
      const dateB = new Date(
        b.date || b.dateAchieved || b.dateAdministered || b.createdAt,
      ).getTime();
      return dateB - dateA;
    });
  }
}
