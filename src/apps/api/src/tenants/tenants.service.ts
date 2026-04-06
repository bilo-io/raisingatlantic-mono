import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ILoggerService } from '@core/telemetry/interfaces/logger.interface';
import { ITracingService } from '@core/telemetry/interfaces/tracer.interface';
import { IMetricService } from '@core/telemetry/interfaces/metric.interface';
import { IErrorReportingService } from '@core/telemetry/interfaces/error-reporter.interface';
import { Tenant } from './tenants.model';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantsRepository: Repository<Tenant>,
    @Inject('ILoggerService') private readonly logger: ILoggerService,
    @Inject('ITracingService') private readonly tracer: ITracingService,
    @Inject('IMetricService') private readonly metric: IMetricService,
    @Inject('IErrorReportingService') private readonly errorReporter: IErrorReportingService,
  ) {}

  async create(dto: CreateTenantDto): Promise<Tenant> {
    const span = this.tracer.startSpan('TenantsService.create');
    this.logger.log(`Creating tenant: ${dto.name}`);
    try {
      const tenant = this.tenantsRepository.create(dto);
      const saved = await this.tenantsRepository.save(tenant);
      this.metric.incrementCounter('tenant.created', 1, { status: 'success' });
      return saved;
    } catch (error) {
      if (error instanceof Error) {
        this.errorReporter.reportException(error, { dto });
        this.tracer.recordException(span, error);
      }
      this.metric.incrementCounter('tenant.created', 1, { status: 'failure' });
      throw error;
    } finally {
      this.tracer.endSpan(span);
    }
  }

  async findAll(): Promise<Tenant[]> {
    const span = this.tracer.startSpan('TenantsService.findAll');
    this.logger.log('Fetching all tenants');
    try {
      return await this.tenantsRepository.find();
    } finally {
      this.tracer.endSpan(span);
    }
  }

  async findOne(id: string): Promise<Tenant> {
    const span = this.tracer.startSpan('TenantsService.findOne');
    try {
      const tenant = await this.tenantsRepository.findOneBy({ id });
      if (!tenant) throw new NotFoundException(`Tenant ${id} not found`);
      return tenant;
    } finally {
      this.tracer.endSpan(span);
    }
  }

  async update(id: string, dto: UpdateTenantDto): Promise<Tenant> {
    const span = this.tracer.startSpan('TenantsService.update');
    try {
      const existing = await this.findOne(id);
      const updated = this.tenantsRepository.merge(existing, dto);
      return await this.tenantsRepository.save(updated);
    } finally {
      this.tracer.endSpan(span);
    }
  }

  async remove(id: string): Promise<void> {
    const span = this.tracer.startSpan('TenantsService.remove');
    try {
      const existing = await this.findOne(id);
      await this.tenantsRepository.remove(existing);
    } finally {
      this.tracer.endSpan(span);
    }
  }
}
