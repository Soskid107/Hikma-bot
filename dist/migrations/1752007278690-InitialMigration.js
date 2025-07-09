"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialMigration1752007278690 = void 0;
class InitialMigration1752007278690 {
    constructor() {
        this.name = 'InitialMigration1752007278690';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "telegram_id" bigint NOT NULL, "username" character varying(50), "first_name" character varying(100), "last_name" character varying(100), "registration_date" TIMESTAMP NOT NULL DEFAULT now(), "current_day" integer NOT NULL DEFAULT '1', "timezone" character varying(50) NOT NULL DEFAULT 'Africa/Lagos', "language_preference" character varying(10) NOT NULL DEFAULT 'en', "healing_path" character varying(20) NOT NULL DEFAULT '21_day', "is_active" boolean NOT NULL DEFAULT true, "last_interaction" TIMESTAMP NOT NULL DEFAULT now(), "notification_settings" jsonb NOT NULL DEFAULT '{"morning": true, "evening": true, "wisdom": true}', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_1a1e4649fd31ea6ec6b025c7bfc" UNIQUE ("telegram_id"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "users"`);
    }
}
exports.InitialMigration1752007278690 = InitialMigration1752007278690;
