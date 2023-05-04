import {
	DynamicModule,
	FactoryProvider,
	Logger,
	Module,
	ModuleMetadata,
} from "@nestjs/common";
import { ProducerService } from "./producer.service";
import { ConsumerService } from "./consumer.service";
import { Kafka } from "kafkajs";

type KafkaModuleOptions = {
	brokers: string[];
	retryMs: number;
};

type KafkaAsyncModuleOptions = {
	useFactory: (
		...args: any[]
	) => Promise<KafkaModuleOptions> | KafkaModuleOptions;
} & Pick<ModuleMetadata, "imports"> &
	Pick<FactoryProvider, "inject">;

@Module({})
export class KafkaModule {
	private static logger = new Logger("KafkaModule");

	static async forRoot(options: KafkaModuleOptions): Promise<DynamicModule> {
		let kafka: Kafka;
		const brokers: string[] = options.brokers;
		while (true) {
			try {
				kafka = new Kafka({ brokers });
				break;
			} catch (err) {
				this.logger.error(
					"Error creating kafka instance. Retrying...",
					err
				);
				await new Promise((resolve) =>
					setTimeout(resolve, options.retryMs)
				);
			}
		}
		return {
			global: true,
			module: KafkaModule,
			providers: [
				{
					provide: "KAFKA",
					useValue: kafka,
				},
				{
					provide: "RETRY_MS",
					useValue: options.retryMs,
				},
				ProducerService,
				ConsumerService,
			],
			exports: [ConsumerService, ProducerService],
		};
	}

	static async forRootAsync(
		options: KafkaAsyncModuleOptions
	): Promise<DynamicModule> {
		const { useFactory, imports, inject } = options;
		let kafka: Kafka;
		return {
			global: true,
			module: KafkaModule,
			imports: imports,
			providers: [
				{
					provide: "KAFKA",
					useFactory: async (...args) => {
						const { brokers, retryMs } = await useFactory(...args);
						while (true) {
							try {
								kafka = new Kafka({ brokers });
								break;
							} catch (err) {
								this.logger.error(
									"Error creating kafka instance. Retrying...",
									err
								);
								await new Promise((resolve) =>
									setTimeout(resolve, retryMs)
								);
							}
						}
						return kafka;
					},
					inject: inject,
				},
				{
					provide: "RETRY_MS",
					useFactory: async (...args) => {
						const { retryMs } = await useFactory(...args);
						return retryMs;
					},
					inject: inject,
				},
				ProducerService,
				ConsumerService,
			],
			exports: [ConsumerService, ProducerService],
		};
	}
}