import { MigrationInterface, QueryRunner } from "typeorm";

export class ExtendHerbalTipWithCategory1752067612971 implements MigrationInterface {
    name = 'ExtendHerbalTipWithCategory1752067612971'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "herbal_tips" ADD "category" character varying(50) NOT NULL DEFAULT 'general'`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "notification_settings" SET DEFAULT '{"morning": true, "evening": true, "wisdom": true}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "notification_settings" SET DEFAULT '{"wisdom": true, "evening": true, "morning": true}'`);
        await queryRunner.query(`ALTER TABLE "herbal_tips" DROP COLUMN "category"`);
    }

}
