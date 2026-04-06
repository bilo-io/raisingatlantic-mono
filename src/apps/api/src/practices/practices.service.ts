import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ILoggerService } from '@core/telemetry/interfaces/logger.interface';
import { ITracingService } from '@core/telemetry/interfaces/tracer.interface';
import { IMetricService } from '@core/telemetry/interfaces/metric.interface';
import { IErrorReportingService } from '@core/telemetry/interfaces/error-reporter.interface';
import { Practice } from './practices.model';
import { CreatePracticeDto } from './dto/create-practice.dto';
import { UpdatePracticeDto } from './dto/update-practice.dto';

@Injectable()
export class PracticesService {
  constructor(
    @InjectRepository(Practice)
    private readonly practicesRepository: Repository<Practice>,
    @Inject('ILoggerService') private readonly logger: ILoggerService,
    @Inject('ITracingService') private readonly tracer: ITracingService,
    @Inject('IMetricService') private readonly metric: IMetricService,
    @Inject('IErrorReportingService') private readonly errorReporter: IErrorReportingService,
  ) {}

  async create(dto: CreatePracticeDto): Promise<Practice> {
    const span = this.tracer.startSpan('PracticesService.create');
    try {
      const practice = this.practicesRepository.create(dto);
      return await this.practicesRepository.save(practice);
    } finally {
      this.tracer.endSpan(span);
    }
  }

  async findAll(): Promise<Practice[]> {
    const span = this.tracer.startSpan('PracticesService.findAll');
    try {
      return await this.practicesRepository.find({ relations: ['tenant', 'clinicians', 'clinicians.user'] });
    } finally {
      this.tracer.endSpan(span);
    }
  }

  async findOne(id: string): Promise<Practice> {
    const span = this.tracer.startSpan('PracticesService.findOne');
    try {
      const practice = await this.practicesRepository.findOne({
        where: { id },
        relations: ['tenant', 'clinicians'],
      });
      if (!practice) throw new NotFoundException(`Practice ${id} not found`);
      return practice;
    } finally {
      this.tracer.endSpan(span);
    }
  }

  async update(id: string, dto: UpdatePracticeDto): Promise<Practice> {
    const span = this.tracer.startSpan('PracticesService.update');
    try {
      const existing = await this.findOne(id);
      const updated = this.practicesRepository.merge(existing, dto);
      return await this.practicesRepository.save(updated);
    } finally {
      this.tracer.endSpan(span);
    }
  }

  async remove(id: string): Promise<void> {
    const span = this.tracer.startSpan('PracticesService.remove');
    try {
      const existing = await this.findOne(id);
      await this.practicesRepository.remove(existing);
    } finally {
      this.tracer.endSpan(span);
    }
  }
}
