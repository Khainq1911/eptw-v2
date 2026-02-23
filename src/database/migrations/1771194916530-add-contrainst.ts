import { MigrationInterface, QueryRunner } from "typeorm";

export class AddContrainst1771194916530 implements MigrationInterface {
    name = 'AddContrainst1771194916530'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device_notification" ADD "deviceId" integer`);
        await queryRunner.query(`ALTER TABLE "device_notification" ADD CONSTRAINT "FK_92142aaf3ef94632f8793ea8009" FOREIGN KEY ("deviceId") REFERENCES "device"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device_notification" DROP CONSTRAINT "FK_92142aaf3ef94632f8793ea8009"`);
        await queryRunner.query(`ALTER TABLE "device_notification" DROP COLUMN "deviceId"`);
    }

}
