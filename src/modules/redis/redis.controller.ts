import { Body, Controller, Post } from '@nestjs/common';
import { RedisService } from './redis.service';

@Controller('redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @Post('ping')
  async ping() {
    await this.redisService.testRedis();
  }

  @Post('set')
  async set(@Body() payload: any) {
    console.log(payload);
    return await this.redisService.set(payload.key, payload.value, payload.ttl);
  }

  @Post('get')
  async get(@Body() payload: any) {
    return await this.redisService.get(payload.key);
  }

  @Post('del')
  async del(@Body() payload: any) {
    await this.redisService.del(payload.key);
  }
}
