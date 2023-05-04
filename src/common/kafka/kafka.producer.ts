import { Logger } from "@nestjs/common";
import { Kafka, Message, Partitioners, Producer } from "kafkajs";

export class KafkaProducer {
	private readonly producer: Producer;
	private readonly logger: Logger;

	constructor(
		private readonly topic: string,
		private readonly kafka: Kafka,
		private readonly retryMs: number
	) {
		this.logger = new Logger("KafkaProducer");
		try {
			this.producer = this.kafka.producer({
				createPartitioner: Partitioners.LegacyPartitioner,
			});
		} catch (err) {
			this.logger.error(
				"Error creating producer instance. Retrying...",
				err
			);
			throw err;
		}
	}

	async produce(message: Message) {
		try {
			await this.producer.send({
				topic: this.topic,
				messages: [message],
			});
		} catch (err) {
			this.logger.error(
				`Failed to produce the messages: ${message} in topic: ${this.topic}. Retrying..`,
				err
			);
			await new Promise((resolve) => setTimeout(resolve, this.retryMs));
			await this.produce(message);
		}
	}

	async connect() {
		try {
			await this.producer.connect();
		} catch (err) {
			this.logger.error("Falied to connect to kafka. Retrying...", err);
			await new Promise((resolve) => setTimeout(resolve, this.retryMs));
			await this.connect();
		}
	}

	async disconnect() {
		try {
			await this.producer.disconnect();
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