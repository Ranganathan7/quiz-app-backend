import { Injectable, Inject, Logger } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class CacheService {
  private readonly logger: Logger;

  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: RedisClientType,
    @Inject('TTL') private readonly ttl: number,
    @Inject('RETRY_MS') private readonly retryMs: number,
  ) {
    this.logger = new Logger('CacheService');
  }

  async get(key: string): Promise<string | null> {
    try {
      return this.redis.get(key);
    } catch (err) {
      await new Promise((resolve) => setTimeout(resolve, this.retryMs));
      await this.get(key);
    }
  }

  async set(key: string, value: any): Promise<void> {
    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }
    await this.redis.set(key, value, { EX: this.ttl });
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
