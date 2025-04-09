import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getModelToken } from '@nestjs/mongoose';
import { getQueueToken } from '@nestjs/bull';
import { Task } from './schemas/task.schema';
import { Queue } from 'bull';
import { NotFoundException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;
  let taskModel: any;
  let taskQueue: Queue;

  beforeEach(async () => {
    const mockTaskModel = {
      create: jest.fn(),
      find: jest.fn().mockReturnThis(),
      findById: jest.fn().mockReturnThis(),
      exec: jest.fn(),
    };

    const mockTaskQueue = {
      add: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getModelToken(Task.name), useValue: mockTaskModel },
        { provide: getQueueToken('tasks'), useValue: mockTaskQueue },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    taskModel = module.get(getModelToken(Task.name));
    taskQueue = module.get(getQueueToken('tasks'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTask', () => {
    it('should create a task and add it to the queue', async () => {
      const createTaskDto = { name: 'Test Task', priority: 1 };
      const createdTask = { _id: '1', ...createTaskDto, status: 'Pending' };

      taskModel.create.mockResolvedValue(createdTask);

      await service.createTask(createTaskDto);

      expect(taskModel.create).toHaveBeenCalledWith({
        ...createTaskDto,
        status: 'Pending',
      });
      expect(taskQueue.add).toHaveBeenCalledWith(
        'process',
        { taskId: '1' },
        { priority: 1, delay: 0 },
      );
    });
  });

  describe('findAll', () => {
    it('should return all tasks', async () => {
      const tasks = [{ _id: '1', name: 'Task 1' }, { _id: '2', name: 'Task 2' }];
      taskModel.exec.mockResolvedValue(tasks);

      const result = await service.findAll();

      expect(taskModel.find).toHaveBeenCalled();
      expect(result).toEqual(tasks);
    });
  });

  describe('findOne', () => {
    it('should return a task by ID', async () => {
      const task = { _id: '1', name: 'Task 1' };
      taskModel.exec.mockResolvedValue(task);

      const result = await service.findOne('1');

      expect(taskModel.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(task);
    });

    it('should throw NotFoundException if task is not found', async () => {
      taskModel.exec.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });
});
