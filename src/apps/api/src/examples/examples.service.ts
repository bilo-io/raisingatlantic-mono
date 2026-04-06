import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ILoggerService } from '@core/telemetry/interfaces/logger.interface';
import { ITracingService } from '@core/telemetry/interfaces/tracer.interface';
import { IMetricService } from '@core/telemetry/interfaces/metric.interface';
import { IErrorReportingService } from '@core/telemetry/interfaces/error-reporter.interface';
import { Example } from './examples.model';
import { CreateExampleDto } from './dto/create-example.dto';
import { UpdateExampleDto } from './dto/update-example.dto';

@Injectable()
export class ExamplesService {
  constructor(
    @InjectRepository(Example)
    private readonly examplesRepository: Repository<Example>,
    @Inject('ILoggerService') private readonly logger: ILoggerService,
    @Inject('ITracingService') private readonly tracer: ITracingService,
    @Inject('IMetricService') private readonly metric: IMetricService,
    @Inject('IErrorReportingService') private readonly errorReporter: IErrorReportingService,
  ) {}

  async create(dto: CreateExampleDto): Promise<Example> {
    const span = this.tracer.startSpan('ExamplesService.create');
    this.logger.log(`Attempting to create a new example: ${dto.name}`);
    try {
      const example = this.examplesRepository.create(dto);
      const saved = await this.examplesRepository.save(example);
      this.metric.incrementCounter('example.created', 1, { status: 'success' });
      this.logger.log(`Example successfully created with ID: ${saved.id}`);
      return saved;
    } catch (error) {
      if (error instanceof Error) {
        this.errorReporter.reportException(error, { dto });
        this.tracer.recordException(span, error);
      }
      this.metric.incrementCounter('example.created', 1, { status: 'failure' });
      throw error;
    } finally {
      this.tracer.endSpan(span);
    }
  }

  async findAll(): Promise<Example[]> {
    const span = this.tracer.startSpan('ExamplesService.findAll');
    this.logger.log('Fetching all examples');
    try {
      return await this.examplesRepository.find();
    } finally {
      this.tracer.endSpan(span);
    }
  }

  async findOne(id: string): Promise<Example> {
    const span = this.tracer.startSpan('ExamplesService.findOne');
    this.logger.log(`Fetching example with ID: ${id}`);
    try {
      const example = await this.examplesRepository.findOneBy({ id });
      if (!example) {
        this.logger.warn(`Example with ID: ${id} not found`);
        throw new NotFoundException(`Example with ID: ${id} not found`);
      }
      return example;
    } finally {
      this.tracer.endSpan(span);
    }
  }

  async update(id: string, dto: UpdateExampleDto): Promise<Example> {
    const span = this.tracer.startSpan('ExamplesService.update');
    this.logger.log(`Attempting to update example with ID: ${id}`);
    try {
      const existing = await this.findOne(id);
      const updated = this.examplesRepository.merge(existing, dto);
      const saved = await this.examplesRepository.save(updated);
      this.metric.incrementCounter('example.updated', 1, { status: 'success' });
      return saved;
    } finally {
      this.tracer.endSpan(span);
    }
  }

  async remove(id: string): Promise<void> {
    const span = this.tracer.startSpan('ExamplesService.remove');
    this.logger.log(`Attempting to delete example with ID: ${id}`);
    try {
      const existing = await this.findOne(id);
      await this.examplesRepository.remove(existing);
      this.metric.incrementCounter('example.deleted', 1, { status: 'success' });
      this.logger.log(`Successfully deleted example: ${id}`);
    } finally {
      this.tracer.endSpan(span);
    }
  }
}
