import { Process, Processor } from '@nestjs/bull';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { Job } from 'bull';
import { TaskStatus } from './enums/task-status.enum';
import { getQueueConfig, QUEUE_PROCESSOR__NAMES } from '@utils/queue.utils';
import { ConfigService } from '@nestjs/config';

@Processor('tasks')
export class TasksProcessor {
    constructor(
        @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
        configService: ConfigService
    ) { 
        console.log(getQueueConfig(configService));
    }

    @Process('process')
    async handleTask(job: Job) {
        console.log(`Processing task with ID: ${job.data.taskId}`);
        const task = await this.taskModel.findById(job.data.taskId);
        if (!task) throw new Error(`Task ${job.data.taskId} not found`);

        try {
            await this.taskModel.findByIdAndUpdate(task._id, {
                status: TaskStatus.Processing,
                $inc: { attempts: 1 }
            });

            await new Promise(resolve => setTimeout(resolve, 2000));
            if (Math.random() > 0.7) throw new Error('Simulated failure');

            await this.taskModel.findByIdAndUpdate(task._id, {
                status: TaskStatus.Completed
            });
        } catch (error) {
            const attempts = task.attempts + 1;
            const isFinalAttempt = attempts >= 3;

            await this.taskModel.findByIdAndUpdate(task._id, {
                status: isFinalAttempt ? TaskStatus.Failed : TaskStatus.Pending,
                attempts,
                errorMessage: error.message
            });
            throw error;
        }
    }
}