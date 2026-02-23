import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableDeviceNotitfication1771194508038 implements MigrationInterface {
    name = 'AddTableDeviceNotitfication1771194508038'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."device_notification_type_enum" AS ENUM('location', 'notification', 'warning')`);
        await queryRunner.query(`CREATE TABLE "device_notification" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "device_id" integer NOT NULL, "type" "public"."device_notification_type_enum" NOT NULL, "message" character varying, "detail" jsonb, CONSTRAINT "PK_a2476f2211a311a57d3e4f726bf" PRIMARY KEY ("id", "timestamp"))`);
        await queryRunner.query(`CREATE INDEX "idx_device_notification_timestamp" ON "device_notification" ("timestamp") `);
        await queryRunner.query(`
            SELECT create_hypertable('device_notification', 'timestamp', if_not_exists => TRUE);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."idx_device_notification_timestamp"`);
        await queryRunner.query(`DROP TABLE "device_notification"`);
        await queryRunner.query(`DROP TYPE "public"."device_notification_type_enum"`);
    }

}
