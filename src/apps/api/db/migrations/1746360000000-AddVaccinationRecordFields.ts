import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVaccinationRecordFields1746360000000 implements MigrationInterface {
    name = 'AddVaccinationRecordFields1746360000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "completed_vaccinations_source_enum" AS ENUM ('CLINICIAN', 'PARENT')
        `);
        await queryRunner.query(`
            ALTER TABLE "completed_vaccinations"
                ADD COLUMN "batchNumber" character varying(100),
                ADD COLUMN "expiryDate" date,
                ADD COLUMN "manufacturer" character varying(255),
                ADD COLUMN "administeredByName" character varying(255),
                ADD COLUMN "clinicName" character varying(255),
                ADD COLUMN "source" "completed_vaccinations_source_enum" NOT NULL DEFAULT 'CLINICIAN'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "completed_vaccinations"
                DROP COLUMN "source",
                DROP COLUMN "clinicName",
                DROP COLUMN "administeredByName",
                DROP COLUMN "manufacturer",
                DROP COLUMN "expiryDate",
                DROP COLUMN "batchNumber"
        `);
        await queryRunner.query(`
            DROP TYPE "completed_vaccinations_source_enum"
        `);
    }
}
