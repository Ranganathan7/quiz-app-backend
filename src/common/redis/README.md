# Redis Library
A library containing various methods for interacting with Redis.

<!-- ### Modules Installation
```bash
npm install
```

### Build
```bash
npm run build
```

### Installation
```bash
npm install "library-location"/redis
``` -->


## Starting a redis instance in docker
To run Redis in a local Docker container, you can follow these steps:

1. Pull the Redis image from Docker Hub:
```bash
docker pull redis
```

2. Start the Redis container:
```bash
docker run -d --name my-redis -p 6379:6379 redis
```


## Usage in microservices
Add the below code in imports array of app.module.ts file
```bash
RedisModule.forRoot({
    url: 'redis://localhost:6379',
    ttl: 300, // seconds (time to live)
    max: 100, // max items in cache
    retryMs: 2000, // milli seconds
})
// Or u can use forRootAsync method to get the variables from configService
RedisModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
        url: configService.get<string>('...'),
        ttl: configService.get<number>('...'),
        max: configService.get<number>('...'),
        retryMs: configService.get<number>('...'),
    }),
    inject: [ConfigService],
})
```

Initialize the CacheService in the service constructor
```bash
constructor(private readonly cacheService: CacheService) { }
```

Use get / set methods to retrieve and store data in Redis.
```bash
// Setting value in cache
await this.cacheService.set('key', 'value', ttl)

// Getting value from cache
await this.cacheService.get('key')
```