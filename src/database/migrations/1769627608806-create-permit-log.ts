import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePermitLog1769627608806 implements MigrationInterface {
    name = 'CreatePermitLog1769627608806'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "permit_log" ("id" SERIAL NOT NULL, "action" character varying(50) NOT NULL, "comment" text, "created_at" TIMESTAMP DEFAULT now(), "permit_id" integer, "user_id" integer, CONSTRAINT "PK_25b676c428ef6c8f57a5092761e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "permit_log_pkey" ON "permit_log" ("id") `);
        await queryRunner.query(`ALTER TABLE "approval_type" DROP COLUMN "code"`);
        await queryRunner.query(`ALTER TABLE "approval_type" ADD "code" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "permit_log" ADD CONSTRAINT "FK_299322cc73d5128afa7bae9c8bd" FOREIGN KEY ("permit_id") REFERENCES "permit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permit_log" ADD CONSTRAINT "FK_bf2d2aef10becdcfd354be9fb0a" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permit_log" DROP CONSTRAINT "FK_bf2d2aef10becdcfd354be9fb0a"`);
        await queryRunner.query(`ALTER TABLE "permit_log" DROP CONSTRAINT "FK_299322cc73d5128afa7bae9c8bd"`);
        await queryRunner.query(`ALTER TABLE "approval_type" DROP COLUMN "code"`);
        await queryRunner.query(`ALTER TABLE "approval_type" ADD "code" character varying(10) NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."permit_log_pkey"`);
        await queryRunner.query(`DROP TABLE "permit_log"`);
    }

}
