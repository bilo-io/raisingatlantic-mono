import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAuthFieldsToUser1782518400000 implements MigrationInterface {
  name = 'AddAuthFieldsToUser1782518400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_authprovider_enum" AS ENUM('email', 'google')`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "passwordHash" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "googleId" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_users_googleId" UNIQUE ("googleId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "authProvider" "public"."users_authprovider_enum" NOT NULL DEFAULT 'email'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "emailVerified" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "emailVerified"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "authProvider"`);
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_users_googleId"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "googleId"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "passwordHash"`);
    await queryRunner.query(`DROP TYPE "public"."users_authprovider_enum"`);
  }
}
