import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

import { TasksService } from '../services/tasks.service';
import { TasksController } from '../controllers/tasks.controller';
import { TasksConsumer } from '../consumer/tasks.consumer';

import { MongoModule } from '../../../config/mongodb/mongo.module';
import { RabbitMQModule } from '../../../config/rabbitmq/rabbitmq.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [CacheModule.register(), MongoModule, RabbitMQModule, AuthModule],
  controllers: [TasksController],
  providers: [TasksService, TasksConsumer],
  exports: [TasksService],
})
export class TasksModule {}
