import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { Example } from '../src/examples/examples.model';
import { User } from '../src/users/users.model';
import { ClinicianProfile } from '../src/users/clinician-profile.model';
import { Tenant } from '../src/tenants/tenants.model';
import { Practice } from '../src/practices/practices.model';
import { Child, GrowthRecord, CompletedMilestone, CompletedVaccination } from '../src/children/children.model';

dotenv.config({ path: '.env' });

/**
 * Standalone TypeORM DataSource used by the TypeORM CLI.
 * (Separate from the NestJS app's runtime DB connection.)
 *
 * Usage:
 *   npm run migration:run
 *   npm run migration:revert
 *   npm run migration:generate -- db/migrations/<MigrationName>
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5433', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password123',
  database: process.env.DB_NAME || 'raisingatlantic',
  entities: [
    Example, 
    User, 
    ClinicianProfile, 
    Tenant, 
    Practice, 
    Child, 
    GrowthRecord, 
    CompletedMilestone, 
    CompletedVaccination
  ],
  migrations: ['db/migrations/*.ts'],
  synchronize: false, // always false when using migrations
  logging: true,
});
