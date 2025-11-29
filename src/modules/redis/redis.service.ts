import { Injectable, OnModuleInit, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService /* implements OnModuleInit */ {
  private readonly logger = new Logger(RedisService.name);

  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  async onModuleInit() {
    try {
      await this.cache.set('ping', 'pong', 3);
      const v = await this.cache.get('ping');

      if (v) {
        this.logger.log('Redis connected 🎉');
      } else {
        this.logger.warn('Redis reachable but cannot read/write key.');
      }
    } catch (e) {
      this.logger.error('Redis connection failed ❌', e);
    }
  }

  async set(key: string, value: number, ttl: number) {
    try {
      console.log(1);
      console.log(key, value, ttl);
      await this.cache.set(key, value, 50000);
      const val = await this.cache.get(key);
      console.log('Ping test:', val);
      return { message: 'success' };
    } catch (error) {
      console.log(error);
    }
  }

  async get(key: string) {
    console.log('get');
    return await this.cache.get(key);
  }

  async del(key: string) {
    await this.cache.del(key);
  }

  async testRedis() {
    await this.cache.set('ping', 'pong', 10);
    const val = await this.cache.get('ping');
    console.log('Ping test:', val); // phải ra 'pong'
  }
}
