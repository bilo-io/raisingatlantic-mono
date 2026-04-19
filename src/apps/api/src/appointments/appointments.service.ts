import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointments.model';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto/create-appointment.dto';
import { Child } from '../children/children.model';
import { User } from '../users/users.model';
import { Practice } from '../practices/practices.model';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
    @InjectRepository(Child)
    private childrenRepository: Repository<Child>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Practice)
    private practiceRepository: Repository<Practice>,
  ) {}

  async create(dto: CreateAppointmentDto): Promise<Appointment> {
    const child = await this.childrenRepository.findOne({ where: { id: dto.childId } });
    if (!child) throw new NotFoundException('Child not found');

    let clinician: User | null = null;
    if (dto.clinicianId) {
      clinician = await this.usersRepository.findOne({ where: { id: dto.clinicianId } });
    }

    let practice: Practice | null = null;
    if (dto.practiceId) {
      practice = await this.practiceRepository.findOne({ where: { id: dto.practiceId } });
    }

    const appointment = this.appointmentsRepository.create({
      scheduledAt: new Date(dto.scheduledAt),
      status: dto.status,
      notes: dto.notes,
      child,
      clinician: clinician || undefined,
      practice: practice || undefined,
    });

    return this.appointmentsRepository.save(appointment);
  }

  async findAll(filters: { childId?: string; clinicianId?: string; practiceId?: string }): Promise<Appointment[]> {
    const query = this.appointmentsRepository.createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.child', 'child')
      .leftJoinAndSelect('appointment.clinician', 'user')
      .leftJoinAndSelect('appointment.practice', 'practice');

    if (filters.childId) query.andWhere('child.id = :childId', { childId: filters.childId });
    if (filters.clinicianId) query.andWhere('user.id = :clinicianId', { clinicianId: filters.clinicianId });
    if (filters.practiceId) query.andWhere('practice.id = :practiceId', { practiceId: filters.practiceId });

    return query.getMany();
  }

  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
      relations: ['child', 'clinician', 'practice'],
    });
    if (!appointment) throw new NotFoundException('Appointment not found');
    return appointment;
  }

  async update(id: string, dto: UpdateAppointmentDto): Promise<Appointment> {
    const appointment = await this.findOne(id);
    if (dto.scheduledAt) appointment.scheduledAt = new Date(dto.scheduledAt);
    if (dto.status) appointment.status = dto.status;
    if (dto.notes) appointment.notes = dto.notes;
    return this.appointmentsRepository.save(appointment);
  }

  async remove(id: string): Promise<void> {
    const appointment = await this.findOne(id);
    await this.appointmentsRepository.remove(appointment);
  }
}
