import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ILoggerService } from '@core/telemetry/interfaces/logger.interface';
import { ITracingService } from '@core/telemetry/interfaces/tracer.interface';
import { IMetricService } from '@core/telemetry/interfaces/metric.interface';
import { IErrorReportingService } from '@core/telemetry/interfaces/error-reporter.interface';
import { Child, GrowthRecord, CompletedMilestone, CompletedVaccination } from './children.model';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';

@Injectable()
export class ChildrenService {
  constructor(
    @InjectRepository(Child) private readonly childRepo: Repository<Child>,
    @InjectRepository(GrowthRecord) private readonly growthRepo: Repository<GrowthRecord>,
    @InjectRepository(CompletedMilestone) private readonly milestoneRepo: Repository<CompletedMilestone>,
    @InjectRepository(CompletedVaccination) private readonly vaccineRepo: Repository<CompletedVaccination>,
    @Inject('ILoggerService') private readonly logger: ILoggerService,
    @Inject('ITracingService') private readonly tracer: ITracingService,
    @Inject('IMetricService') private readonly metric: IMetricService,
    @Inject('IErrorReportingService') private readonly errorReporter: IErrorReportingService,
  ) {}

  async create(dto: CreateChildDto): Promise<Child> {
    const span = this.tracer.startSpan('ChildrenService.create');
    try {
      const child = this.childRepo.create({
        ...dto,
        parent: { id: dto.parentId } as any,
        clinician: dto.clinicianId ? ({ id: dto.clinicianId } as any) : undefined,
      });
      return await this.childRepo.save(child);
    } finally {
      this.tracer.endSpan(span);
    }
  }

  async findAll(): Promise<Child[]> {
    return this.childRepo.find({ relations: ['parent', 'clinician'] });
  }

  async findOne(id: string): Promise<Child> {
    const child = await this.childRepo.findOne({
      where: { id },
      relations: ['parent', 'clinician', 'growthRecords', 'completedMilestones', 'completedVaccinations'],
    });
    if (!child) throw new NotFoundException(`Child ${id} not found`);
    return child;
  }

  async update(id: string, dto: UpdateChildDto): Promise<Child> {
    const existing = await this.findOne(id);
    const updated = this.childRepo.merge(existing, dto as any);
    return await this.childRepo.save(updated);
  }

  async remove(id: string): Promise<void> {
    const existing = await this.findOne(id);
    await this.childRepo.remove(existing);
  }

  async findUnifiedRecords(childId: string): Promise<any[]> {
    const child = await this.findOne(childId);
    
    return [
      ...child.growthRecords.map(r => ({ ...r, type: 'Growth' })),
      ...child.completedMilestones.map(r => ({ ...r, type: 'Milestone' })),
      ...child.completedVaccinations.map(r => ({ ...r, type: 'Vaccination' })),
    ].sort((a: any, b: any) => {
      const dateA = new Date(a.date || a.dateAchieved || a.dateAdministered).getTime();
      const dateB = new Date(b.date || b.dateAchieved || b.dateAdministered).getTime();
      return dateB - dateA;
    });
  }
}
