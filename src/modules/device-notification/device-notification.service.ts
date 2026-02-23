import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { DeviceNotificationEntity } from "@/database/entities";

@Injectable()
export class DeviceNotificationService {
    constructor(
        @InjectRepository(DeviceNotificationEntity)
        private readonly deviceNotificationRepo: Repository<DeviceNotificationEntity>,
    ) { }

    async getLatestByDeviceIds(deviceIds: number[]) {
        if (!deviceIds.length) return [];

        return await this.deviceNotificationRepo
            .createQueryBuilder('n')
            .distinctOn(['n.deviceId'])
            .where('n.deviceId IN (:...deviceIds)', { deviceIds })
            .orderBy('n.deviceId')
            .addOrderBy('n.timestamp', 'DESC')
            .getMany();
    }

    async getListNotification(page: number, limit: number){
        return await this.deviceNotificationRepo.find({
            take: limit,
            skip: (page - 1) * limit,
            order: {
                timestamp: 'DESC'
            }
        });
    }
}