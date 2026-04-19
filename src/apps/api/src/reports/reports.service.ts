import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Report } from './reports.model';
import { CreateReportDto } from './dto/create-report.dto';
import { Child } from '../children/children.model';
import { User } from '../users/users.model';
import { isUUID } from '../common/utils/id-validator';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,
    @InjectRepository(Child)
    private childrenRepository: Repository<Child>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(dto: CreateReportDto): Promise<Report> {
    let child: Child | null = null;
    if (isUUID(dto.childId)) {
      child = await this.childrenRepository.findOne({ where: { id: dto.childId } });
    } else {
      const nameMatch = dto.childId.replace('child-', '').replace(/-/g, ' ');
      child = await this.childrenRepository.findOne({ 
        where: [
          { name: ILike(`%${nameMatch}%`) },
          { firstName: ILike(`%${nameMatch}%`) },
          { name: ILike(dto.childId.replace(/-/g, ' ')) }
        ] 
      });
    }
    
    if (!child) throw new NotFoundException('Child not found');

    let generatedBy: User | null = null;
    if (dto.generatedById) {
      if (isUUID(dto.generatedById)) {
        generatedBy = await this.usersRepository.findOne({ where: { id: dto.generatedById } });
      } else {
        const nameMatch = dto.generatedById.replace('clinician-', '').replace(/-/g, ' ');
        generatedBy = await this.usersRepository.findOne({
          where: [
            { email: ILike(`%${dto.generatedById}%`) },
            { name: ILike(`%${nameMatch}%`) }
          ]
        });
      }
    }

    const reportData = {
      type: dto.type,
      content: dto.content,
      pdfUrl: dto.pdfUrl,
      child,
      generatedBy: generatedBy || undefined,
    };

    const report = this.reportsRepository.create(reportData);

    return await this.reportsRepository.save(report);
  }

  async findAll(filters: { childId?: string }): Promise<Report[]> {
    const query = this.reportsRepository.createQueryBuilder('report')
      .leftJoinAndSelect('report.child', 'child')
      .leftJoinAndSelect('report.generatedBy', 'user');

    if (filters.childId) {
      if (isUUID(filters.childId)) {
        query.andWhere('child.id = :childId', { childId: filters.childId });
      } else {
        query.andWhere('(child.name ILIKE :cName OR child.firstName ILIKE :cName)', { cName: `%${filters.childId}%` });
      }
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Report> {
    let report: Report | null = null;
    if (isUUID(id)) {
      report = await this.reportsRepository.findOne({
        where: { id },
        relations: ['child', 'generatedBy'],
      });
    }
    
    if (!report) throw new NotFoundException('Report not found');
    return report;
  }

  async remove(id: string): Promise<void> {
    const report = await this.findOne(id);
    await this.reportsRepository.remove(report);
  }
}
