import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NewRelicModule } from './config/newrelic/new-relic.module';
import { RabbitMQModule } from './config/rabbitmq/rabbitmq.module';
import { RedisModule } from './config/redis/redis.module';
import { MongoModule } from './config/mongodb/mongo.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/modules/users.module';
import { TasksModule } from './modules/task/modules/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    NewRelicModule,
    RabbitMQModule,
    RedisModule,
    MongoModule,
    AuthModule,
    UsersModule,
    TasksModule,
  ],
})
export class AppModule {}