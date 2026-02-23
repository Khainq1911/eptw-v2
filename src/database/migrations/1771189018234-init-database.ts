import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDatabase1771189018234 implements MigrationInterface {
    name = 'InitDatabase1771189018234'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_menu" DROP CONSTRAINT "FK_96d26921e6aa2172256a55a6bc7"`);
        await queryRunner.query(`ALTER TABLE "menu" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "menu" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "menu" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "menu" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "role" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "role" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "work_activity" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "work_activity" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "work_activity" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "work_activity" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "device" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "device" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "template_type" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "template_type" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "template_type" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "template_type" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "template" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "template" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "template" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "template" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "permit" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "permit" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "permit" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "permit" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "role_menu" ADD CONSTRAINT "FK_96d26921e6aa2172256a55a6bc7" FOREIGN KEY ("menu_id") REFERENCES "menu"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_menu" DROP CONSTRAINT "FK_96d26921e6aa2172256a55a6bc7"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "permit" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "permit" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "permit" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "permit" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "template" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "template" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "template" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "template" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "template_type" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "template_type" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "template_type" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "template_type" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "device" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "device" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "work_activity" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "work_activity" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "work_activity" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "work_activity" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "role" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "role" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "menu" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "menu" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "menu" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "menu" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "role_menu" ADD CONSTRAINT "FK_96d26921e6aa2172256a55a6bc7" FOREIGN KEY ("menu_id") REFERENCES "menu"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
