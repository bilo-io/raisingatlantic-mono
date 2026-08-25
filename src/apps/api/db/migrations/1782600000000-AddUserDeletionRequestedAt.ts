import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserDeletionRequestedAt1782600000000
  implements MigrationInterface
{
  name = 'AddUserDeletionRequestedAt1782600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "deletionRequestedAt" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "deletionRequestedAt"`,
    );
  }
}
