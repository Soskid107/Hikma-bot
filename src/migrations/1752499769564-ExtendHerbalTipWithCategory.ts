import { MigrationInterface, QueryRunner } from "typeorm";

export class ExtendHerbalTipWithCategory1752499769564 implements MigrationInterface {
    name = 'ExtendHerbalTipWithCategory1752499769564'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "notification_settings" SET DEFAULT '{"morning": true, "evening": true, "wisdom": true}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "notification_settings" SET DEFAULT '{"wisdom": true, "evening": true, "morning": true}'`);
    }

}
