import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemLog } from '../common/models/system-log.model';

@Injectable()
export class SystemLogsService {
  constructor(
    @InjectRepository(SystemLog)
    private systemLogRepository: Repository<SystemLog>,
  ) {}

  async createLog(data: { type: string; message: string; metadata?: any; ipAddress?: string }) {
    const log = this.systemLogRepository.create(data);
    return this.systemLogRepository.save(log);
  }

  async findAll() {
    return this.systemLogRepository.find({
      order: { createdAt: 'DESC' },
      take: 100, // Limit to 100 recent logs
    });
  }
}
