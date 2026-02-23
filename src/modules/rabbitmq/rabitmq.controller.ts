import { Controller, Post, Body } from "@nestjs/common";
import { RabbitMQService } from "./rabbitmq.service";

@Controller('rabbitmq')
export class RabbitMQController {
    constructor(
        private readonly rabbitMQService: RabbitMQService,
    ) { }

    @Post('send')
    async sendMessage(@Body() body: { routingKey: string; message: any }) {
        await this.rabbitMQService.sendMessage(body.routingKey, body.message);
        return { success: true, message: 'Message sent successfully' };
    }
}
