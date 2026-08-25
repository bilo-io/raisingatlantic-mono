import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddClinicianVerificationFields1782686400000
  implements MigrationInterface
{
  name = 'AddClinicianVerificationFields1782686400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."clinician_profiles_verificationstatus_enum" AS ENUM('pending', 'verified', 'rejected')`,
    );
    await queryRunner.query(
      `ALTER TABLE "clinician_profiles" ADD "hpcsaNumber" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "clinician_profiles" ADD "sancNumber" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "clinician_profiles" ADD "verificationStatus" "public"."clinician_profiles_verificationstatus_enum" NOT NULL DEFAULT 'pending'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "clinician_profiles" DROP COLUMN "verificationStatus"`,
    );
    await queryRunner.query(
      `ALTER TABLE "clinician_profiles" DROP COLUMN "sancNumber"`,
    );
    await queryRunner.query(
      `ALTER TABLE "clinician_profiles" DROP COLUMN "hpcsaNumber"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."clinician_profiles_verificationstatus_enum"`,
    );
  }
}
