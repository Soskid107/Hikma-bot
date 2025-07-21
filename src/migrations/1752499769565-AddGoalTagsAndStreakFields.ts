import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGoalTagsAndStreakFields1752499769565 implements MigrationInterface {
    name = 'AddGoalTagsAndStreakFields1752499769565'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "current_streak" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "total_days_completed" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "last_checklist_date" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "goal_tags" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "goal_tags"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "last_checklist_date"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "total_days_completed"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "current_streak"`);
    }
} 