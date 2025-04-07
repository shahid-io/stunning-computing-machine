import { BullModule, InjectQueue } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QUEUE_NAMES, getQueueConfig } from '@utils/queue.utils';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './schemas/task.schema';
import { TasksProcessor } from './tasks.processor';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
        BullModule.registerQueue({
            name: QUEUE_NAMES.TASKS,
            ...getQueueConfig(new ConfigService()),
            settings: {
                stalledInterval: 30000,
                maxStalledCount: 1
            }
        }),
    ],
    providers: [TasksService, TasksProcessor],
    controllers: [TasksController],
})
export class TasksModule {}