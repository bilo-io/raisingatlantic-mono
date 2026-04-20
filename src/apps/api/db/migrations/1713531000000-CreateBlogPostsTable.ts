import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBlogPostsTable1713531000000 implements MigrationInterface {
    name = 'CreateBlogPostsTable1713531000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "blog_posts" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying(255) NOT NULL,
                "slug" character varying(255) NOT NULL,
                "shortDescription" text NOT NULL,
                "imageUrl" character varying(512),
                "synopsis" text NOT NULL,
                "body" text NOT NULL,
                "isPublished" boolean NOT NULL DEFAULT false,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_blog_posts" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_blog_posts_slug" ON "blog_posts" ("slug")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "IDX_blog_posts_slug"
        `);
        await queryRunner.query(`
            DROP TABLE "blog_posts"
        `);
    }
}
