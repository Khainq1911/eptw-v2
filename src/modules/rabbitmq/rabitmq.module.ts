import { Module } from "@nestjs/common";
import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { RabbitMQController } from "./rabitmq.controller";
import { RabbitMQService } from "./rabbitmq.service";
import { SocketModule } from "../socket/socket.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DeviceNotificationEntity } from "@/database/entities";

@Module({
    imports: [RabbitMQModule.forRoot({
        exchanges: [
            {
                name: 'eptw',
                type: 'direct',
            },
        ],
        uri: process.env.RABBITMQ_URI,
        connectionInitOptions: {
            wait: false,
        },
        channels: {
            default: {
                prefetchCount: 10,
                default: true,
            },
        },
        connectionManagerOptions: {
            heartbeatIntervalInSeconds: 15,
        }
    }), TypeOrmModule.forFeature([DeviceNotificationEntity]), SocketModule],
    controllers: [RabbitMQController],
    providers: [RabbitMQService],
    exports: [RabbitMQService],
})
export class RabbitModule { }