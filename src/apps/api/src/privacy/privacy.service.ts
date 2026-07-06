import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
// pdfkit is a CommonJS `export =` module; import-equals works at runtime under
// both tsc and ts-jest regardless of esModuleInterop settings.
// eslint-disable-next-line @typescript-eslint/no-require-imports
import PDFDocument = require('pdfkit');
import { User } from '../users/users.model';
import { Child } from '../children/children.model';
import { Appointment } from '../appointments/appointments.model';
import { Report } from '../reports/reports.model';
import { ResourceStatus } from '../common/enums';
import { SystemLogsService } from '../system-logs/system-logs.service';

export const ERASURE_GRACE_DAYS = 30;

export interface DsarExport {
  exportedAt: string;
  format: 'json';
  dataSubject: Record<string, unknown>;
  children: Record<string, unknown>[];
}

export interface ErasureResult {
  deletionRequestedAt: string;
  scheduledHardDeleteAt: string;
}

@Injectable()
export class PrivacyService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Child) private readonly childRepo: Repository<Child>,
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    @InjectRepository(Report) private readonly reportRepo: Repository<Report>,
    private readonly systemLogs: SystemLogsService,
  ) {}

  /**
   * POPIA §4.2 Data Subject Access Request + data portability: assembles every
   * piece of personal data held about one data subject into a single
   * machine-readable document. For a parent this includes their own profile and
   * each child record (growth, milestones, vaccinations, allergies, conditions,
   * appointments, reports) they hold on the child's behalf. `passwordHash` is
   * `select:false` so it is never loaded — the subject's own data only.
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
    const childIds = children.map((c) => c.id);

    const appointments = childIds.length
      ? await this.appointmentRepo.find({
          where: { child: { id: In(childIds) } },
          relations: ['child', 'practice'],
        })
      : [];
    const reports = childIds.length
      ? await this.reportRepo.find({
          where: { child: { id: In(childIds) } },
          relations: ['child'],
        })
      : [];

    const byChild = <T extends { child?: { id: string } }>(rows: T[]) => {
      const map = new Map<string, T[]>();
      for (const row of rows) {
        const key = row.child?.id;
        if (!key) continue;
        const list = map.get(key);
        if (list) list.push(row);
        else map.set(key, [row]);
      }
      return map;
    };
    const apptsByChild = byChild(appointments);
    const reportsByChild = byChild(reports);

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
        authProvider: user.authProvider,
        emailVerified: user.emailVerified,
        deletionRequestedAt: user.deletionRequestedAt ?? null,
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
        appointments: (apptsByChild.get(child.id) ?? []).map((a) => ({
          id: a.id,
          scheduledAt: a.scheduledAt,
          status: a.status,
          notes: a.notes ?? null,
          practice: a.practice?.name ?? null,
        })),
        reports: (reportsByChild.get(child.id) ?? []).map((r) => ({
          id: r.id,
          type: r.type,
          status: r.status,
          content: r.content ?? null,
          createdAt: r.createdAt,
        })),
      })),
    };
  }

  /** Same DSAR data rendered as a human-readable PDF document. */
  async exportUserDataPdf(
    userId: string,
    now: Date = new Date(),
  ): Promise<Buffer> {
    const data = await this.exportUserData(userId, now);
    return this.renderPdf(data);
  }

  private renderPdf(data: DsarExport): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const asText = (v: unknown): string => {
        if (v == null) return '';
        switch (typeof v) {
          case 'string':
            return v;
          case 'number':
          case 'boolean':
          case 'bigint':
            return String(v);
          default:
            return JSON.stringify(v) ?? '';
        }
      };

      const subject = data.dataSubject;
      doc.fontSize(18).text('Raising Atlantic — Personal Data Export');
      doc.moveDown(0.3);
      doc.fontSize(9).fillColor('#666').text(`Exported: ${data.exportedAt}`);
      doc.fillColor('#000').moveDown();

      doc.fontSize(13).text('Data subject');
      doc.fontSize(10);
      for (const key of ['name', 'email', 'phone', 'role'] as const) {
        doc.text(`${key}: ${asText(subject[key])}`);
      }
      doc.moveDown();

      doc.fontSize(13).text(`Children (${data.children.length})`);
      doc.fontSize(10);
      for (const child of data.children) {
        doc.moveDown(0.5);
        doc.font('Helvetica-Bold').text(asText(child.name));
        doc.font('Helvetica');
        doc.text(`Date of birth: ${asText(child.dateOfBirth)}`);
        const counts: Array<[string, unknown]> = [
          ['Growth records', child.growthRecords],
          ['Milestones', child.milestones],
          ['Vaccinations', child.vaccinations],
          ['Allergies', child.allergies],
          ['Medical conditions', child.medicalConditions],
          ['Appointments', child.appointments],
          ['Reports', child.reports],
        ];
        for (const [label, arr] of counts) {
          doc.text(`${label}: ${Array.isArray(arr) ? arr.length : 0}`);
        }
      }

      doc.moveDown();
      doc
        .fontSize(8)
        .fillColor('#666')
        .text(
          'This document contains all personal information held about you under POPIA. ' +
            'The full machine-readable dataset is available via the JSON export.',
        );

      doc.end();
    });
  }

  /**
   * POPIA §4.2 right-to-erasure: soft-delete now (mark the account, archive the
   * subject's children) with a 30-day grace window; a scheduled job performs the
   * hard delete after `deletionRequestedAt + 30d`. Clinical records recorded by
   * others keep their `SET NULL` orphaning for care-continuity integrity.
   */
  async requestErasure(
    userId: string,
    now: Date = new Date(),
  ): Promise<ErasureResult> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    user.deletionRequestedAt = now;
    await this.userRepo.save(user);

    await this.childRepo
      .createQueryBuilder()
      .update(Child)
      .set({ status: ResourceStatus.ARCHIVED })
      .where('parentId = :userId', { userId })
      .execute();

    await this.systemLogs.createLog({
      type: 'ERASURE_REQUESTED',
      message: 'Account erasure requested',
      metadata: { userId },
    });

    const scheduled = new Date(
      now.getTime() + ERASURE_GRACE_DAYS * 24 * 60 * 60 * 1000,
    );
    return {
      deletionRequestedAt: now.toISOString(),
      scheduledHardDeleteAt: scheduled.toISOString(),
    };
  }
}
