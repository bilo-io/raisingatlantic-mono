import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1777901196470 implements MigrationInterface {
  name = 'InitialSchema1777901196470';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(
      `CREATE TABLE "examples" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "description" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ea56499b0a3a29593d3405080e8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tenants_status_enum" AS ENUM('Active', 'Inactive', 'Archived', 'Discharged', 'Pending Assessment')`,
    );
    await queryRunner.query(
      `CREATE TABLE "tenants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "website" character varying(255), "email" character varying(255) NOT NULL, "phone" character varying(50) NOT NULL, "imageUrl" text, "status" "public"."tenants_status_enum" NOT NULL DEFAULT 'Active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_53be67a04681c66b87ee27c9321" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."practices_status_enum" AS ENUM('Active', 'Inactive', 'Archived', 'Discharged', 'Pending Assessment')`,
    );
    await queryRunner.query(
      `CREATE TABLE "practices" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "address" character varying(255) NOT NULL, "city" character varying(100) NOT NULL, "state" character varying(50) NOT NULL, "zip" character varying(20) NOT NULL, "phone" character varying(50) NOT NULL, "email" character varying(255), "website" character varying(255), "latitude" numeric(10,7), "longitude" numeric(10,7), "status" "public"."practices_status_enum" NOT NULL DEFAULT 'Active', "manager" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid, CONSTRAINT "PK_0934829c5859a843625e6ff1c34" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "clinician_profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "specialty" character varying(255) NOT NULL, "bio" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "REL_a7158a459820d97403d7ca4be3" UNIQUE ("userId"), CONSTRAINT "PK_003b999b8ae7c5b216f6ced39f2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('parent', 'clinician', 'admin', 'super_admin')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255), "name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "phone" character varying(50) NOT NULL, "imageUrl" text, "role" "public"."users_role_enum" NOT NULL DEFAULT 'parent', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."children_gender_enum" AS ENUM('male', 'female')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."children_status_enum" AS ENUM('Active', 'Inactive', 'Archived', 'Discharged', 'Pending Assessment')`,
    );
    await queryRunner.query(
      `CREATE TABLE "children" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "firstName" character varying(255) NOT NULL, "lastName" character varying(255) NOT NULL, "gender" "public"."children_gender_enum" NOT NULL, "dateOfBirth" date NOT NULL, "imageUrl" text, "status" "public"."children_status_enum" NOT NULL DEFAULT 'Active', "notes" text, "progress" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "parentId" uuid, "clinicianId" uuid, CONSTRAINT "PK_8c5a7cbebf2c702830ef38d22b0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."growth_records_status_enum" AS ENUM('Active', 'Inactive', 'Archived', 'Discharged', 'Pending Assessment')`,
    );
    await queryRunner.query(
      `CREATE TABLE "growth_records" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" date NOT NULL, "height" character varying(50), "weight" character varying(50), "headCircumference" character varying(50), "notes" text, "status" "public"."growth_records_status_enum" NOT NULL DEFAULT 'Active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "childId" uuid, "recordedById" uuid, CONSTRAINT "PK_7c1f103d898da6153bb7a092b6c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."completed_milestones_status_enum" AS ENUM('Active', 'Inactive', 'Archived', 'Discharged', 'Pending Assessment')`,
    );
    await queryRunner.query(
      `CREATE TABLE "completed_milestones" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "milestoneId" character varying(255) NOT NULL, "dateAchieved" date NOT NULL, "notes" text, "status" "public"."completed_milestones_status_enum" NOT NULL DEFAULT 'Active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "childId" uuid, "recordedById" uuid, CONSTRAINT "PK_1fab3229b6dd4cd33fe2a287242" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."completed_vaccinations_source_enum" AS ENUM('CLINICIAN', 'PARENT')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."completed_vaccinations_status_enum" AS ENUM('Active', 'Inactive', 'Archived', 'Discharged', 'Pending Assessment')`,
    );
    await queryRunner.query(
      `CREATE TABLE "completed_vaccinations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "vaccineId" character varying(255) NOT NULL, "dateAdministered" date NOT NULL, "batchNumber" character varying(100), "expiryDate" date, "manufacturer" character varying(255), "administeredByName" character varying(255), "clinicName" character varying(255), "source" "public"."completed_vaccinations_source_enum" NOT NULL DEFAULT 'CLINICIAN', "status" "public"."completed_vaccinations_status_enum" NOT NULL DEFAULT 'Active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "childId" uuid, "recordedById" uuid, CONSTRAINT "PK_04f6174e711a3ac68593a432701" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."allergies_severity_enum" AS ENUM('mild', 'moderate', 'severe')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."allergies_status_enum" AS ENUM('Active', 'Inactive', 'Archived', 'Discharged', 'Pending Assessment')`,
    );
    await queryRunner.query(
      `CREATE TABLE "allergies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "allergen" character varying(255) NOT NULL, "severity" "public"."allergies_severity_enum" NOT NULL DEFAULT 'mild', "notes" text, "status" "public"."allergies_status_enum" NOT NULL DEFAULT 'Active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "childId" uuid, CONSTRAINT "PK_f72e0cf363a832b8fa8cf657118" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."medical_conditions_status_enum" AS ENUM('Active', 'Inactive', 'Archived', 'Discharged', 'Pending Assessment')`,
    );
    await queryRunner.query(
      `CREATE TABLE "medical_conditions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "conditionName" character varying(255) NOT NULL, "diagnosisDate" date, "notes" text, "status" "public"."medical_conditions_status_enum" NOT NULL DEFAULT 'Active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "childId" uuid, CONSTRAINT "PK_6940b21f19990e9c3cf850cbee4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."reports_type_enum" AS ENUM('CRECHE_ADMISSION', 'PROGRESS_REPORT', 'CLINICAL_SUMMARY')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."reports_status_enum" AS ENUM('Active', 'Inactive', 'Archived', 'Discharged', 'Pending Assessment')`,
    );
    await queryRunner.query(
      `CREATE TABLE "reports" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."reports_type_enum" NOT NULL, "status" "public"."reports_status_enum" NOT NULL DEFAULT 'Active', "content" jsonb, "pdfUrl" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "childId" uuid, "generatedById" uuid, CONSTRAINT "PK_d9013193989303580053c0b5ef6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."appointments_status_enum" AS ENUM('SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW')`,
    );
    await queryRunner.query(
      `CREATE TABLE "appointments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "scheduledAt" TIMESTAMP NOT NULL, "status" "public"."appointments_status_enum" NOT NULL DEFAULT 'SCHEDULED', "notes" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "childId" uuid, "clinicianId" uuid, "practiceId" uuid, CONSTRAINT "PK_4a437a9a27e948726b8bb3e36ad" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "blog_posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "slug" character varying(255) NOT NULL, "shortDescription" text NOT NULL, "imageUrl" character varying(512), "synopsis" text NOT NULL, "body" text NOT NULL, "isPublished" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_dd2add25eac93daefc93da9d387" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_5b2818a2c45c3edb9991b1c7a5" ON "blog_posts" ("slug") `,
    );
    await queryRunner.query(
      `CREATE TABLE "system_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying(100) NOT NULL, "message" text NOT NULL, "metadata" jsonb, "ipAddress" character varying(50), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_56861c4b9d16aa90259f4ce0a2c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "practice_clinicians" ("practicesId" uuid NOT NULL, "clinicianProfilesId" uuid NOT NULL, CONSTRAINT "PK_ddd2ed2d5a57bb0a62ec7ca444a" PRIMARY KEY ("practicesId", "clinicianProfilesId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1a79f4612b8fc6d35e25922c9a" ON "practice_clinicians" ("practicesId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_56b9d994aa5542a6d0e89b2450" ON "practice_clinicians" ("clinicianProfilesId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "practices" ADD CONSTRAINT "FK_93e4318859b60687de169acd71a" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "clinician_profiles" ADD CONSTRAINT "FK_a7158a459820d97403d7ca4be32" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "children" ADD CONSTRAINT "FK_b65f0ac2a8c620dc69f8d75a4f0" FOREIGN KEY ("parentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "children" ADD CONSTRAINT "FK_e84b2f0bb2588162849b715c3d3" FOREIGN KEY ("clinicianId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "growth_records" ADD CONSTRAINT "FK_0c82c8cf31439f3d6429d735bbf" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "growth_records" ADD CONSTRAINT "FK_5155b4e9e51ace42af4ce5359a1" FOREIGN KEY ("recordedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "completed_milestones" ADD CONSTRAINT "FK_170ee66aba83782ea08e04614de" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "completed_milestones" ADD CONSTRAINT "FK_650be59f36b3ce8ba805f380112" FOREIGN KEY ("recordedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "completed_vaccinations" ADD CONSTRAINT "FK_36892108583bd05133ba6b262bb" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "completed_vaccinations" ADD CONSTRAINT "FK_a2532c45410eb6f4941704eaf09" FOREIGN KEY ("recordedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "allergies" ADD CONSTRAINT "FK_278b60b54428a6401baf7128238" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "medical_conditions" ADD CONSTRAINT "FK_677c4e255c5a3001c4769799c65" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reports" ADD CONSTRAINT "FK_354290844858ece862cdf516014" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reports" ADD CONSTRAINT "FK_d3d65c7e12b3c642405fd1fbdc6" FOREIGN KEY ("generatedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "FK_862d939a9f4040bd20a5f212fbe" FOREIGN KEY ("childId") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "FK_e2018f5d8df109c739834b8b5a0" FOREIGN KEY ("clinicianId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "FK_929059751674a69f45cc1ee39ef" FOREIGN KEY ("practiceId") REFERENCES "practices"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "practice_clinicians" ADD CONSTRAINT "FK_1a79f4612b8fc6d35e25922c9a8" FOREIGN KEY ("practicesId") REFERENCES "practices"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "practice_clinicians" ADD CONSTRAINT "FK_56b9d994aa5542a6d0e89b2450f" FOREIGN KEY ("clinicianProfilesId") REFERENCES "clinician_profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "practice_clinicians" DROP CONSTRAINT "FK_56b9d994aa5542a6d0e89b2450f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "practice_clinicians" DROP CONSTRAINT "FK_1a79f4612b8fc6d35e25922c9a8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_929059751674a69f45cc1ee39ef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_e2018f5d8df109c739834b8b5a0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_862d939a9f4040bd20a5f212fbe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reports" DROP CONSTRAINT "FK_d3d65c7e12b3c642405fd1fbdc6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reports" DROP CONSTRAINT "FK_354290844858ece862cdf516014"`,
    );
    await queryRunner.query(
      `ALTER TABLE "medical_conditions" DROP CONSTRAINT "FK_677c4e255c5a3001c4769799c65"`,
    );
    await queryRunner.query(
      `ALTER TABLE "allergies" DROP CONSTRAINT "FK_278b60b54428a6401baf7128238"`,
    );
    await queryRunner.query(
      `ALTER TABLE "completed_vaccinations" DROP CONSTRAINT "FK_a2532c45410eb6f4941704eaf09"`,
    );
    await queryRunner.query(
      `ALTER TABLE "completed_vaccinations" DROP CONSTRAINT "FK_36892108583bd05133ba6b262bb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "completed_milestones" DROP CONSTRAINT "FK_650be59f36b3ce8ba805f380112"`,
    );
    await queryRunner.query(
      `ALTER TABLE "completed_milestones" DROP CONSTRAINT "FK_170ee66aba83782ea08e04614de"`,
    );
    await queryRunner.query(
      `ALTER TABLE "growth_records" DROP CONSTRAINT "FK_5155b4e9e51ace42af4ce5359a1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "growth_records" DROP CONSTRAINT "FK_0c82c8cf31439f3d6429d735bbf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "children" DROP CONSTRAINT "FK_e84b2f0bb2588162849b715c3d3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "children" DROP CONSTRAINT "FK_b65f0ac2a8c620dc69f8d75a4f0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "clinician_profiles" DROP CONSTRAINT "FK_a7158a459820d97403d7ca4be32"`,
    );
    await queryRunner.query(
      `ALTER TABLE "practices" DROP CONSTRAINT "FK_93e4318859b60687de169acd71a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_56b9d994aa5542a6d0e89b2450"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1a79f4612b8fc6d35e25922c9a"`,
    );
    await queryRunner.query(`DROP TABLE "practice_clinicians"`);
    await queryRunner.query(`DROP TABLE "system_logs"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5b2818a2c45c3edb9991b1c7a5"`,
    );
    await queryRunner.query(`DROP TABLE "blog_posts"`);
    await queryRunner.query(`DROP TABLE "appointments"`);
    await queryRunner.query(`DROP TYPE "public"."appointments_status_enum"`);
    await queryRunner.query(`DROP TABLE "reports"`);
    await queryRunner.query(`DROP TYPE "public"."reports_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."reports_type_enum"`);
    await queryRunner.query(`DROP TABLE "medical_conditions"`);
    await queryRunner.query(
      `DROP TYPE "public"."medical_conditions_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "allergies"`);
    await queryRunner.query(`DROP TYPE "public"."allergies_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."allergies_severity_enum"`);
    await queryRunner.query(`DROP TABLE "completed_vaccinations"`);
    await queryRunner.query(
      `DROP TYPE "public"."completed_vaccinations_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."completed_vaccinations_source_enum"`,
    );
    await queryRunner.query(`DROP TABLE "completed_milestones"`);
    await queryRunner.query(
      `DROP TYPE "public"."completed_milestones_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "growth_records"`);
    await queryRunner.query(`DROP TYPE "public"."growth_records_status_enum"`);
    await queryRunner.query(`DROP TABLE "children"`);
    await queryRunner.query(`DROP TYPE "public"."children_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."children_gender_enum"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(`DROP TABLE "clinician_profiles"`);
    await queryRunner.query(`DROP TABLE "practices"`);
    await queryRunner.query(`DROP TYPE "public"."practices_status_enum"`);
    await queryRunner.query(`DROP TABLE "tenants"`);
    await queryRunner.query(`DROP TYPE "public"."tenants_status_enum"`);
    await queryRunner.query(`DROP TABLE "examples"`);
  }
}
