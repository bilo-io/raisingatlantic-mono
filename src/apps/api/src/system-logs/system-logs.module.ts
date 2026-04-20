import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemLog } from '../common/models/system-log.model';
import { SystemLogsService } from './system-logs.service';
import { SystemLogsController } from './system-logs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SystemLog])],
  providers: [SystemLogsService],
  controllers: [SystemLogsController],
  exports: [SystemLogsService],
})
export class SystemLogsModule {}
