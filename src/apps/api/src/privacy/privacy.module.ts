import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrivacyService } from './privacy.service';
import { PrivacyController } from './privacy.controller';
import { User } from '../users/users.model';
import { Child } from '../children/children.model';

@Module({
  imports: [TypeOrmModule.forFeature([User, Child])],
  controllers: [PrivacyController],
  providers: [PrivacyService],
})
export class PrivacyModule {}
