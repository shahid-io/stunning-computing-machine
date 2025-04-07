import { Controller, Post, Body, Get, Param } from '@nestjs/common';
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
        return { data: task, message: 'Task submitted successfully' };
    }
}