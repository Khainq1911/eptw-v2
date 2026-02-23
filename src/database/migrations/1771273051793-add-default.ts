import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDefault1771273051793 implements MigrationInterface {
    name = 'AddDefault1771273051793'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device_notification" ALTER COLUMN "timestamp" SET DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device_notification" ALTER COLUMN "timestamp" DROP DEFAULT`);
    }

}
