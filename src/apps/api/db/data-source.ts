import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { Example } from '../src/examples/examples.model';
import { User } from '../src/users/users.model';
import { ClinicianProfile } from '../src/users/clinician-profile.model';
import { Tenant } from '../src/tenants/tenants.model';
import { Practice } from '../src/practices/practices.model';
import { Child, GrowthRecord, CompletedMilestone, CompletedVaccination, Allergy, MedicalCondition } from '../src/children/children.model';
import { Report } from '../src/reports/reports.model';
import { Appointment } from '../src/appointments/appointments.model';
import { BlogPost } from '../src/blog/blog.model';
import { SystemLog } from '../src/common/models/system-log.model';

dotenv.config({ path: '.env' });

/**
 * Standalone TypeORM DataSource used by the TypeORM CLI and the seed script.
 * (Separate from the NestJS app's runtime DB connection.)
 *
 * Connection precedence:
 *   1. DATABASE_URL (Neon / Vercel-Postgres style — used for hosted environments)
 *   2. DB_HOST / DB_PORT / DB_USER / DB_PASSWORD / DB_NAME (local Docker dev)
 *
 * Usage:
 *   npm run db:migration:run
 *   npm run db:migration:revert
 *   npm run db:migration:generate -- db/migrations/<MigrationName>
 *   npm run db:seed
 */
const databaseUrl = process.env.DATABASE_URL;
const sslEnabled =
  process.env.DB_SSL === 'true' ||
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
  migrations: ['db/migrations/*.ts'],
  synchronize: false, // always false when using migrations
  logging: true,
  ssl: sslEnabled ? { rejectUnauthorized: false } : false,
};

export const AppDataSource = new DataSource(
  databaseUrl
    ? { ...base, url: databaseUrl }
    : {
        ...base,
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT ?? '5433', 10),
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'password123',
        database: process.env.DB_NAME || 'raisingatlantic',
      },
);
