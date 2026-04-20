import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExamplesModule } from './examples/examples.module';
import { Example } from './examples/examples.model';
import { UsersModule } from './users/users.module';
import { User } from './users/users.model';
import { ClinicianProfile } from './users/clinician-profile.model';
import { TenantsModule } from './tenants/tenants.module';
import { Tenant } from './tenants/tenants.model';
import { PracticesModule } from './practices/practices.module';
import { Practice } from './practices/practices.model';
import { ChildrenModule } from './children/children.module';
import { Child, GrowthRecord, CompletedMilestone, CompletedVaccination, Allergy, MedicalCondition } from './children/children.model';
import { Report } from './reports/reports.model';
import { Appointment } from './appointments/appointments.model';
import { MasterDataModule } from './master-data/master-data.module';
import { VerificationsModule } from './verifications/verifications.module';
import { ReportsModule } from './reports/reports.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { BlogModule } from './blog/blog.module';
import { BlogPost } from './blog/blog.model';

@Module({
  imports: [
    // Load .env globally
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // TypeORM configured from .env via ConfigService
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [
          Example, 
          User, 
          ClinicianProfile, 
          Tenant, 
          Practice, 
          Child, 
          GrowthRecord, 
          CompletedMilestone, 
          CompletedVaccination,
          Allergy,
          MedicalCondition,
          Report,
          Appointment,
          BlogPost
        ],
        // auto-create / sync schema in dev — disable in production
        synchronize: config.get<string>('NODE_ENV') !== 'production',
        logging: config.get<string>('NODE_ENV') !== 'production',
      }),
    }),

    ExamplesModule,
    UsersModule,
    TenantsModule,
    PracticesModule,
    ChildrenModule,
    ReportsModule,
    AppointmentsModule,
    MasterDataModule,
    VerificationsModule,
    BlogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
