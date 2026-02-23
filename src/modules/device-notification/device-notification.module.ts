import { Module } from "@nestjs/common";
import { DeviceNotificationController } from "./device-notification.controller";
import { DeviceNotificationService } from "./device-notification.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DeviceNotificationEntity } from "@/database/entities";

@Module({
    imports: [TypeOrmModule.forFeature([DeviceNotificationEntity])],
    controllers: [DeviceNotificationController],
    providers: [DeviceNotificationService],
    exports: [DeviceNotificationService],
})
export class DeviceNotificationModule { }