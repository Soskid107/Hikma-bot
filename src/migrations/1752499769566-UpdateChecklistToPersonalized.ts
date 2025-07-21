import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateChecklistToPersonalized1752499769566 implements MigrationInterface {
    name = 'UpdateChecklistToPersonalized1752499769566'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add new columns
        await queryRunner.query(`ALTER TABLE "daily_checklist" ADD "checklist_items" json NOT NULL DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "daily_checklist" ADD "daily_focus" text`);
        await queryRunner.query(`ALTER TABLE "daily_checklist" ADD "daily_tip" text`);
        await queryRunner.query(`ALTER TABLE "daily_checklist" ADD "daily_quote" text`);
        
        // Drop old columns
        await queryRunner.query(`ALTER TABLE "daily_checklist" DROP COLUMN "warm_water"`);
        await queryRunner.query(`ALTER TABLE "daily_checklist" DROP COLUMN "black_seed_garlic"`);
        await queryRunner.query(`ALTER TABLE "daily_checklist" DROP COLUMN "light_food_before_8pm"`);
        await queryRunner.query(`ALTER TABLE "daily_checklist" DROP COLUMN "sleep_time"`);
        await queryRunner.query(`ALTER TABLE "daily_checklist" DROP COLUMN "thought_clearing"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Recreate old columns
        await queryRunner.query(`ALTER TABLE "daily_checklist" ADD "warm_water" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "daily_checklist" ADD "black_seed_garlic" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "daily_checklist" ADD "light_food_before_8pm" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "daily_checklist" ADD "sleep_time" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "daily_checklist" ADD "thought_clearing" boolean NOT NULL DEFAULT false`);
        
        // Drop new columns
        await queryRunner.query(`ALTER TABLE "daily_checklist" DROP COLUMN "daily_quote"`);
        await queryRunner.query(`ALTER TABLE "daily_checklist" DROP COLUMN "daily_tip"`);
        await queryRunner.query(`ALTER TABLE "daily_checklist" DROP COLUMN "daily_focus"`);
        await queryRunner.query(`ALTER TABLE "daily_checklist" DROP COLUMN "checklist_items"`);
    }
} 