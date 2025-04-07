import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QUEUE_NAMES, getQueueConfig } from '@utils/queue.utils';

@Module({
    imports: [
        BullModule.registerQueueAsync({
            name: QUEUE_NAMES.TASKS,
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) =>
                getQueueConfig(configService),
            inject: [ConfigService],
        }),
    ],
})
export class TasksModule { }