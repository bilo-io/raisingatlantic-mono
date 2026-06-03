import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { ClsModule } from 'nestjs-cls';
import { SentryModule, SentryGlobalFilter } from '@sentry/nestjs/setup';
import { UserAwareThrottlerGuard } from './common/guards/user-aware-throttler.guard';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { buildLoggerConfig } from './common/logging/logger.config';
import { CorrelationIdMiddleware } from './common/middleware/correlation-id.middleware';
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
import {
  Child,
  GrowthRecord,
  CompletedMilestone,
  CompletedVaccination,
  Allergy,
  MedicalCondition,
} from './children/children.model';
import { Report } from './reports/reports.model';
import { Appointment } from './appointments/appointments.model';
import { MasterDataModule } from './master-data/master-data.module';
import { VerificationsModule } from './verifications/verifications.module';
import { ReportsModule } from './reports/reports.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { BlogModule } from './blog/blog.module';
import { BlogPost } from './blog/blog.model';
import { LeadsModule } from './leads/leads.module';
import { SystemLogsModule } from './system-logs/system-logs.module';
import { SystemLog } from './common/models/system-log.model';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    // Load .env globally
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // AsyncLocalStorage store — request-id propagates from the correlation
    // middleware to every async hop without manual threading.
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true, generateId: false },
    }),

    // Structured JSON logging with POPIA redaction. Config encapsulated in
    // common/logging/logger.config.ts. Replaces the default Nest logger.
    LoggerModule.forRoot(buildLoggerConfig()),

    // Sentry error tracking. Init lives in instrumentation.ts so it runs
    // before any Nest module loads; this module wires Sentry into the Nest
    // request lifecycle.
    SentryModule.forRoot(),

    // Rate limiting: three named tiers applied globally via APP_GUARD.
    // - short:  burst protection (any single hot loop)
    // - medium: sustained normal browsing
    // - long:   long-window abuse detection
    // Per-route overrides use @Throttle({ short: { limit, ttl } }) etc.
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 10 },
      { name: 'medium', ttl: 60000, limit: 60 },
      { name: 'long', ttl: 3600000, limit: 1000 },
    ]),

    // TypeORM configured from .env via ConfigService.
    // Prefers DATABASE_URL (Neon / Vercel-Postgres style); falls back to discrete
    // DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME for local Docker dev.
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get<string>('DATABASE_URL');
        const isProd = config.get<string>('NODE_ENV') === 'production';
        const sslEnabled =
          config.get<string>('DB_SSL') === 'true' ||
          (!!databaseUrl && /sslmode=require/.test(databaseUrl));

        const entities = [
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
          BlogPost,
          SystemLog,
        ];

        const base = {
          type: 'postgres' as const,
          entities,
          retryAttempts: 10,
          retryDelay: 3000,
          synchronize: !isProd,
          logging: !isProd,
          ssl: sslEnabled ? { rejectUnauthorized: false } : false,
        };

        if (databaseUrl) {
          return { ...base, url: databaseUrl };
        }

        return {
          ...base,
          host: config.get<string>('DB_HOST'),
          port: config.get<number>('DB_PORT'),
          username: config.get<string>('DB_USER'),
          password: config.get<string>('DB_PASSWORD'),
          database: config.get<string>('DB_NAME'),
        };
      },
    }),

    NotificationsModule,
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
    LeadsModule,
    SystemLogsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: UserAwareThrottlerGuard },
    // SentryGlobalFilter must be the first APP_FILTER so it intercepts
    // exceptions before Nest's default exception filter formats them.
    { provide: APP_FILTER, useClass: SentryGlobalFilter },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
