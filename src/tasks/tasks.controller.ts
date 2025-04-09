import { Controller, Post, Body, Get, Param, NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskInput } from './dto/create-task-input';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Get()
    async getAllTasks() {
        return this.tasksService.findAll();
    }

    @Post()
    async create(@Body() createTaskDto: CreateTaskInput) {
        const task = await this.tasksService.createTask(createTaskDto);
        return { _id: task._id, message: 'Task submitted successfully' };
    }

    @Get('status')
    async getStatus() {
        const allTasks = await this.tasksService.findAll();
        const statusCounts = allTasks.reduce((acc, task) => {
            acc[task.status] = (acc[task.status] || 0) + 1;
            return acc;
        }, {});
        return statusCounts;
    }

    @Get(':id')
    async getTaskById(@Param('id') id: string) {
        const task = await this.tasksService.findOne(id);
        if (!task) {
            throw new NotFoundException('Task not found');
        }
        return task;
    }

}