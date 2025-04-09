import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskInput } from './dto/create-task-input';
import { NotFoundException } from '@nestjs/common';
import { Task } from './schemas/task.schema';

describe('TasksController', () => {
    let controller: TasksController;
    let service: TasksService;

    beforeEach(async () => {
        const mockTasksService = {
            createTask: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [TasksController],
            providers: [{ provide: TasksService, useValue: mockTasksService }],
        }).compile();

        controller = module.get<TasksController>(TasksController);
        service = module.get<TasksService>(TasksService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a task', async () => {
            const createTaskDto: CreateTaskInput = { name: 'Test Task', priority: 1 };
            const createdTask = {
                _id: '1',
                ...createTaskDto,
                $assertPopulated: jest.fn(),
                $clearModifiedPaths: jest.fn(),
                $clone: jest.fn(),
                $createModifiedPathsSnapshot: jest.fn(),
            } as any;

            jest.spyOn(service, 'createTask').mockResolvedValue(createdTask);

            const result = await controller.create(createTaskDto);

            expect(service.createTask).toHaveBeenCalledWith(createTaskDto);
            expect(result).toEqual({ _id: '1', message: 'Task submitted successfully' });
        });
    });

    describe('getAllTasks', () => {
        it('should return all tasks', async () => {
            const tasks = [
                { _id: '1', name: 'Task 1', type: 'type1', status: 'pending', attempts: 0, priority: 1 },
                { _id: '2', name: 'Task 2', type: 'type2', status: 'completed', attempts: 1, priority: 2 },
            ];

            jest.spyOn(service, 'findAll').mockResolvedValue(tasks);

            const result = await controller.getAllTasks();

            expect(service.findAll).toHaveBeenCalled();
            expect(result).toEqual(tasks);
        });
    });

    describe('getTaskById', () => {
        it('should return a task by ID', async () => {
            const task = { _id: '1', name: 'Task 1', type: 'type1', status: 'pending', attempts: 0, priority: 1 } as Task;

            jest.spyOn(service, 'findOne').mockResolvedValue(task);

            const result = await controller.getTaskById('1');

            expect(service.findOne).toHaveBeenCalledWith('1');
            expect(result).toEqual(task);
        });

        it('should throw NotFoundException if task is not found', async () => {
            jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException('Task not found'));

            await expect(controller.getTaskById('1')).rejects.toThrow(NotFoundException);
        });
    });
});
