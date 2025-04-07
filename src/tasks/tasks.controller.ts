// src/tasks/tasks.controller.ts
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskInput } from './dto/create-task-input';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Get('')
    async sample() {
        return {
            message: 'Hello from tasks',
        }
    }

    @Post()
    async create(@Body() createTaskDto: CreateTaskInput) {
        const task = await this.tasksService.createTask(createTaskDto);
        return { data: task, message: 'Task submitted successfully' };
    }

    @Get('status')
    async getStatus() {
        return this.tasksService.getTaskCounts();
    }

    @Get(':id')
    async getTask(@Param('id') id: string) {
        const task = await this.tasksService.findById(id);
        if (!task) throw new Error('Task not found');
        return task;
    }
}