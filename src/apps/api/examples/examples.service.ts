import { ILoggerService } from '../../../core/telemetry/interfaces/logger.interface';
import { ITracingService } from '../../../core/telemetry/interfaces/tracer.interface';
import { IMetricService } from '../../../core/telemetry/interfaces/metric.interface';
import { IErrorReportingService } from '../../../core/telemetry/interfaces/error-reporter.interface';
import { Example } from './examples.model';
import { CreateExampleDto } from './dto/create-example.dto';
import { UpdateExampleDto } from './dto/update-example.dto';

export class ExamplesService {
  private examples: Example[] = [];

  constructor(
    private readonly logger: ILoggerService,
    private readonly tracer: ITracingService,
    private readonly metric: IMetricService,
    private readonly errorReporter: IErrorReportingService
  ) {}

  async create(dto: CreateExampleDto): Promise<Example> {
    const span = this.tracer.startSpan('ExamplesService.create');
    this.logger.log(`Attempting to create a new example: ${dto.name}`);

    try {
      const newExample = new Example({
        id: Math.random().toString(36).substring(7),
        ...dto
      });

      // Simulation delay
      await new Promise(res => setTimeout(res, 50));
      this.examples.push(newExample);

      this.metric.incrementCounter('example.created', 1, { status: 'success' });
      this.logger.log(`Example successfully created with ID: ${newExample.id}`);
      return newExample;
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
      return this.examples;
    } finally {
      this.tracer.endSpan(span);
    }
  }

  async findOne(id: string): Promise<Example | undefined> {
    const span = this.tracer.startSpan('ExamplesService.findOne');
    this.logger.log(`Fetching example with ID: ${id}`);
    try {
      const example = this.examples.find(e => e.id === id);
      if (!example) {
        this.logger.warn(`Example with ID: ${id} not found`);
      }
      return example;
    } finally {
      this.tracer.endSpan(span);
    }
  }

  async update(id: string, dto: UpdateExampleDto): Promise<Example | undefined> {
    const span = this.tracer.startSpan('ExamplesService.update');
    this.logger.log(`Attempting to update example with ID: ${id}`);
    try {
      const index = this.examples.findIndex(e => e.id === id);
      if (index === -1) {
        this.logger.warn(`Cannot update - Example with ID: ${id} not found`);
        return undefined;
      }
      const updatedExample = new Example({
        ...this.examples[index],
        ...dto,
        updatedAt: new Date()
      });
      this.examples[index] = updatedExample;
      this.metric.incrementCounter('example.updated', 1, { status: 'success' });
      return updatedExample;
    } finally {
      this.tracer.endSpan(span);
    }
  }

  async remove(id: string): Promise<boolean> {
    const span = this.tracer.startSpan('ExamplesService.remove');
    this.logger.log(`Attempting to delete example with ID: ${id}`);
    try {
      const initialLength = this.examples.length;
      this.examples = this.examples.filter(e => e.id !== id);
      const isDeleted = initialLength !== this.examples.length;
      if (isDeleted) {
        this.metric.incrementCounter('example.deleted', 1, { status: 'success' });
        this.logger.log(`Successfully deleted example: ${id}`);
      } else {
        this.logger.warn(`Failed to delete example: ${id} (Not found)`);
      }
      return isDeleted;
    } finally {
      this.tracer.endSpan(span);
    }
  }
}
