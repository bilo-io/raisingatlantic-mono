import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { Example } from '../src/examples/examples.model';

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
  entities: [Example],
  migrations: ['db/migrations/*.ts'],
  synchronize: false, // always false when using migrations
  logging: true,
});
