import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Appointment } from './appointments.model';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto/create-appointment.dto';
import { Child } from '../children/children.model';
import { User } from '../users/users.model';
import { Practice } from '../practices/practices.model';
import { isUUID } from '../common/utils/id-validator';

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
    let child: Child | null = null;
    if (isUUID(dto.childId)) {
      child = await this.childrenRepository.findOne({ where: { id: dto.childId } });
    } else {
      child = await this.childrenRepository.findOne({ 
        where: [
          { name: ILike(dto.childId) },
          { firstName: ILike(dto.childId) },
          { name: ILike(dto.childId.replace(/-/g, ' ')) }
        ] 
      });
    }
    if (!child) throw new NotFoundException('Child not found');

    let clinician: User | null = null;
    if (dto.clinicianId) {
      if (isUUID(dto.clinicianId)) {
        clinician = await this.usersRepository.findOne({ where: { id: dto.clinicianId } });
      } else {
        clinician = await this.usersRepository.findOne({ where: { name: ILike(dto.clinicianId) } });
      }
    }

    let practice: Practice | null = null;
    if (dto.practiceId) {
      if (isUUID(dto.practiceId)) {
        practice = await this.practiceRepository.findOne({ where: { id: dto.practiceId } });
      } else {
        practice = await this.practiceRepository.findOne({ where: { name: ILike(dto.practiceId) } });
      }
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

    if (filters.childId) {
      if (isUUID(filters.childId)) {
        query.andWhere('child.id = :childId', { childId: filters.childId });
      } else {
        query.andWhere('(child.name ILIKE :cName OR child.firstName ILIKE :cName)', { cName: `%${filters.childId}%` });
      }
    }
    
    if (filters.clinicianId) {
      if (isUUID(filters.clinicianId)) {
        query.andWhere('user.id = :clinicianId', { clinicianId: filters.clinicianId });
      } else {
        query.andWhere('user.name ILIKE :uName', { uName: `%${filters.clinicianId}%` });
      }
    }
    
    if (filters.practiceId) {
      if (isUUID(filters.practiceId)) {
        query.andWhere('practice.id = :practiceId', { practiceId: filters.practiceId });
      } else {
        query.andWhere('practice.name ILIKE :pName', { pName: `%${filters.practiceId}%` });
      }
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Appointment> {
    let appointment: Appointment | null = null;
    if (isUUID(id)) {
      appointment = await this.appointmentsRepository.findOne({
        where: { id },
        relations: ['child', 'clinician', 'practice'],
      });
    }
    
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
