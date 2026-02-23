import { Controller, Get } from "@nestjs/common";
import { DeviceNotificationService } from "./device-notification.service";
import { Query } from "@nestjs/common";
import { Public } from "@/common/decorators/auth.decorator";


@Controller('device-notification')
export class DeviceNotificationController {
    constructor(private readonly deviceNotificationService: DeviceNotificationService) { }

    @Public()
    @Get()
    async getListNotification(@Query() query: { page: number, limit: number }) {
        return await this.deviceNotificationService.getListNotification(query.page, query.limit);
    }
}