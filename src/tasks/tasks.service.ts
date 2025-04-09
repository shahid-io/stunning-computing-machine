import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './schemas/task.schema';
import { CreateTaskInput } from './dto/create-task-input';
import { TaskStatus } from './enums/task-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectQueue('tasks') private taskQueue: Queue,
    @InjectModel(Task.name) private taskModel: Model<Task>,
  ) {}

  async createTask(createTaskDto: CreateTaskInput) {
    const task = await this.taskModel.create({
      ...createTaskDto,
      status: TaskStatus.Pending,
    });

    const options = {
      priority: task.priority || 0, // Default priority is 0
      delay: task.scheduleAt ? new Date(task.scheduleAt).getTime() - Date.now() : 0,
    };

    await this.taskQueue.add(
      'process',
      { taskId: task._id.toString() },
      options,
    );

    return task;
  }

  async findAll(): Promise<Task[]> {
    return this.taskModel.find().exec();
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return task;
  }
}