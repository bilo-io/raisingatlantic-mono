import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterDataService } from './master-data.service';
import { MasterDataController } from './master-data.controller';
import { GrowthRecord, CompletedMilestone, CompletedVaccination } from '../children/children.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([GrowthRecord, CompletedMilestone, CompletedVaccination]),
  ],
  providers: [MasterDataService],
  controllers: [MasterDataController],
  exports: [MasterDataService],
})
export class MasterDataModule {}
