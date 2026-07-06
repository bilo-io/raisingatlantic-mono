import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/users.model';
import { Child } from '../children/children.model';

export interface DsarExport {
  exportedAt: string;
  format: 'json';
  dataSubject: Record<string, unknown>;
  children: Record<string, unknown>[];
}

@Injectable()
export class PrivacyService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Child) private readonly childRepo: Repository<Child>,
  ) {}

  /**
   * POPIA §4.2 Data Subject Access Request + data portability: assembles every
   * piece of personal data held about one data subject into a single
   * machine-readable document. For a parent this includes their own profile and
   * each child record (growth, milestones, vaccinations, allergies, conditions)
   * they consented to on the child's behalf.
   */
  async exportUserData(
    userId: string,
    now: Date = new Date(),
  ): Promise<DsarExport> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['clinicianProfile'],
    });

    if (!user) throw new NotFoundException('User not found');

    const children = await this.childRepo.find({
      where: { parent: { id: userId } },
      relations: [
        'growthRecords',
        'completedMilestones',
        'completedVaccinations',
        'allergies',
        'medicalConditions',
      ],
    });

    return {
      exportedAt: now.toISOString(),
      format: 'json',
      dataSubject: {
        id: user.id,
        title: user.title ?? null,
        name: user.name,
        email: user.email,
        phone: user.phone,
        imageUrl: user.imageUrl ?? null,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        clinicianProfile: user.clinicianProfile ?? null,
      },
      children: children.map((child) => ({
        id: child.id,
        name: child.name,
        firstName: child.firstName,
        lastName: child.lastName,
        gender: child.gender,
        dateOfBirth: child.dateOfBirth,
        status: child.status,
        notes: child.notes ?? null,
        createdAt: child.createdAt,
        updatedAt: child.updatedAt,
        growthRecords: child.growthRecords ?? [],
        milestones: child.completedMilestones ?? [],
        vaccinations: child.completedVaccinations ?? [],
        allergies: child.allergies ?? [],
        medicalConditions: child.medicalConditions ?? [],
      })),
    };
  }
}
