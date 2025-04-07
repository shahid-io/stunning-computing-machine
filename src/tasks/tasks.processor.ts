import { Process, Processor } from '@nestjs/bull';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { Job } from 'bull';
import { TaskStatus } from './enums/task-status.enum';

@Processor('tasks')
export class TasksProcessor {
    constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) { }

    @Process()
    async handleTask(job: Job<{ taskId: string }>) {
        const task = await this.taskModel.findById(job.data.taskId);
        if (!task) {
            console.error(`Task with ID ${job.data.taskId} not found`);
            return;
        }

        await new Promise(resolve => setTimeout(resolve, 2000));

        const shouldFail = Math.random() > 0.7;
        if (shouldFail) throw new Error('Simulated processing error');

        await this.taskModel.findByIdAndUpdate(task._id, {
            status: TaskStatus.Completed,
        });

        try {
            await this.taskModel.findByIdAndUpdate(task._id, {
                status: TaskStatus.Processing,
                attempts: task.attempts + 1,
            })
        } catch (error) {
            const attempts = task.attempts + 1;
            const status = attempts >= 3 ? TaskStatus.Failed : TaskStatus.Pending;

            await this.taskModel.findByIdAndUpdate(task._id, {
                status,
                attempts,
                errorMessage: error.message
            });

            if (status === TaskStatus.Failed) {
                throw error;
            }
        }
    }
}