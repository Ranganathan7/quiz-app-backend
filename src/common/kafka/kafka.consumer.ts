import { Logger } from "@nestjs/common";
import {
	Kafka,
	Consumer,
	ConsumerSubscribeTopics,
	ConsumerConfig,
	KafkaMessage,
} from "kafkajs";

export class KafkaConsumer {
	private readonly consumer: Consumer;
	private readonly logger: Logger;

	constructor(
		private readonly topic: ConsumerSubscribeTopics,
		private readonly config: ConsumerConfig,
		private readonly kafka: Kafka,
		private readonly retryMs: number
	) {
		this.logger = new Logger("KafkaConsumer");
		try {
			this.consumer = this.kafka.consumer(this.config);
		} catch (err) {
			this.logger.error(
				"Error creating consumer instance. Retrying...",
				err
			);
			throw err;
		}
	}

	async consume(
		onMessage: (message: KafkaMessage, topic: string) => Promise<void>
	) {
		try {
			await this.consumer.subscribe(this.topic);
			await this.consumer.run({
				eachMessage: async ({ message, partition, topic }) => {
					this.logger.debug(
						`Processing message from topic: ${topic} and partition: ${partition}`
					);
					try {
						await onMessage(message, topic);
					} catch (err) {
						throw err;
					}
				},
			});
		} catch (err) {
			this.logger.error("Error consuming message. Retrying...", err);
			await new Promise((resolve) => setTimeout(resolve, this.retryMs));
			this.consume(onMessage);
		}
	}

	async connect() {
		try {
			await this.consumer.connect();
		} catch (err) {
			this.logger.error("Failed to connect to kafka. Retrying...", err);
			await new Promise((resolve) => setTimeout(resolve, this.retryMs));
			await this.connect();
		}
	}

	async disconnect() {
		try {
			await this.consumer.disconnect();
		} catch (err) {
			this.logger.error(
				"Error disconnecting from kafka. Retrying...",
				err
			);
			await new Promise((resolve) => setTimeout(resolve, this.retryMs));
			await this.disconnect();
		}
	}
}