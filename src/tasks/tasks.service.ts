import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './schemas/task.schema';
import { CreateTaskInput } from './dto/create-task-input';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { TaskStatus } from './enums/task-status.enum';

@Injectable()
export class TasksService {
    constructor(
        @InjectModel(Task.name) private taskModel: Model<Task>,
        @InjectQueue('tasks') private readonly tasksQueue: Queue,
    ) { }

    async createTask(createTaskDto: CreateTaskInput) {
        const task = await this.taskModel.create({
            ...createTaskDto,
            status: TaskStatus.Pending,
            attempts: 0
        });

        await this.tasksQueue.add('process', {
            taskId: task._id.toString()
        }, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000
            }
        });

        return task;
    }
    async findAll(): Promise<Task[]> {
        return this.taskModel.find().exec();
    }

    async findOne(id: string): Promise<Task> {
        const task = await this.taskModel.findById(id).exec();
        if (!task) {
            throw new Error(`Task with id ${id} not found`);
        }
        return task;
    }
}