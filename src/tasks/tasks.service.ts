import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './schemas/task.schema';
import { CreateTaskInput } from './dto/create-task-input';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
@Injectable()
export class TasksService {
    constructor(
        @InjectModel(Task.name) private taskModel: Model<Task>,
        @InjectQueue('tasks') private readonly tasksQueue: Queue,
    ) { }

    async createTask(createTaskDto: CreateTaskInput) {
        const task = await this.taskModel.create(createTaskDto);
        await this.tasksQueue.add('process', { taskId: task._id });  
        return task;
    }
    async create(createTaskDto: CreateTaskInput): Promise<Task> {
        const createdTask = new this.taskModel(createTaskDto);
        return createdTask.save();
    }

    async findAll(): Promise<Task[]> {
        return this.taskModel.find().exec();
    }

    async findById(id: string): Promise<Task> {
        const task = await this.taskModel.findById(id).exec();
        if (!task) {
            throw new Error(`Task with id ${id} not found`);
        }
        return task;
    }

    async getTaskCounts() {
        const counts = await this.taskModel.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]);
        return counts.reduce((acc, { _id, count }) => {
            acc[_id] = count;
            return acc;
        }, {});
    }
}