import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMenu1769533994634 implements MigrationInterface {
    name = 'CreateMenu1769533994634'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "menu" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "code" character varying NOT NULL, "url" character varying NOT NULL, "icon" character varying NOT NULL, "parent_id" character varying, CONSTRAINT "UQ_a15b1f45a3ebfb807137e1287cd" UNIQUE ("code"), CONSTRAINT "UQ_7d5c6a646fc170e384568c63571" UNIQUE ("url"), CONSTRAINT "PK_35b2a8f47d153ff7a41860cceeb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role_menu" ("role_id" integer NOT NULL, "menu_id" integer NOT NULL, CONSTRAINT "PK_ec8ce21a3846c0f4f3b59c3d310" PRIMARY KEY ("role_id", "menu_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_25f45e543fbda0c91da4af7a2a" ON "role_menu" ("role_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_96d26921e6aa2172256a55a6bc" ON "role_menu" ("menu_id") `);
        await queryRunner.query(`ALTER TABLE "role" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "role" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561"`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "role_id_seq" OWNED BY "role"."id"`);
        await queryRunner.query(`ALTER TABLE "role" ALTER COLUMN "id" SET DEFAULT nextval('"role_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "user_phone"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_menu" ADD CONSTRAINT "FK_25f45e543fbda0c91da4af7a2a9" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role_menu" ADD CONSTRAINT "FK_96d26921e6aa2172256a55a6bc7" FOREIGN KEY ("menu_id") REFERENCES "menu"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_menu" DROP CONSTRAINT "FK_96d26921e6aa2172256a55a6bc7"`);
        await queryRunner.query(`ALTER TABLE "role_menu" DROP CONSTRAINT "FK_25f45e543fbda0c91da4af7a2a9"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "user_phone" UNIQUE ("phone")`);
        await queryRunner.query(`ALTER TABLE "role" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "role_id_seq"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "created_at"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_96d26921e6aa2172256a55a6bc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_25f45e543fbda0c91da4af7a2a"`);
        await queryRunner.query(`DROP TABLE "role_menu"`);
        await queryRunner.query(`DROP TABLE "menu"`);
    }

}
