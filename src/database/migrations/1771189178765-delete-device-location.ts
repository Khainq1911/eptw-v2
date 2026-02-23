import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteDeviceLocation1771189178765 implements MigrationInterface {
    name = 'DeleteDeviceLocation1771189178765'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "location"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device" ADD "location" jsonb`);
    }

}
