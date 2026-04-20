import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ILoggerService } from '@core/telemetry/interfaces/logger.interface';
import { ITracingService } from '@core/telemetry/interfaces/tracer.interface';
import { IMetricService } from '@core/telemetry/interfaces/metric.interface';
import { IErrorReportingService } from '@core/telemetry/interfaces/error-reporter.interface';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './constants';
import { maskEmail, maskPhone } from '../common/utils/masking.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @Inject('ILoggerService') private readonly logger: ILoggerService,
    @Inject('ITracingService') private readonly tracer: ITracingService,
    @Inject('IMetricService') private readonly metric: IMetricService,
    @Inject('IErrorReportingService') private readonly errorReporter: IErrorReportingService,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const span = this.tracer.startSpan('UsersService.create');
    this.logger.log(`Attempting to create a new user: ${dto.email}`);
    try {
      const user = this.usersRepository.create(dto);
      const saved = await this.usersRepository.save(user);
      this.metric.incrementCounter('user.created', 1, { status: 'success' });
      this.logger.log(`User successfully created with ID: ${saved.id}`);
      return saved;
    } catch (error) {
      if (error instanceof Error) {
        this.errorReporter.reportException(error, { dto });
        this.tracer.recordException(span, error);
      }
      this.metric.incrementCounter('user.created', 1, { status: 'failure' });
      throw error;
    } finally {
      this.tracer.endSpan(span);
    }
  }

  async findAll(): Promise<User[]> {
    const span = this.tracer.startSpan('UsersService.findAll');
    this.logger.log('Fetching all users');
    try {
      return await this.usersRepository.find({ relations: ['clinicianProfile'] });
    } finally {
      this.tracer.endSpan(span);
    }
  }

  async findCliniciansPublic(): Promise<User[]> {
    const span = this.tracer.startSpan('UsersService.findCliniciansPublic');
    this.logger.log('Fetching all clinicians for public directory');
    try {
      const clinicians = await this.usersRepository.find({
        where: { role: UserRole.CLINICIAN },
        relations: ['clinicianProfile', 'clinicianProfile.practices'],
      });

      return clinicians.map((user) => ({
        ...user,
        email: maskEmail(user.email),
        phone: maskPhone(user.phone),
      })) as User[];
    } finally {
      this.tracer.endSpan(span);
    }
  }

  async findOne(id: string): Promise<User> {
    const span = this.tracer.startSpan('UsersService.findOne');
    this.logger.log(`Fetching user with ID: ${id}`);
    try {
      // Basic UUID format check to avoid 500 error from TypeORM/Postgres
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        this.logger.warn(`Invalid UUID format provided: ${id}`);
        throw new NotFoundException(`User with ID: ${id} not found`);
      }

      const user = await this.usersRepository.findOne({
        where: { id },
        relations: ['clinicianProfile'],
      });
      if (!user) {
        this.logger.warn(`User with ID: ${id} not found`);
        throw new NotFoundException(`User with ID: ${id} not found`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error fetching user ${id}: ${error.message}`);
      throw error;
    } finally {
      this.tracer.endSpan(span);
    }
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const span = this.tracer.startSpan('UsersService.update');
    this.logger.log(`Attempting to update user with ID: ${id}`);
    try {
      const existing = await this.findOne(id);
      const updated = this.usersRepository.merge(existing, dto);
      const saved = await this.usersRepository.save(updated);
      this.metric.incrementCounter('user.updated', 1, { status: 'success' });
      return saved;
    } finally {
      this.tracer.endSpan(span);
    }
  }

  async remove(id: string): Promise<void> {
    const span = this.tracer.startSpan('UsersService.remove');
    this.logger.log(`Attempting to delete user with ID: ${id}`);
    try {
      const existing = await this.findOne(id);
      await this.usersRepository.remove(existing);
      this.metric.incrementCounter('user.deleted', 1, { status: 'success' });
      this.logger.log(`Successfully deleted user: ${id}`);
    } finally {
      this.tracer.endSpan(span);
    }
  }
}
