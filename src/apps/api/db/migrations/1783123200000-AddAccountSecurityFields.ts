import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAccountSecurityFields1783123200000
  implements MigrationInterface
{
  name = 'AddAccountSecurityFields1783123200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "emailVerificationTokenHash" character varying(64)`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "emailVerificationTokenExpiresAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "passwordResetTokenHash" character varying(64)`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "passwordResetTokenExpiresAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "mfaSecret" character varying(64)`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "mfaEnabled" boolean NOT NULL DEFAULT false`,
    );
    // Grandfather accounts created before verification enforcement existed so
    // their logins keep working; new registrations must verify.
    await queryRunner.query(
      `UPDATE "users" SET "emailVerified" = true WHERE "passwordHash" IS NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "mfaEnabled"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "mfaSecret"`);
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "passwordResetTokenExpiresAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "passwordResetTokenHash"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "emailVerificationTokenExpiresAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "emailVerificationTokenHash"`,
    );
  }
}
