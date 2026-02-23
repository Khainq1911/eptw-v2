import { AmqpConnection, RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DeviceNotificationEntity } from "@/database/entities";
import { SocketGateway } from "../socket/socket.gateway";
import { DeviceNotificationDto } from "./rabbitmq.dto";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";

@Injectable()
export class RabbitMQService implements OnModuleInit {
    private readonly logger = new Logger(RabbitMQService.name);

    constructor(
        private readonly amqpConnection: AmqpConnection,
        @InjectRepository(DeviceNotificationEntity)
        private readonly deviceNotificationRepository: Repository<DeviceNotificationEntity>,
        private readonly socketGateway: SocketGateway,
    ) { }

    async onModuleInit() {
        // Wait for connection to be ready
        const connection = this.amqpConnection;

        // Check connection and log
        const checkConnection = async () => {
            try {
                const channel = connection.channel;
                if (channel) {
                    this.logger.log('✅ RabbitMQ connected successfully');

                    // Assert queue - creates if not exists, skips if already exists
                    await channel.assertQueue('eptw-queue', {
                        durable: true,
                    });
                    this.logger.log('✅ Queue "eptw-queue " is ready');

                    // Bind queue to exchange with routing key
                    await channel.bindQueue('eptw-queue', 'eptw', 'notification.location');
                    this.logger.log('✅ Queue bound to exchange "eptw" with routing key "notification.location"');
                } else {
                    // Retry after short delay if channel not ready yet
                    setTimeout(checkConnection, 2000);
                }
            } catch (error) {
                this.logger.error('❌ RabbitMQ connection/setup failed:', error.message);
                setTimeout(checkConnection, 5000);
            }
        };

        // Delay initial check to allow connection to establish
        setTimeout(checkConnection, 3000);
    }

    async sendMessage(routingKey: string, message: any) {
        await this.amqpConnection.publish('eptw', routingKey, message);
        this.logger.log(`📤 Message sent to "${routingKey}"`);
    }

    @RabbitSubscribe({ exchange: 'eptw', routingKey: 'notification.location', queue: 'eptw-queue', queueOptions: { durable: true } })
    public async handleNotificationLocation(msg: any) {
        this.logger.log(`📥 Message received: ${JSON.stringify(msg)}`);
        try {
            const dto = plainToInstance(DeviceNotificationDto, msg);
            await validateOrReject(dto);
            const saved = await this.deviceNotificationRepository.save(dto);
            this.socketGateway.sendNotification(saved);
            this.logger.log(`✅ Notification saved and sent via socket`);
        } catch (error) {
            this.logger.error(`❌ Failed to process notification: ${error}`);
        }
    }
}