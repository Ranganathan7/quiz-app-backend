import { Inject, Injectable, OnApplicationShutdown } from "@nestjs/common";
import {
	ConsumerConfig,
	ConsumerSubscribeTopics,
	Kafka,
	KafkaMessage,
} from "kafkajs";
import { KafkaConsumer } from "./kafka.consumer";

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
	private readonly consumers: KafkaConsumer[] = [];

	constructor(
		@Inject("KAFKA") private readonly kafka: Kafka,
		@Inject("RETRY_MS") private readonly retryMs: number
	) {}

	async consume(
		topic: ConsumerSubscribeTopics,
		config: ConsumerConfig,
		onMessage: (message: KafkaMessage, topic: string) => Promise<void>
	) {
		let consumer: KafkaConsumer;
		while (true) {
			try {
				consumer = new KafkaConsumer(
					topic,
					config,
					this.kafka,
					this.retryMs
				);
				break;
			} catch (err) {
				await new Promise((resolve) =>
					setTimeout(resolve, this.retryMs)
				);
			}
		}
		await consumer.connect();
		await consumer.consume(onMessage);
		this.consumers.push(consumer);
	}

	async onApplicationShutdown() {
		for (const consumer of this.consumers) {
			await consumer.disconnect();
		}
	}
}