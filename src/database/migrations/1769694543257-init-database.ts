import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDatabase1769694543257 implements MigrationInterface {
    name = 'InitDatabase1769694543257'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "device" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "code" character varying NOT NULL, "is_used" boolean NOT NULL, "description" character varying, "location" jsonb, "status" character varying NOT NULL DEFAULT 'active', CONSTRAINT "UQ_f443a15b68542d0a53a2b8c4723" UNIQUE ("code"), CONSTRAINT "PK_2dc10972aa4e27c01378dad2c72" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "menu" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "code" character varying NOT NULL, "url" character varying NOT NULL, "icon" character varying NOT NULL, "parent_id" character varying, CONSTRAINT "UQ_a15b1f45a3ebfb807137e1287cd" UNIQUE ("code"), CONSTRAINT "UQ_7d5c6a646fc170e384568c63571" UNIQUE ("url"), CONSTRAINT "PK_35b2a8f47d153ff7a41860cceeb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "alias" character varying NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permit_log" ("id" SERIAL NOT NULL, "action" character varying(50) NOT NULL, "comment" text, "created_at" TIMESTAMP DEFAULT now(), "permit_id" integer, "user_id" integer, CONSTRAINT "PK_25b676c428ef6c8f57a5092761e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "permit_log_pkey" ON "permit_log" ("id") `);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" text NOT NULL, "phone" character varying NOT NULL, "refresh_token" text, "role_id" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permit_file" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "type" character varying(100), "size" bigint, "bucket" character varying(255) NOT NULL, "object_key" character varying(512) NOT NULL, "url" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "permit_id" integer, CONSTRAINT "PK_06955662d098e05817fc65379c9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "approval_type" ("id" integer NOT NULL, "name" character varying(50) NOT NULL, "code" character varying(10) NOT NULL, "description" text, CONSTRAINT "UQ_8efc469ea388626db17ffd68e2c" UNIQUE ("name"), CONSTRAINT "PK_4fe640279a138a927266159da1f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "template_type" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying, "deletedAt" TIMESTAMP, CONSTRAINT "PK_7eba6f75600e8ea421b38a8472d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "template" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying, "sections" jsonb, "approval_type_id" integer NOT NULL, "template_type_id" integer NOT NULL, "deleted_at" TIMESTAMP, "created_id" integer, "updated_id" integer, "deleted_id" integer, CONSTRAINT "PK_fbae2ac36bd9b5e1e793b957b7f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permit_sign" ("id" SERIAL NOT NULL, "permit_id" integer NOT NULL, "section_id" integer NOT NULL, "signer_id" integer NOT NULL, "sign_url" text, "reason" text, "status" character varying(50), "signed_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(), CONSTRAINT "PK_4d3eeca6b6ce2ae4f87cf597b30" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permit" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" text, "people_number" integer NOT NULL, "location" text, "company_name" character varying NOT NULL, "start_time" TIMESTAMP NOT NULL, "end_time" TIMESTAMP NOT NULL, "status" character varying NOT NULL DEFAULT 'Pending', "sections" jsonb NOT NULL, "created_id" integer, "updated_id" integer, "template_id" integer, CONSTRAINT "PK_2391da0f3ffdb3315e96908b776" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "work_activity" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" text, "category" character varying, "risk_level" character varying, CONSTRAINT "PK_d019c93ed3493664fd1ffe8dc79" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role_menu" ("role_id" integer NOT NULL, "menu_id" integer NOT NULL, CONSTRAINT "PK_ec8ce21a3846c0f4f3b59c3d310" PRIMARY KEY ("role_id", "menu_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_25f45e543fbda0c91da4af7a2a" ON "role_menu" ("role_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_96d26921e6aa2172256a55a6bc" ON "role_menu" ("menu_id") `);
        await queryRunner.query(`CREATE TABLE "permit_work_activity" ("permit_id" integer NOT NULL, "work_activity_id" integer NOT NULL, CONSTRAINT "PK_52b90777305ad9704af67bc384f" PRIMARY KEY ("permit_id", "work_activity_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_14147cddabd3275be41ad0df8e" ON "permit_work_activity" ("permit_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_e56d51ff781e9ead7ebb50b36c" ON "permit_work_activity" ("work_activity_id") `);
        await queryRunner.query(`CREATE TABLE "permit_device" ("permit_id" integer NOT NULL, "device_id" integer NOT NULL, CONSTRAINT "PK_f9c823cf32b8e3c1c1754242efd" PRIMARY KEY ("permit_id", "device_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6165751a327ef5273f8ed5805f" ON "permit_device" ("permit_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_66a050e75bf7312d0379d8b4ff" ON "permit_device" ("device_id") `);
        await queryRunner.query(`ALTER TABLE "permit_log" ADD CONSTRAINT "FK_299322cc73d5128afa7bae9c8bd" FOREIGN KEY ("permit_id") REFERENCES "permit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permit_log" ADD CONSTRAINT "FK_bf2d2aef10becdcfd354be9fb0a" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permit_file" ADD CONSTRAINT "FK_423208597ba09b58db7355209a1" FOREIGN KEY ("permit_id") REFERENCES "permit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "template" ADD CONSTRAINT "FK_bc44347ed011f454a43027818ff" FOREIGN KEY ("approval_type_id") REFERENCES "approval_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "template" ADD CONSTRAINT "FK_1dcaef121da417bb07dbd2551df" FOREIGN KEY ("template_type_id") REFERENCES "template_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "template" ADD CONSTRAINT "FK_6d74b700ed9eb7bf3bee434a389" FOREIGN KEY ("created_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "template" ADD CONSTRAINT "FK_0b92e532069b6f50d288ae7289f" FOREIGN KEY ("updated_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "template" ADD CONSTRAINT "FK_4a627d8453d6630e2ff4c5853de" FOREIGN KEY ("deleted_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permit_sign" ADD CONSTRAINT "FK_518576d0ac4f92a6b9546610e68" FOREIGN KEY ("permit_id") REFERENCES "permit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permit_sign" ADD CONSTRAINT "FK_257976f5a4f37f8c6963b29d55f" FOREIGN KEY ("signer_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permit" ADD CONSTRAINT "FK_4f545f1ca0ae4544f47dee4ea69" FOREIGN KEY ("created_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permit" ADD CONSTRAINT "FK_8a16691d59f824b0b1204d5b080" FOREIGN KEY ("updated_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permit" ADD CONSTRAINT "FK_48b40db48a1257984a44f389f3a" FOREIGN KEY ("template_id") REFERENCES "template"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_menu" ADD CONSTRAINT "FK_25f45e543fbda0c91da4af7a2a9" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role_menu" ADD CONSTRAINT "FK_96d26921e6aa2172256a55a6bc7" FOREIGN KEY ("menu_id") REFERENCES "menu"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "permit_work_activity" ADD CONSTRAINT "FK_14147cddabd3275be41ad0df8e1" FOREIGN KEY ("permit_id") REFERENCES "permit"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "permit_work_activity" ADD CONSTRAINT "FK_e56d51ff781e9ead7ebb50b36c2" FOREIGN KEY ("work_activity_id") REFERENCES "work_activity"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "permit_device" ADD CONSTRAINT "FK_6165751a327ef5273f8ed5805f0" FOREIGN KEY ("permit_id") REFERENCES "permit"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "permit_device" ADD CONSTRAINT "FK_66a050e75bf7312d0379d8b4ff5" FOREIGN KEY ("device_id") REFERENCES "device"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permit_device" DROP CONSTRAINT "FK_66a050e75bf7312d0379d8b4ff5"`);
        await queryRunner.query(`ALTER TABLE "permit_device" DROP CONSTRAINT "FK_6165751a327ef5273f8ed5805f0"`);
        await queryRunner.query(`ALTER TABLE "permit_work_activity" DROP CONSTRAINT "FK_e56d51ff781e9ead7ebb50b36c2"`);
        await queryRunner.query(`ALTER TABLE "permit_work_activity" DROP CONSTRAINT "FK_14147cddabd3275be41ad0df8e1"`);
        await queryRunner.query(`ALTER TABLE "role_menu" DROP CONSTRAINT "FK_96d26921e6aa2172256a55a6bc7"`);
        await queryRunner.query(`ALTER TABLE "role_menu" DROP CONSTRAINT "FK_25f45e543fbda0c91da4af7a2a9"`);
        await queryRunner.query(`ALTER TABLE "permit" DROP CONSTRAINT "FK_48b40db48a1257984a44f389f3a"`);
        await queryRunner.query(`ALTER TABLE "permit" DROP CONSTRAINT "FK_8a16691d59f824b0b1204d5b080"`);
        await queryRunner.query(`ALTER TABLE "permit" DROP CONSTRAINT "FK_4f545f1ca0ae4544f47dee4ea69"`);
        await queryRunner.query(`ALTER TABLE "permit_sign" DROP CONSTRAINT "FK_257976f5a4f37f8c6963b29d55f"`);
        await queryRunner.query(`ALTER TABLE "permit_sign" DROP CONSTRAINT "FK_518576d0ac4f92a6b9546610e68"`);
        await queryRunner.query(`ALTER TABLE "template" DROP CONSTRAINT "FK_4a627d8453d6630e2ff4c5853de"`);
        await queryRunner.query(`ALTER TABLE "template" DROP CONSTRAINT "FK_0b92e532069b6f50d288ae7289f"`);
        await queryRunner.query(`ALTER TABLE "template" DROP CONSTRAINT "FK_6d74b700ed9eb7bf3bee434a389"`);
        await queryRunner.query(`ALTER TABLE "template" DROP CONSTRAINT "FK_1dcaef121da417bb07dbd2551df"`);
        await queryRunner.query(`ALTER TABLE "template" DROP CONSTRAINT "FK_bc44347ed011f454a43027818ff"`);
        await queryRunner.query(`ALTER TABLE "permit_file" DROP CONSTRAINT "FK_423208597ba09b58db7355209a1"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561"`);
        await queryRunner.query(`ALTER TABLE "permit_log" DROP CONSTRAINT "FK_bf2d2aef10becdcfd354be9fb0a"`);
        await queryRunner.query(`ALTER TABLE "permit_log" DROP CONSTRAINT "FK_299322cc73d5128afa7bae9c8bd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_66a050e75bf7312d0379d8b4ff"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6165751a327ef5273f8ed5805f"`);
        await queryRunner.query(`DROP TABLE "permit_device"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e56d51ff781e9ead7ebb50b36c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_14147cddabd3275be41ad0df8e"`);
        await queryRunner.query(`DROP TABLE "permit_work_activity"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_96d26921e6aa2172256a55a6bc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_25f45e543fbda0c91da4af7a2a"`);
        await queryRunner.query(`DROP TABLE "role_menu"`);
        await queryRunner.query(`DROP TABLE "work_activity"`);
        await queryRunner.query(`DROP TABLE "permit"`);
        await queryRunner.query(`DROP TABLE "permit_sign"`);
        await queryRunner.query(`DROP TABLE "template"`);
        await queryRunner.query(`DROP TABLE "template_type"`);
        await queryRunner.query(`DROP TABLE "approval_type"`);
        await queryRunner.query(`DROP TABLE "permit_file"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP INDEX "public"."permit_log_pkey"`);
        await queryRunner.query(`DROP TABLE "permit_log"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "menu"`);
        await queryRunner.query(`DROP TABLE "device"`);
    }

}
