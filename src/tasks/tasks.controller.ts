import { Controller, Post, Body, Get, Param, NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskInput } from './dto/create-task-input';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all tasks' })
  @ApiResponse({ status: 200, description: 'All tasks retrieved successfully.' })
  async getAllTasks() {
    return this.tasksService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully.' })
  async create(@Body() createTaskDto: CreateTaskInput) {
    const task = await this.tasksService.createTask(createTaskDto);
    return { _id: task._id, message: 'Task submitted successfully' };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a task by ID' })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  async getTaskById(@Param('id') id: string) {
    const task = await this.tasksService.findOne(id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }
}