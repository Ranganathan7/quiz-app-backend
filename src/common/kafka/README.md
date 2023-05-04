# Kafka Library
A library containing kafka producer and consumer methods.

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
npm install <library-location>/kafka
``` -->

## Starting Kafka using docker-compose
```bash
docker-compose up -d
```

## Stopping Kafka using docker-compose
```bash
docker-compose down
```

## Usage in microservices

Import the KafkaModule using 
```bash
import { KafkaModule } from '@project-ahmedabad/kafka';
```

Add the below code in imports array of app.module.ts file
```bash
KafkaModule.forRoot({
    brokers: ['localhost:9092'],
    retryMs: 2000, // milli seconds
})
// Or u can use forRootAsync method to get the variables from configService
KafkaModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
        brokers: configService.get<string[]>('...'),
        retryMs: configService.get<number>('...'),
    }),
    inject: [ConfigService],
})
```

Import the ProducerService and ConsumerService in the service using 
```bash
import { ProducerService, ConsumerService } from '@project-ahmedabad/kafka';
```

Initialize the ProducerService and ConsumerService in the service constructor
```bash
constructor(
    private readonly producerService: ProducerService, 
    private readonly consumerService: ConsumerService
) {}
```

Use produce method from producerService to produce a message to a topic.
```bash
await this.producerService.produce('yourTopic', { value: 'Your Message' })
```

Use consume method from consumerService to consume messages from a topic.
```bash
await this.consumerService.consume(
    { topics: ['yourTopic'] },
    { groupId: `yourGroupId` },
    async (newMessage, topic) => {
        // Your Logic to be exceuted when a new message is pushed into that topic
        console.log(newMessage.value, 'from topic: ', topic);
    },
);
```
