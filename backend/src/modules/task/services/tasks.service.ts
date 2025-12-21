import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { ObjectId } from 'mongodb';
import * as newrelic from 'newrelic';

import { MongoService } from '../../../config/mongodb/mongo.service';
import { RabbitMQService } from '../../../config/rabbitmq/rabbitmq.service';

import { Task, TaskStatus } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    private readonly mongoService: MongoService,
    private readonly rabbitMQService: RabbitMQService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  private get collection() {
    return this.mongoService.getDb().collection<Task>('tasks');
  }

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const now = new Date();

    const task: Task = {
      ...createTaskDto,
      userId,
      status: TaskStatus.PENDING,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    };

    const { insertedId } = await this.collection.insertOne(task);
    const savedTask: Task = { ...task, _id: insertedId };

    await this.cacheManager.del(`tasks:user:${userId}`);

    await this.rabbitMQService.publish('tasks', 'task.created', {
      taskId: insertedId.toString(),
      userId,
      title: task.title,
      timestamp: now.toISOString(),
    });

    newrelic.recordCustomEvent('TaskCreated', {
      taskId: insertedId.toString(),
      userId,
      title: task.title,
    });

    return savedTask;
  }

  async findAll(userId: string): Promise<Task[]> {
    const cacheKey = `tasks:user:${userId}`;

    const cached = await this.cacheManager.get<Task[]>(cacheKey);
    if (cached) {
      newrelic.recordMetric('Custom/Cache/Hit', 1);
      return cached;
    }

    newrelic.recordMetric('Custom/Cache/Miss', 1);

    const tasks = await this.collection
      .find({ userId, isDeleted: false })
      .sort({ createdAt: -1 })
      .toArray();

    await this.cacheManager.set(cacheKey, tasks, 300000);

    return tasks;
  }

  async findOne(id: string, userId: string): Promise<Task> {
    const task = await this.collection.findOne({
      _id: new ObjectId(id),
      userId,
      isDeleted: false,
    });

    if (!task) {
      throw new NotFoundException(`Tarefa com ID ${id} não encontrada`);
    }

    return task;
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
  ): Promise<Task> {
    const result = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id), userId, isDeleted: false },
      {
        $set: {
          ...updateTaskDto,
          updatedAt: new Date(),
        },
      },
      {
        returnDocument: 'after',
      },
    );

    if (!result) {
      throw new NotFoundException(`Tarefa com ID ${id} não encontrada`);
    }

    await this.cacheManager.del(`tasks:user:${userId}`);

    await this.rabbitMQService.publish('tasks', 'task.updated', {
      taskId: id,
      userId,
      changes: updateTaskDto,
      timestamp: new Date().toISOString(),
    });

    return result;
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.collection.updateOne(
      { _id: new ObjectId(id), userId, isDeleted: false },
      {
        $set: {
          isDeleted: true,
          updatedAt: new Date(),
        },
      },
    );

    if (!result.matchedCount) {
      throw new NotFoundException(`Tarefa com ID ${id} não encontrada`);
    }

    await this.cacheManager.del(`tasks:user:${userId}`);

    await this.rabbitMQService.publish('tasks', 'task.deleted', {
      taskId: id,
      userId,
      timestamp: new Date().toISOString(),
    });

    newrelic.recordCustomEvent('TaskDeleted', {
      taskId: id,
      userId,
    });
  }

  async markAsDone(id: string, userId: string): Promise<Task> {
    const result = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id), userId, isDeleted: false },
      {
        $set: {
          status: TaskStatus.DONE,
          completedAt: new Date(),
          updatedAt: new Date(),
        },
      },
      {
        returnDocument: 'after',
      },
    );

    if (!result) {
      throw new NotFoundException(`Tarefa com ID ${id} não encontrada`);
    }

    await this.cacheManager.del(`tasks:user:${userId}`);

    await this.rabbitMQService.publish('tasks', 'task.completed', {
      taskId: id,
      userId,
      title: result.title,
      completedAt: result.completedAt,
      timestamp: new Date().toISOString(),
    });

    return result;
  }

  async getStats(userId: string) {
    const tasks = await this.collection
      .find({ userId, isDeleted: false })
      .toArray();

    return {
      total: tasks.length,
      pending: tasks.filter((t) => t.status === TaskStatus.PENDING).length,
      inProgress: tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS)
        .length,
      done: tasks.filter((t) => t.status === TaskStatus.DONE).length,
    };
  }
}
