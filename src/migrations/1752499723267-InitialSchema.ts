import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1752499723267 implements MigrationInterface {
    name = 'InitialSchema1752499723267'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "telegram_id" bigint NOT NULL, "username" character varying(50), "first_name" character varying(100), "last_name" character varying(100), "registration_date" TIMESTAMP NOT NULL DEFAULT now(), "current_day" integer NOT NULL DEFAULT '1', "timezone" character varying(50) NOT NULL DEFAULT 'Africa/Lagos', "language_preference" character varying(10) NOT NULL DEFAULT 'en', "healing_path" character varying(20) NOT NULL DEFAULT '21_day', "healing_goals" jsonb, "is_active" boolean NOT NULL DEFAULT true, "is_onboarded" boolean NOT NULL DEFAULT false, "last_interaction" TIMESTAMP NOT NULL DEFAULT now(), "notification_settings" jsonb NOT NULL DEFAULT '{"morning": true, "evening": true, "wisdom": true}', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_1a1e4649fd31ea6ec6b025c7bfc" UNIQUE ("telegram_id"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "daily_checklist" ("id" SERIAL NOT NULL, "day_number" integer NOT NULL, "checklist_date" TIMESTAMP NOT NULL, "warm_water" boolean NOT NULL DEFAULT false, "black_seed_garlic" boolean NOT NULL DEFAULT false, "light_food_before_8pm" boolean NOT NULL DEFAULT false, "sleep_time" boolean NOT NULL DEFAULT false, "thought_clearing" boolean NOT NULL DEFAULT false, "completion_percentage" integer NOT NULL DEFAULT '0', "completed_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_476fbc2951720c80730d283fd39" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "journal_entries" ("id" SERIAL NOT NULL, "entry_date" TIMESTAMP NOT NULL, "entry_text" text, "mood_rating" integer, "energy_level" integer, "sleep_quality" integer, "physical_symptoms" text, "spiritual_notes" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_a70368e64230434457c8d007ab3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "progress_tracking" ("id" SERIAL NOT NULL, "total_days_completed" integer NOT NULL DEFAULT '0', "current_streak" integer NOT NULL DEFAULT '0', "longest_streak" integer NOT NULL DEFAULT '0', "last_active_date" TIMESTAMP, "milestones_achieved" text array, "completion_rate" numeric(5,2) NOT NULL DEFAULT '0', "healing_score" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_7896c8854b95be1c2db02c8b75f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "scheduled_messages" ("id" SERIAL NOT NULL, "message_type" character varying(50) NOT NULL, "scheduled_time" TIME NOT NULL, "timezone" character varying(50) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "last_sent" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_7cd15ea89ad2fc7896baa748416" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_interactions" ("id" SERIAL NOT NULL, "interaction_type" character varying(50) NOT NULL, "command_used" character varying(100), "response_data" jsonb, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_173313ad3f40a2ae74b48f82dd7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "wisdom_quotes" ("id" SERIAL NOT NULL, "quote_text" text NOT NULL, "quote_arabic" text, "author" character varying(100) NOT NULL DEFAULT 'Ibn Sina', "category" character varying(50), "day_number" integer, "difficulty_level" integer NOT NULL DEFAULT '1', "extended_teaching" text, "tags" text array, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cf23ba06be940dca9a2bbdddab5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "herbal_tips" ("id" SERIAL NOT NULL, "tip_text" text NOT NULL, "herb_name" character varying(100) NOT NULL, "local_names" jsonb, "scientific_name" character varying(150), "benefits" text array, "usage_instructions" text, "precautions" text, "seasonal_availability" character varying(50), "category" character varying(50) NOT NULL DEFAULT 'general', "region" character varying(50) NOT NULL DEFAULT 'West Africa', "image_url" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_93298c53b04e74fc44a084867d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "daily_checklist" ADD CONSTRAINT "FK_57b2384e53dbd7d1692d73d9d5c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "journal_entries" ADD CONSTRAINT "FK_bf5147ed303e809a150f1f40237" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "progress_tracking" ADD CONSTRAINT "FK_2c7a69029449d557c1adf3ef09c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scheduled_messages" ADD CONSTRAINT "FK_9d10ac9b949d18c17839e9c66a4" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_interactions" ADD CONSTRAINT "FK_3a2640fade228643f526c8ad73a" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_interactions" DROP CONSTRAINT "FK_3a2640fade228643f526c8ad73a"`);
        await queryRunner.query(`ALTER TABLE "scheduled_messages" DROP CONSTRAINT "FK_9d10ac9b949d18c17839e9c66a4"`);
        await queryRunner.query(`ALTER TABLE "progress_tracking" DROP CONSTRAINT "FK_2c7a69029449d557c1adf3ef09c"`);
        await queryRunner.query(`ALTER TABLE "journal_entries" DROP CONSTRAINT "FK_bf5147ed303e809a150f1f40237"`);
        await queryRunner.query(`ALTER TABLE "daily_checklist" DROP CONSTRAINT "FK_57b2384e53dbd7d1692d73d9d5c"`);
        await queryRunner.query(`DROP TABLE "herbal_tips"`);
        await queryRunner.query(`DROP TABLE "wisdom_quotes"`);
        await queryRunner.query(`DROP TABLE "user_interactions"`);
        await queryRunner.query(`DROP TABLE "scheduled_messages"`);
        await queryRunner.query(`DROP TABLE "progress_tracking"`);
        await queryRunner.query(`DROP TABLE "journal_entries"`);
        await queryRunner.query(`DROP TABLE "daily_checklist"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
