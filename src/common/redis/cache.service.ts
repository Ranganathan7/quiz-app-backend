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
      this.logger.error('Error getting the value from cache. Retrying...', err);
      await new Promise((resolve) => setTimeout(resolve, this.retryMs));
      await this.get(key);
    }
  }

  async set(key: string, value: any): Promise<void> {
    try {
      if (typeof value === 'object') {
        value = JSON.stringify(value);
      }
      await this.redis.set(key, value, { EX: this.ttl });
    } catch (err) {
      this.logger.error(
        'Error setting the key and value in cache. Retrying...',
        err,
      );
      await new Promise((resolve) => setTimeout(resolve, this.retryMs));
      await this.set(key, value);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (err) {
      this.logger.error('Error deleting the key from cache. Retrying...', err);
      await new Promise((resolve) => setTimeout(resolve, this.retryMs));
      await this.delete(key);
    }
  }
}
