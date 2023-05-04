import {
  DynamicModule,
  FactoryProvider,
  Logger,
  Module,
  ModuleMetadata,
} from '@nestjs/common';
import { createClient } from 'redis';
import { CacheService } from './cache.service';
import { RedisClientType } from 'redis';

type RedisModuleOptions = {
  url: string;
  ttl: number;
  max: number;
  retryMs: number;
};

type RedisAsyncModuleOptions = {
  useFactory: (
    ...args: any[]
  ) => Promise<RedisModuleOptions> | RedisModuleOptions;
} & Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider, 'inject'>;

@Module({})
export class RedisModule {
  private static logger = new Logger('RedisModule');

  static async forRoot(options: RedisModuleOptions): Promise<DynamicModule> {
    return {
      global: true,
      module: RedisModule,
      providers: [
        {
          provide: 'REDIS_CLIENT',
          useFactory: async () => {
            const { retryMs, ...redisOptions } = options;
            let client: RedisClientType;
            while (true) {
              try {
                client = createClient(redisOptions);
                await client.connect();
                break;
              } catch (err) {
                this.logger.error(
                  'Error connecting to redis. Retrying...',
                  err,
                );
                await new Promise((resolve) => setTimeout(resolve, retryMs));
              }
            }
            return client;
          },
        },
        {
          provide: 'TTL',
          useFactory: async () => {
            const { ttl } = options;
            return ttl;
          },
        },
        {
          provide: 'RETRY_MS',
          useFactory: async () => {
            const { retryMs } = options;
            return retryMs;
          },
        },
        CacheService,
      ],
      exports: [CacheService],
    };
  }

  static async forRootAsync(
    options: RedisAsyncModuleOptions,
  ): Promise<DynamicModule> {
    const { useFactory, imports, inject } = options;
    return {
      global: true,
      module: RedisModule,
      imports: imports,
      providers: [
        {
          provide: 'REDIS_CLIENT',
          useFactory: async (...args) => {
            const { retryMs, ...redisOptions } = await useFactory(...args);
            let client: RedisClientType;
            while (true) {
              try {
                client = createClient(redisOptions);
                await client.connect();
                break;
              } catch (err) {
                this.logger.error(
                  'Error connecting to redis. Retrying...',
                  err,
                );
                await new Promise((resolve) => setTimeout(resolve, retryMs));
              }
            }
            return client;
          },
          inject: inject,
        },
        {
          provide: 'TTL',
          useFactory: async (...args) => {
            const { ttl } = await useFactory(...args);
            return ttl;
          },
          inject: inject,
        },
        {
          provide: 'RETRY_MS',
          useFactory: async (...args) => {
            const { retryMs } = await useFactory(...args);
            return retryMs;
          },
          inject: inject,
        },
        CacheService,
      ],
      exports: [CacheService],
    };
  }
}
