import { Inject, Injectable, OnApplicationShutdown } from "@nestjs/common";
import { Kafka, Message } from "kafkajs";
import { KafkaProducer } from "./kafka.producer";

@Injectable()
export class ProducerService implements OnApplicationShutdown {
	private readonly producers = new Map<string, KafkaProducer>();
	constructor(
		@Inject("KAFKA") private readonly kafka: Kafka,
		@Inject("RETRY_MS") private readonly retryMs: number
	) {}

	async produce(topic: string, message: Message) {
		const producer = await this.getProducer(topic);
		await producer.produce(message);
	}

	private async getProducer(topic: string) {
		let producer = this.producers.get(topic);
		if (!producer) {
			while (true) {
				try {
					producer = new KafkaProducer(
						topic,
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
		}
		await producer.connect();
		this.producers.set(topic, producer);
		return producer;
	}

	async onApplicationShutdown() {
		for (const producer of this.producers.values()) {
			await producer.disconnect();
		}
	}
}